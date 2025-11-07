// Intelligence Layer - Anomaly Detection & Pattern Recognition
// Following PRD: Minimum 5 data points, statistical significance
// Following .cursorrules: Show confidence, no claims without backing

import { Test, HormoneType, Pattern } from '../types';

/**
 * Detect anomalies in test values (>40% from average)
 */
export function detectAnomalies(test: Test, allTests: Test[]): {
  isAnomaly: boolean;
  percentageDiff: number;
  message: string;
} {
  // Get tests of same hormone type
  const sameHormoneTests = allTests.filter(
    t => t.hormoneType === test.hormoneType && t.id !== test.id
  );

  if (sameHormoneTests.length < 3) {
    return {
      isAnomaly: false,
      percentageDiff: 0,
      message: 'Need more tests to detect anomalies',
    };
  }

  // Calculate average
  const average = sameHormoneTests.reduce((sum, t) => sum + t.value, 0) / sameHormoneTests.length;
  
  // Calculate percentage difference
  const percentageDiff = Math.abs(((test.value - average) / average) * 100);

  if (percentageDiff > 40) {
    const direction = test.value > average ? 'higher' : 'lower';
    return {
      isAnomaly: true,
      percentageDiff: Math.round(percentageDiff),
      message: `This value is ${Math.round(percentageDiff)}% ${direction} than your average. Is this correct?`,
    };
  }

  return {
    isAnomaly: false,
    percentageDiff: Math.round(percentageDiff),
    message: '',
  };
}

/**
 * Detect patterns in user data (requires 5+ data points)
 */
export function detectPatterns(tests: Test[]): Pattern[] {
  if (tests.length < 5) return [];

  const patterns: Pattern[] = [];

  // Pattern 1: Day of week correlation
  const dayOfWeekPattern = detectDayOfWeekPattern(tests);
  if (dayOfWeekPattern) patterns.push(dayOfWeekPattern);

  // Pattern 2: Sleep quality correlation
  const sleepPattern = detectSleepCorrelation(tests);
  if (sleepPattern) patterns.push(sleepPattern);

  // Pattern 3: Exercise correlation
  const exercisePattern = detectExerciseCorrelation(tests);
  if (exercisePattern) patterns.push(exercisePattern);

  // Pattern 4: Stress correlation
  const stressPattern = detectStressCorrelation(tests);
  if (stressPattern) patterns.push(stressPattern);

  return patterns;
}

/**
 * Detect day of week patterns
 */
function detectDayOfWeekPattern(tests: Test[]): Pattern | null {
  const cortisolTests = tests.filter(t => t.hormoneType === HormoneType.CORTISOL);
  if (cortisolTests.length < 7) return null;

  const dayAverages: { [key: number]: number[] } = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  };

  cortisolTests.forEach(test => {
    const day = new Date(test.timestamp).getDay();
    dayAverages[day].push(test.value);
  });

  // Calculate average for each day
  const avgByDay = Object.entries(dayAverages)
    .filter(([_, values]) => values.length > 0)
    .map(([day, values]) => ({
      day: parseInt(day),
      avg: values.reduce((sum, v) => sum + v, 0) / values.length,
      count: values.length,
    }));

  if (avgByDay.length < 3) return null;

  // Find day with highest average
  const highest = avgByDay.reduce((max, curr) => 
    curr.avg > max.avg ? curr : max
  );

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Check if difference is significant (>20%)
  const overallAvg = cortisolTests.reduce((sum, t) => sum + t.value, 0) / cortisolTests.length;
  const diffPercent = ((highest.avg - overallAvg) / overallAvg) * 100;

  if (Math.abs(diffPercent) > 20) {
    return {
      id: `day-of-week-${Date.now()}`,
      type: 'cycle',
      description: `Your cortisol is consistently ${Math.round(Math.abs(diffPercent))}% ${diffPercent > 0 ? 'higher' : 'lower'} on ${dayNames[highest.day]}s`,
      confidence: highest.count >= 3 ? 'high' : 'medium',
      discoveredAt: new Date(),
      relatedTests: cortisolTests.map(t => t.id),
    };
  }

  return null;
}

/**
 * Detect sleep quality correlation
 */
function detectSleepCorrelation(tests: Test[]): Pattern | null {
  if (tests.length < 8) return null;

  const goodSleepTests = tests.filter(t => t.context.sleepQuality >= 4);
  const poorSleepTests = tests.filter(t => t.context.sleepQuality <= 2);

  if (goodSleepTests.length < 3 || poorSleepTests.length < 3) return null;

  // Compare testosterone levels
  const testosteroneGood = goodSleepTests
    .filter(t => t.hormoneType === HormoneType.TESTOSTERONE)
    .map(t => t.value);
  
  const testosteronePoor = poorSleepTests
    .filter(t => t.hormoneType === HormoneType.TESTOSTERONE)
    .map(t => t.value);

  if (testosteroneGood.length < 2 || testosteronePoor.length < 2) return null;

  const avgGood = testosteroneGood.reduce((sum, v) => sum + v, 0) / testosteroneGood.length;
  const avgPoor = testosteronePoor.reduce((sum, v) => sum + v, 0) / testosteronePoor.length;

  const diffPercent = ((avgGood - avgPoor) / avgPoor) * 100;

  if (diffPercent > 15) {
    return {
      id: `sleep-correlation-${Date.now()}`,
      type: 'correlation',
      description: `Good sleep (4-5★) correlates with ${Math.round(diffPercent)}% higher testosterone`,
      confidence: testosteroneGood.length >= 5 && testosteronePoor.length >= 5 ? 'high' : 'medium',
      discoveredAt: new Date(),
      relatedTests: [...goodSleepTests, ...poorSleepTests].map(t => t.id),
    };
  }

  return null;
}

