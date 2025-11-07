// BioAge Calculation
// Following PRD: Start with chronological age, adjust based on hormone optimization
// Following .cursorrules: Show confidence, calculate statistical significance

import { Test, HormoneType, BioAge } from '../types';
import { differenceInYears } from 'date-fns';

/**
 * Calculate BioAge based on hormone levels
 * Following PRD algorithm:
 * - Start with chronological age
 * - For each hormone: -1 to +2 years based on optimization
 * - Trend factor: -0.5 to +0.5 years
 * - Consistency bonus: -1 year
 * - Recovery indicators: -0.5 to +1 year
 */
export function calculateBioAge(
  tests: Test[],
  birthYear: number
): BioAge {
  const currentYear = new Date().getFullYear();
  const chronologicalAge = currentYear - birthYear;

  if (tests.length === 0) {
    return {
      biologicalAge: chronologicalAge,
      chronologicalAge,
      difference: 0,
      confidence: 'low',
      basedOnTests: 0,
      lastUpdated: new Date(),
    };
  }

  let ageAdjustment = 0;

  // 1. Hormone Optimization (-1 to +2 years per hormone)
  const latestCortisol = getLatestTestByType(tests, HormoneType.CORTISOL);
  const latestTestosterone = getLatestTestByType(tests, HormoneType.TESTOSTERONE);
  const latestDHEA = getLatestTestByType(tests, HormoneType.DHEA);

  if (latestCortisol) {
    ageAdjustment += evaluateHormoneAge(
      HormoneType.CORTISOL,
      latestCortisol.value,
      latestCortisol.timestamp
    );
  }

  if (latestTestosterone) {
    ageAdjustment += evaluateHormoneAge(
      HormoneType.TESTOSTERONE,
      latestTestosterone.value
    );
  }

  if (latestDHEA) {
    ageAdjustment += evaluateHormoneAge(
      HormoneType.DHEA,
      latestDHEA.value
    );
  }

  // 2. Trend Factor (-0.5 to +0.5 years)
  const trendAdjustment = calculateTrendAdjustment(tests);
  ageAdjustment += trendAdjustment;

  // 3. Consistency Bonus (-1 year if testing regularly)
  if (isTestingConsistently(tests)) {
    ageAdjustment -= 1;
  }

  // 4. Recovery Indicators (-0.5 to +1 year)
  const recoveryAdjustment = calculateRecoveryAdjustment(tests);
  ageAdjustment += recoveryAdjustment;

  // Calculate final biological age
  const biologicalAge = Math.max(18, chronologicalAge + ageAdjustment); // Minimum 18
  const difference = chronologicalAge - biologicalAge; // Positive = younger

  // Determine confidence
  const confidence = getConfidence(tests);

  return {
    biologicalAge: Math.round(biologicalAge),
    chronologicalAge,
    difference: Math.round(difference),
    confidence,
    basedOnTests: tests.length,
    lastUpdated: new Date(),
  };
}

/**
 * Evaluate hormone's contribution to age (-1 to +2 years)
 */
function evaluateHormoneAge(
  hormoneType: HormoneType,
  value: number,
  timestamp?: Date
): number {
  if (hormoneType === HormoneType.CORTISOL) {
    const hour = timestamp ? new Date(timestamp).getHours() : 12;
    const isMorning = hour >= 6 && hour < 12;

    if (isMorning) {
      // Optimal morning cortisol: 12-20 ng/mL
      if (value >= 12 && value <= 20) return -1; // Optimal: younger
      if (value >= 10 && value < 12 || value > 20 && value <= 25) return 0; // Slightly off
      if (value < 10 || value > 25) return 1; // Poor: older
    } else {
      // Evening cortisol should be lower
      if (value <= 10) return -0.5; // Good
      if (value > 15) return 1; // Elevated evening cortisol
    }
  }

  if (hormoneType === HormoneType.TESTOSTERONE) {
    // Optimal: 300-1000 ng/dL
    if (value >= 300 && value <= 1000) return -1; // Optimal: younger
    if (value >= 250 && value < 300 || value > 1000 && value <= 1200) return 0; // Borderline
    if (value < 250) return 2; // Low testosterone ages you
    if (value > 1200) return 0.5; // Very high (maybe athlete)
  }

  if (hormoneType === HormoneType.DHEA) {
    // Optimal: 200-500 ng/dL
    if (value >= 200 && value <= 500) return -1; // Optimal: younger
    if (value >= 150 && value < 200 || value > 500 && value <= 600) return 0; // Borderline
    if (value < 150) return 1; // Low DHEA
    if (value > 600) return 0.5; // High
  }

  return 0;
}

