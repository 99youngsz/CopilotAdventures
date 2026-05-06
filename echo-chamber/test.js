/**
 * ============================================================================
 * ECHO CHAMBER - TEST SUITE
 * ============================================================================
 * 
 * Comprehensive test suite for the Echo Chamber application
 * Tests all core functionality, edge cases, and error handling
 * 
 * Run with: node test.js
 * ============================================================================
 */

const { SequencePredictor } = require('./index.js');

// Test counter and statistics
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Helper function to run a test
 * @param {string} testName - Name of the test
 * @param {function} testFn - Test function that should not throw
 */
function test(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   Error: ${error.message}`);
    failedTests++;
  }
}

/**
 * Helper function to assert equality
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @param {string} message - Optional error message
 */
function assertEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}. ${message}`
    );
  }
}

/**
 * Helper function to assert truthy
 * @param {*} value - Value to check
 * @param {string} message - Error message
 */
function assertTrue(value, message = '') {
  if (!value) {
    throw new Error(`Expected truthy value but got ${value}. ${message}`);
  }
}

/**
 * Helper function to assert falsy
 * @param {*} value - Value to check
 * @param {string} message - Error message
 */
function assertFalse(value, message = '') {
  if (value) {
    throw new Error(`Expected falsy value but got ${value}. ${message}`);
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║          🧪 ECHO CHAMBER TEST SUITE - LAUNCHING 🧪          ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('\n');

// ─────────────────────────────────────────────────────────────────────────
// 1. BASIC INITIALIZATION TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('📋 1. INITIALIZATION TESTS');
console.log('─'.repeat(62));

test('Should create a new SequencePredictor instance', () => {
  const predictor = new SequencePredictor();
  assertTrue(predictor instanceof SequencePredictor);
});

test('Should initialize with empty memories array', () => {
  const predictor = new SequencePredictor();
  assertEqual(predictor.memories.length, 0);
});

test('Should have getMemoryCount method returning 0 initially', () => {
  const predictor = new SequencePredictor();
  assertEqual(predictor.getMemoryCount(), 0);
});

// ─────────────────────────────────────────────────────────────────────────
// 2. INPUT VALIDATION TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 2. INPUT VALIDATION TESTS');
console.log('─'.repeat(62));

test('Should reject non-array input', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence('not an array');
  assertFalse(result.isValid);
  assertTrue(result.message.includes('must be an array'));
});

test('Should reject null input', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence(null);
  assertFalse(result.isValid);
});

test('Should reject sequence with less than 2 elements', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([5]);
  assertFalse(result.isValid);
  assertTrue(result.message.includes('at least 2'));
});

test('Should reject sequence with non-number elements', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([1, 'two', 3]);
  assertFalse(result.isValid);
  assertTrue(result.message.includes('valid numbers'));
});

test('Should reject sequence with NaN values', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([1, NaN, 3]);
  assertFalse(result.isValid);
});

test('Should reject non-arithmetic progression', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([1, 2, 4, 8]); // Geometric
  assertFalse(result.isValid);
  assertTrue(result.message.includes('not an arithmetic progression'));
});

// ─────────────────────────────────────────────────────────────────────────
// 3. ARITHMETIC PROGRESSION DETECTION TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 3. ARITHMETIC PROGRESSION DETECTION TESTS');
console.log('─'.repeat(62));

test('Should validate simple arithmetic progression [1, 2, 3]', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([1, 2, 3]);
  assertTrue(result.isValid);
  assertEqual(result.difference, 1);
});

test('Should validate progression with difference of 2', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([2, 4, 6, 8]);
  assertTrue(result.isValid);
  assertEqual(result.difference, 2);
});

test('Should validate progression with negative difference', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([10, 7, 4, 1]);
  assertTrue(result.isValid);
  assertEqual(result.difference, -3);
});

test('Should validate progression with difference of 0', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([5, 5, 5, 5]);
  assertTrue(result.isValid);
  assertEqual(result.difference, 0);
});

test('Should validate progression with decimal numbers', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([1.5, 3.0, 4.5]);
  assertTrue(result.isValid);
  assertEqual(result.difference, 1.5);
});

test('Should validate progression with negative numbers', () => {
  const predictor = new SequencePredictor();
  const result = predictor.validateSequence([-5, -3, -1, 1]);
  assertTrue(result.isValid);
  assertEqual(result.difference, 2);
});

// ─────────────────────────────────────────────────────────────────────────
// 4. SINGLE PREDICTION TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 4. SINGLE PREDICTION TESTS');
console.log('─'.repeat(62));