/**
 * Detect exercise correlation
 */
function detectExerciseCorrelation(tests: Test[]): Pattern | null {
  if (tests.length < 8) return null;

  const exercisedTests = tests.filter(t => t.context.exercised);
  const notExercisedTests = tests.filter(t => !t.context.exercised);

  if (exercisedTests.length < 3 || notExercisedTests.length < 3) return null;

  // Check cortisol response to exercise
  const cortisolExercise = exercisedTests
    .filter(t => t.hormoneType === HormoneType.CORTISOL)
    .map(t => t.value);
  
  const cortisolRest = notExercisedTests
    .filter(t => t.hormoneType === HormoneType.CORTISOL)
    .map(t => t.value);

  if (cortisolExercise.length < 2 || cortisolRest.length < 2) return null;

  const avgExercise = cortisolExercise.reduce((sum, v) => sum + v, 0) / cortisolExercise.length;
  const avgRest = cortisolRest.reduce((sum, v) => sum + v, 0) / cortisolRest.length;

  const diffPercent = ((avgExercise - avgRest) / avgRest) * 100;

  if (Math.abs(diffPercent) > 12) {
    return {
      id: `exercise-correlation-${Date.now()}`,
      type: 'correlation',
      description: `Exercise days show ${Math.round(Math.abs(diffPercent))}% ${diffPercent > 0 ? 'higher' : 'lower'} cortisol (${diffPercent > 0 ? 'normal stress response' : 'recovery pattern'})`,
      confidence: cortisolExercise.length >= 5 ? 'high' : 'medium',
      discoveredAt: new Date(),
      relatedTests: [...exercisedTests, ...notExercisedTests].map(t => t.id),
    };
  }

  return null;
}

/**
 * Detect stress correlation
 */
function detectStressCorrelation(tests: Test[]): Pattern | null {
  if (tests.length < 8) return null;

  const highStressTests = tests.filter(t => t.context.stressLevel >= 4);
  const lowStressTests = tests.filter(t => t.context.stressLevel <= 2);

  if (highStressTests.length < 3 || lowStressTests.length < 3) return null;

  // Check cortisol levels
  const cortisolHigh = highStressTests
    .filter(t => t.hormoneType === HormoneType.CORTISOL)
    .map(t => t.value);
  
  const cortisolLow = lowStressTests
    .filter(t => t.hormoneType === HormoneType.CORTISOL)
    .map(t => t.value);

  if (cortisolHigh.length < 2 || cortisolLow.length < 2) return null;

  const avgHigh = cortisolHigh.reduce((sum, v) => sum + v, 0) / cortisolHigh.length;
  const avgLow = cortisolLow.reduce((sum, v) => sum + v, 0) / cortisolLow.length;

  const diffPercent = ((avgHigh - avgLow) / avgLow) * 100;

  if (diffPercent > 20) {
    return {
      id: `stress-correlation-${Date.now()}`,
      type: 'correlation',
      description: `High stress days show ${Math.round(diffPercent)}% elevated cortisol`,
      confidence: cortisolHigh.length >= 5 ? 'high' : 'medium',
      discoveredAt: new Date(),
      relatedTests: [...highStressTests, ...lowStressTests].map(t => t.id),
    };
  }

  return null;
}

/**
 * Get smart default values based on history and time
 */
export function getSmartDefaults(tests: Test[]): {
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  exercised: boolean;
  stressLevel: 1 | 2 | 3 | 4 | 5;
} {
  if (tests.length < 3) {
    // No history, use neutral defaults
    return {
      sleepQuality: 3,
      exercised: false,
      stressLevel: 3,
    };
  }

  // Get recent tests (last 5)
  const recentTests = tests.slice(0, Math.min(5, tests.length));

  // Calculate most common values
  const sleepValues = recentTests.map(t => t.context.sleepQuality);
  const avgSleep = Math.round(
    sleepValues.reduce((sum, v) => sum + v, 0) / sleepValues.length
  ) as 1 | 2 | 3 | 4 | 5;

  const stressValues = recentTests.map(t => t.context.stressLevel);
  const avgStress = Math.round(
    stressValues.reduce((sum, v) => sum + v, 0) / stressValues.length
  ) as 1 | 2 | 3 | 4 | 5;

  // Check if user usually exercises on this day of week
  const currentDay = new Date().getDay();
  const sameDayTests = tests.filter(t => new Date(t.timestamp).getDay() === currentDay);
  const exerciseRate = sameDayTests.filter(t => t.context.exercised).length / sameDayTests.length;
  const exercised = exerciseRate > 0.5;

  return {
    sleepQuality: avgSleep,
    exercised,
    stressLevel: avgStress,
  };
}