/**
 * Calculate trend adjustment (-0.5 to +0.5 years)
 */
function calculateTrendAdjustment(tests: Test[]): number {
  if (tests.length < 5) return 0; // Need at least 5 tests for trends

  // Get tests from last 30 days vs previous 30 days
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);

  const recentTests = tests.filter(t => {
    const time = new Date(t.timestamp).getTime();
    return time >= thirtyDaysAgo;
  });

  const olderTests = tests.filter(t => {
    const time = new Date(t.timestamp).getTime();
    return time >= sixtyDaysAgo && time < thirtyDaysAgo;
  });

  if (recentTests.length < 2 || olderTests.length < 2) return 0;

  // Calculate average "health score" for each period
  const recentScore = calculateAverageHealthScore(recentTests);
  const olderScore = calculateAverageHealthScore(olderTests);

  // If improving significantly
  if (recentScore > olderScore * 1.1) return -0.5;
  
  // If declining significantly
  if (recentScore < olderScore * 0.9) return 0.5;

  return 0; // Stable
}

/**
 * Calculate average health score for tests
 */
function calculateAverageHealthScore(tests: Test[]): number {
  let totalScore = 0;
  let count = 0;

  tests.forEach(test => {
    if (test.hormoneType === HormoneType.CORTISOL) {
      // Optimal cortisol = high score
      if (test.value >= 12 && test.value <= 20) totalScore += 100;
      else if (test.value >= 10 && test.value <= 25) totalScore += 70;
      else totalScore += 40;
      count++;
    }

    if (test.hormoneType === HormoneType.TESTOSTERONE) {
      // Optimal testosterone = high score
      if (test.value >= 300 && test.value <= 1000) totalScore += 100;
      else if (test.value >= 250) totalScore += 70;
      else totalScore += 40;
      count++;
    }
  });

  return count > 0 ? totalScore / count : 50;
}

/**
 * Check if user is testing consistently (3+ per week for 4+ weeks)
 */
function isTestingConsistently(tests: Test[]): boolean {
  if (tests.length < 12) return false; // At least 12 tests needed

  const fourWeeksAgo = Date.now() - (28 * 24 * 60 * 60 * 1000);
  const recentTests = tests.filter(t => 
    new Date(t.timestamp).getTime() >= fourWeeksAgo
  );

  return recentTests.length >= 12; // Average 3+ per week
}

/**
 * Calculate recovery adjustment based on sleep/stress patterns
 */
function calculateRecoveryAdjustment(tests: Test[]): number {
  if (tests.length < 5) return 0;

  const recentTests = tests.slice(0, Math.min(10, tests.length));
  
  let goodSleepCount = 0;
  let poorSleepCount = 0;
  let highStressCount = 0;
  let lowStressCount = 0;

  recentTests.forEach(test => {
    if (test.context.sleepQuality >= 4) goodSleepCount++;
    if (test.context.sleepQuality <= 2) poorSleepCount++;
    if (test.context.stressLevel >= 4) highStressCount++;
    if (test.context.stressLevel <= 2) lowStressCount++;
  });

  let adjustment = 0;

  // Consistently good sleep
  if (goodSleepCount >= recentTests.length * 0.7) adjustment -= 0.5;
  
  // Consistently poor sleep
  if (poorSleepCount >= recentTests.length * 0.5) adjustment += 0.5;
  
  // Consistently high stress
  if (highStressCount >= recentTests.length * 0.5) adjustment += 0.5;

  return adjustment;
}

/**
 * Determine confidence level
 */
function getConfidence(tests: Test[]): 'low' | 'medium' | 'high' {
  const testCount = tests.length;
  
  // Check if we have tests for multiple hormones
  const hormoneTypes = new Set(tests.map(t => t.hormoneType));
  const hasMultipleHormones = hormoneTypes.size >= 2;

  if (testCount >= 20 && hasMultipleHormones) return 'high';
  if (testCount >= 10 && hasMultipleHormones) return 'medium';
  if (testCount >= 5) return 'medium';
  return 'low';
}

/**
 * Get latest test of a specific hormone type
 */
function getLatestTestByType(tests: Test[], hormoneType: HormoneType): Test | null {
  const filtered = tests.filter(t => t.hormoneType === hormoneType);
  return filtered.length > 0 ? filtered[0] : null;
}

