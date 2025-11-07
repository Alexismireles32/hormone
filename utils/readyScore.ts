// ReadyScore Calculation
// Following PRD: Start at 50, factor in hormones, sleep, stress, trends
// Following .cursorrules: Show confidence, calculate properly

import { Test, HormoneType, ReadyScore } from '../types';
import { isToday } from 'date-fns';

/**
 * Calculate ReadyScore (0-100) based on latest tests and context
 * Following PRD algorithm:
 * - Start at 50 baseline
 * - Add/subtract based on hormone optimization
 * - Factor in recovery indicators (sleep, stress)
 * - Include trend bonus (improving vs declining)
 * - Clamp between 0-100
 */
export function calculateReadyScore(tests: Test[]): ReadyScore {
  if (tests.length === 0) {
    return {
      score: 50,
      label: 'Good',
      color: 'yellow',
      lastUpdated: new Date(),
      confidence: 'low',
    };
  }

  let score = 50; // Baseline

  // Get most recent test of each hormone type
  const latestCortisol = getLatestTestByType(tests, HormoneType.CORTISOL);
  const latestTestosterone = getLatestTestByType(tests, HormoneType.TESTOSTERONE);
  const latestDHEA = getLatestTestByType(tests, HormoneType.DHEA);

  // Cortisol contribution (+/- 20 points)
  if (latestCortisol) {
    const cortisolScore = evaluateCortisol(latestCortisol.value, latestCortisol.timestamp);
    score += cortisolScore;
  }

  // Testosterone contribution (+/- 15 points)
  if (latestTestosterone) {
    const testosteroneScore = evaluateTestosterone(latestTestosterone.value);
    score += testosteroneScore;
  }

  // DHEA contribution (+/- 10 points)
  if (latestDHEA) {
    const dheaScore = evaluateDHEA(latestDHEA.value);
    score += dheaScore;
  }

  // Recovery indicators from most recent test (+/- 15 points)
  const mostRecentTest = tests[0]; // Already sorted newest first
  if (mostRecentTest) {
    // Sleep quality (up to +10 or -10)
    if (mostRecentTest.context.sleepQuality >= 4) {
      score += 10;
    } else if (mostRecentTest.context.sleepQuality <= 2) {
      score -= 10;
    } else if (mostRecentTest.context.sleepQuality === 3) {
      score += 5;
    }

    // Stress level (up to -10)
    if (mostRecentTest.context.stressLevel >= 4) {
      score -= 10;
    } else if (mostRecentTest.context.stressLevel <= 2) {
      score += 5;
    }

    // Exercise recovery (if exercised yesterday, bonus for recovery)
    if (!mostRecentTest.context.exercised) {
      score += 5; // Recovery day bonus
    }
  }

  // Trend bonus (+/- 10 points)
  const trendBonus = calculateTrendBonus(tests);
  score += trendBonus;

  // Clamp between 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine confidence
  const confidence = getConfidence(tests);

  // Determine label and color
  const { label, color } = getScoreLabel(score);

  return {
    score,
    label,
    color,
    lastUpdated: mostRecentTest ? new Date(mostRecentTest.timestamp) : new Date(),
    confidence,
  };
}

/**
 * Evaluate cortisol level (optimal: 12-20 ng/mL in morning)
 */
function evaluateCortisol(value: number, timestamp: Date): number {
  const hour = new Date(timestamp).getHours();
  const isMorning = hour >= 6 && hour < 12;

  if (isMorning) {
    if (value >= 12 && value <= 20) {
      return 20; // Optimal morning cortisol
    } else if (value >= 10 && value < 12 || value > 20 && value <= 25) {
      return 10; // Slightly off
    } else {
      return -10; // Very high or very low
    }
  } else {
    // Evening cortisol should be lower
    if (value <= 10) {
      return 15; // Good evening cortisol
    } else {
      return 0; // Elevated evening cortisol is common
    }
  }
}

/**
 * Evaluate testosterone level (optimal: 300-1000 ng/dL)
 */