test('Should predict next number in [3, 6, 9, 12]', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([3, 6, 9, 12]);
  assertTrue(result.success);
  assertEqual(result.predictions, [15]);
});

test('Should predict next number in [1, 2, 3, 4, 5]', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1, 2, 3, 4, 5]);
  assertTrue(result.success);
  assertEqual(result.predictions, [6]);
});

test('Should predict next number in [10, 5, 0, -5]', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([10, 5, 0, -5]);
  assertTrue(result.success);
  assertEqual(result.predictions, [-10]);
});

test('Should handle decimal predictions', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1.5, 3.0, 4.5]);
  assertTrue(result.success);
  assertEqual(result.predictions, [6.0]);
});

// ─────────────────────────────────────────────────────────────────────────
// 5. MULTIPLE PREDICTIONS TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 5. MULTIPLE PREDICTIONS TESTS');
console.log('─'.repeat(62));

test('Should predict next 3 numbers in [3, 6, 9, 12]', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([3, 6, 9, 12], 3);
  assertTrue(result.success);
  assertEqual(result.predictions, [15, 18, 21]);
});

test('Should predict next 5 numbers in [2, 4, 6]', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([2, 4, 6], 5);
  assertTrue(result.success);
  assertEqual(result.predictions, [8, 10, 12, 14, 16]);
});

test('Should predict next 10 numbers', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1, 2], 10);
  assertTrue(result.success);
  assertEqual(result.predictions.length, 10);
  assertEqual(result.predictions[0], 3);
  assertEqual(result.predictions[9], 12);
});

test('Should handle maximum count (100)', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1, 2], 100);
  assertTrue(result.success);
  assertEqual(result.predictions.length, 100);
});

// ─────────────────────────────────────────────────────────────────────────
// 6. COUNT PARAMETER VALIDATION TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 6. COUNT PARAMETER VALIDATION TESTS');
console.log('─'.repeat(62));

test('Should reject count of 0', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1, 2, 3], 0);
  assertFalse(result.success);
});

test('Should reject count greater than 100', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1, 2, 3], 101);
  assertFalse(result.success);
});

test('Should reject non-numeric count', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1, 2, 3], 'five');
  assertFalse(result.success);
});

test('Should reject negative count', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1, 2, 3], -5);
  assertFalse(result.success);
});

// ─────────────────────────────────────────────────────────────────────────
// 7. MEMORY MANAGEMENT TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 7. MEMORY MANAGEMENT TESTS');
console.log('─'.repeat(62));

test('Should store memory after successful prediction', () => {
  const predictor = new SequencePredictor();
  predictor.predictNext([1, 2, 3]);
  assertEqual(predictor.getMemoryCount(), 1);
});

test('Should store multiple memories', () => {
  const predictor = new SequencePredictor();
  predictor.predictNext([1, 2, 3]);
  predictor.predictNext([2, 4, 6]);
  predictor.predictNext([5, 10, 15]);
  assertEqual(predictor.getMemoryCount(), 3);
});

test('Should not store memory for invalid sequences', () => {
  const predictor = new SequencePredictor();
  predictor.predictNext([1, 'two', 3]); // Invalid
  assertEqual(predictor.getMemoryCount(), 0);
});

test('Should retrieve stored memory correctly', () => {
  const predictor = new SequencePredictor();
  predictor.predictNext([3, 6, 9], 1);
  const memory = predictor.getMemory(1);
  assertTrue(memory !== null);
  assertEqual(memory.sequence, [3, 6, 9]);
  assertEqual(memory.predictions, [12]);
});

test('Should return null for non-existent memory', () => {
  const predictor = new SequencePredictor();
  const memory = predictor.getMemory(1);
  assertTrue(memory === null);
});

test('Should clear all memories', () => {
  const predictor = new SequencePredictor();
  predictor.predictNext([1, 2, 3]);
  predictor.predictNext([2, 4, 6]);
  assertEqual(predictor.getMemoryCount(), 2);
  predictor.clearMemories();
  assertEqual(predictor.getMemoryCount(), 0);
});

test('Should include timestamp in memory', () => {
  const predictor = new SequencePredictor();
  predictor.predictNext([1, 2, 3]);
  const memory = predictor.getMemory(1);
  assertTrue(memory.timestamp !== undefined);
  assertTrue(memory.timestamp.includes('T')); // ISO format check
});

test('Should store common difference in memory', () => {
  const predictor = new SequencePredictor();
  predictor.predictNext([3, 6, 9, 12]);
  const memory = predictor.getMemory(1);
  assertEqual(memory.commonDifference, 3);
});

// ─────────────────────────────────────────────────────────────────────────
// 8. EDGE CASES AND SPECIAL SCENARIOS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 8. EDGE CASES AND SPECIAL SCENARIOS');
console.log('─'.repeat(62));

test('Should handle very large numbers', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([1000000, 2000000, 3000000]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 4000000);
});

test('Should handle very small numbers', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([0.001, 0.002, 0.003]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 0.004);
});

test('Should handle mixed positive and negative', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([-2, -1, 0, 1, 2]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 3);
});

test('Should handle constant sequence (difference = 0)', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([7, 7, 7, 7]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 7);
});

test('Should handle two-element sequence', () => {
  const predictor = new SequencePredictor();
  const result = predictor.predictNext([5, 10]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 15);
});

// ─────────────────────────────────────────────────────────────────────────
// 9. REAL-WORLD SCENARIOS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 9. REAL-WORLD SCENARIOS');
console.log('─'.repeat(62));

test('Should predict Fibonacci-adjacent sequences', () => {
  const predictor = new SequencePredictor();
  // Not Fibonacci, but arithmetic: 1, 3, 5, 7...
  const result = predictor.predictNext([1, 3, 5, 7]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 9);
});

test('Should predict temperature sequence', () => {
  const predictor = new SequencePredictor();
  // Temperature increasing by 2 degrees each day
  const result = predictor.predictNext([68, 70, 72, 74]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 76);
});

test('Should predict year sequence', () => {
  const predictor = new SequencePredictor();
  // Years: 2020, 2021, 2022, 2023...
  const result = predictor.predictNext([2020, 2021, 2022, 2023]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 2024);
});

test('Should predict distance sequence', () => {
  const predictor = new SequencePredictor();
  // Constant velocity: 10m, 20m, 30m, 40m...
  const result = predictor.predictNext([10, 20, 30, 40]);
  assertTrue(result.success);
  assertEqual(result.predictions[0], 50);
});

// ─────────────────────────────────────────────────────────────────────────
// 10. INTEGRATION TESTS
// ─────────────────────────────────────────────────────────────────────────

console.log('\n📋 10. INTEGRATION TESTS');
console.log('─'.repeat(62));

test('Should handle complete workflow', () => {
  const predictor = new SequencePredictor();
  
  // Validate a sequence
  const validation = predictor.validateSequence([3, 6, 9, 12]);
  assertTrue(validation.isValid);
  
  // Make a prediction
  const result = predictor.predictNext([3, 6, 9, 12]);
  assertTrue(result.success);
  
  // Check memory
  assertEqual(predictor.getMemoryCount(), 1);
  
  // Retrieve memory
  const memory = predictor.getMemory(1);
  assertTrue(memory !== null);
});

test('Should handle multiple predictions with different sequences', () => {
  const predictor = new SequencePredictor();
  
  predictor.predictNext([1, 2, 3], 2);
  predictor.predictNext([10, 20, 30], 2);
  predictor.predictNext([-5, 0, 5], 2);
  
  assertEqual(predictor.getMemoryCount(), 3);
  
  const memory1 = predictor.getMemory(1);
  const memory2 = predictor.getMemory(2);
  const memory3 = predictor.getMemory(3);
  
  assertEqual(memory1.commonDifference, 1);
  assertEqual(memory2.commonDifference, 10);
  assertEqual(memory3.commonDifference, 5);
});

test('Should display all memories without error', () => {
  const predictor = new SequencePredictor();
  
  predictor.predictNext([1, 2, 3]);
  predictor.predictNext([2, 4, 6]);
  
  const displayText = predictor.displayAllMemories();
  assertTrue(displayText.length > 0);
  assertTrue(displayText.includes('Echo #1'));
  assertTrue(displayText.includes('Echo #2'));
});

// ─────────────────────────────────────────────────────────────────────────
// TEST SUMMARY
// ─────────────────────────────────────────────────────────────────────────

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║                    📊 TEST RESULTS SUMMARY 📊                ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('\n');
console.log(`Total Tests:   ${totalTests}`);
console.log(`Passed Tests:  ${passedTests} ✅`);
console.log(`Failed Tests:  ${failedTests} ❌`);
console.log(`Success Rate:  ${((passedTests / totalTests) * 100).toFixed(2)}%`);
console.log('\n');

if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED! Echo Chamber is ready to use! 🎉\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${failedTests} test(s) failed. Please review the errors above.\n`);
  process.exit(1);
}