function evaluateTestosterone(value: number): number {
  if (value >= 300 && value <= 1000) {
    return 15; // Optimal range
  } else if (value >= 250 && value < 300 || value > 1000 && value <= 1200) {
    return 5; // Borderline
  } else {
    return -10; // Low or very high
  }
}

/**
 * Evaluate DHEA level (optimal: 200-500 ng/dL)
 */
function evaluateDHEA(value: number): number {
  if (value >= 200 && value <= 500) {
    return 10; // Optimal range
  } else if (value >= 150 && value < 200 || value > 500 && value <= 600) {
    return 5; // Borderline
  } else {
    return -5; // Low or high
  }
}

/**
 * Calculate trend bonus (are levels improving or declining?)
 */
function calculateTrendBonus(tests: Test[]): number {
  if (tests.length < 3) return 0; // Need at least 3 tests

  // Get last 3 tests of each type and compare
  const cortisolTests = tests.filter(t => t.hormoneType === HormoneType.CORTISOL).slice(0, 3);
  const testosteroneTests = tests.filter(t => t.hormoneType === HormoneType.TESTOSTERONE).slice(0, 3);

  let bonus = 0;

  // Check cortisol trend (lower is better for evening, stable is good for morning)
  if (cortisolTests.length >= 2) {
    const recent = cortisolTests[0].value;
    const older = cortisolTests[cortisolTests.length - 1].value;
    if (recent < older * 0.9) bonus += 5; // Improving
    if (recent > older * 1.1) bonus -= 5; // Declining
  }

  // Check testosterone trend (higher is better)
  if (testosteroneTests.length >= 2) {
    const recent = testosteroneTests[0].value;
    const older = testosteroneTests[testosteroneTests.length - 1].value;
    if (recent > older * 1.1) bonus += 5; // Improving
    if (recent < older * 0.9) bonus -= 5; // Declining
  }

  return bonus;
}

/**
 * Determine confidence level based on test count and recency
 */
function getConfidence(tests: Test[]): 'low' | 'medium' | 'high' {
  if (tests.length === 0) return 'low';

  const hasRecentTest = tests.some(t => isToday(new Date(t.timestamp)));
  const testCount = tests.length;

  if (hasRecentTest && testCount >= 10) return 'high';
  if (hasRecentTest && testCount >= 5) return 'medium';
  if (testCount >= 10) return 'medium';
  return 'low';
}

/**
 * Get label and color based on score
 */
function getScoreLabel(score: number): { label: ReadyScore['label']; color: ReadyScore['color'] } {
  if (score >= 80) return { label: 'Ready', color: 'green' };
  if (score >= 60) return { label: 'Good', color: 'yellow' };
  if (score >= 40) return { label: 'Moderate', color: 'orange' };
  return { label: 'Recovering', color: 'red' };
}

/**
 * Get most recent test of a specific hormone type
 */
function getLatestTestByType(tests: Test[], hormoneType: HormoneType): Test | null {
  const filtered = tests.filter(t => t.hormoneType === hormoneType);
  return filtered.length > 0 ? filtered[0] : null;
}

/**
 * Get personalized protocol recommendations based on score
 */
export function getProtocolRecommendations(score: number): string[] {
  if (score >= 80) {
    return [
      '🏋️ Perfect day for high-intensity training',
      '💼 Schedule your most challenging tasks',
      '⚡ Your biology supports peak performance',
      '🎯 Great time for important decisions',
    ];
  }

  if (score >= 60) {
    return [
      '🏃 Steady-state cardio recommended',
      '📅 Good for routine tasks and meetings',
      '✅ Maintain current habits',
      '⚠️ Avoid overcommitting today',
    ];
  }

  if (score >= 40) {
    return [
      '🧘 Light movement only (walk, yoga)',
      '📋 Prioritize easy wins',
      '🛌 Focus on recovery activities',
      '💤 Early bedtime recommended',
    ];
  }

  return [
    '🛑 Rest day - no intense exercise',
    '🤝 Delegate demanding tasks if possible',
    '😴 Prioritize sleep and stress management',
    '🍵 Consider adaptogenic support',
  ];
}

