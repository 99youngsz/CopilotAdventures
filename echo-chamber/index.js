#!/usr/bin/env node

/**
 * ============================================================================
 * ECHO CHAMBER - Magical Number Sequence Prediction
 * ============================================================================
 * 
 * A mystical application that echoes numbers through the fabric of mathematics.
 * Using the power of arithmetic progressions, it predicts the next numbers
 * in magical sequences and stores the memories of all echoes.
 * 
 * @author Copilot Adventures
 * @version 1.0.0
 * @created 2026-05-06
 * ============================================================================
 */

const readline = require('readline');

// ============================================================================
// ARITHMETIC PROGRESSION SEQUENCE PREDICTOR CLASS
// ============================================================================

/**
 * SequencePredictor class manages arithmetic progression predictions
 * and stores the history of predictions in "memories"
 */
class SequencePredictor {
  /**
   * Initialize the sequence predictor with an empty memory array
   */
  constructor() {
    this.memories = [];
  }

  /**
   * Validates if a sequence forms a valid arithmetic progression
   * @param {number[]} sequence - The sequence to validate
   * @returns {object} - { isValid: boolean, difference: number|null, message: string }
   */
  validateSequence(sequence) {
    // Check if sequence exists and has at least 2 elements
    if (!sequence || !Array.isArray(sequence)) {
      return {
        isValid: false,
        difference: null,
        message: '❌ Error: Sequence must be an array'
      };
    }

    if (sequence.length < 2) {
      return {
        isValid: false,
        difference: null,
        message: '❌ Error: Sequence must contain at least 2 numbers'
      };
    }

    // Check if all elements are numbers
    const allNumbers = sequence.every(num => typeof num === 'number' && !isNaN(num));
    if (!allNumbers) {
      return {
        isValid: false,
        difference: null,
        message: '❌ Error: All elements must be valid numbers'
      };
    }

    // Check if sequence forms an arithmetic progression
    const differences = [];
    for (let i = 1; i < sequence.length; i++) {
      differences.push(sequence[i] - sequence[i - 1]);
    }

    // All differences should be equal
    const firstDiff = differences[0];
    const isArithmetic = differences.every(diff => diff === firstDiff);

    if (!isArithmetic) {
      return {
        isValid: false,
        difference: null,
        message: '❌ Error: Sequence is not an arithmetic progression. Differences are not consistent.'
      };
    }

    return {
      isValid: true,
      difference: firstDiff,
      message: `✅ Valid arithmetic progression with common difference: ${firstDiff}`
    };
  }

  /**
   * Predicts the next number(s) in an arithmetic sequence
   * @param {number[]} sequence - The sequence to predict from
   * @param {number} count - Number of predictions to make (default: 1)
   * @returns {object} - { success: boolean, predictions: number[]|null, message: string }
   */
  predictNext(sequence, count = 1) {
    // Validate the sequence
    const validation = this.validateSequence(sequence);
    
    if (!validation.isValid) {
      return {
        success: false,
        predictions: null,
        message: validation.message
      };
    }

    // Validate count parameter
    if (typeof count !== 'number' || count < 1 || count > 100) {
      return {
        success: false,
        predictions: null,
        message: '❌ Error: Count must be a number between 1 and 100'
      };
    }

    // Generate predictions
    const predictions = [];
    const diff = validation.difference;
    let lastNumber = sequence[sequence.length - 1];

    for (let i = 0; i < count; i++) {
      lastNumber += diff;
      predictions.push(lastNumber);
    }

    // Store memory of this prediction
    const memory = {
      timestamp: new Date().toISOString(),
      sequence: [...sequence],
      commonDifference: diff,
      predictions: predictions,
      sequenceString: sequence.join(', ')
    };

    this.memories.push(memory);

    return {
      success: true,
      predictions: predictions,
      message: `🔮 Echo resonates! Next ${count > 1 ? count + ' numbers' : 'number'}: ${predictions.join(', ')}`
    };
  }

  /**
   * Gets the nth prediction (1-indexed)
   * @param {number} n - Index of the memory to retrieve
   * @returns {object|null} - The memory object or null if not found
   */
  getMemory(n) {
    if (n < 1 || n > this.memories.length) {
      return null;
    }
    return this.memories[n - 1];
  }

  /**
   * Displays all stored memories
   * @returns {string} - Formatted string of all memories
   */
  displayAllMemories() {
    if (this.memories.length === 0) {
      return '📚 No echoes stored in memory yet';
    }

    let output = '\n📚 ECHO CHAMBER MEMORIES:\n';
    output += '='.repeat(60) + '\n';

    this.memories.forEach((memory, index) => {
      output += `\nEcho #${index + 1}:\n`;
      output += `  Original Sequence: [${memory.sequenceString}]\n`;
      output += `  Common Difference: ${memory.commonDifference}\n`;
      output += `  Predictions: [${memory.predictions.join(', ')}]\n`;
      output += `  Recorded at: ${new Date(memory.timestamp).toLocaleString()}\n`;
      output += '-'.repeat(60);
    });

    return output;
  }

  /**
   * Clears all stored memories
   */
  clearMemories() {
    this.memories = [];
  }

  /**
   * Gets the total count of stored memories
   * @returns {number} - Number of stored memories
   */
  getMemoryCount() {
    return this.memories.length;
  }
}

// ============================================================================
// INTERACTIVE CONSOLE INTERFACE
// ============================================================================

/**
 * Main application controller that manages the user interface and interactions
 */
class EchoChamberApp {
  constructor() {
    this.predictor = new SequencePredictor();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Displays the main welcome banner and story
   */
  displayWelcome() {
    console.clear();
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║              🌟 WELCOME TO THE ECHO CHAMBER 🌟              ║');
    console.log('║                                                              ║');
    console.log('║          Where Numbers Echo Through Mathematical Realms      ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('\n');
    
    console.log('📖 THE STORY OF THE ECHO CHAMBER:');
    console.log('━'.repeat(62));
    console.log(`
In an ancient temple hidden within mountains of mathematics, there exists
a mystical chamber known as the Echo Chamber. Numbers enter this chamber
and echo forward through an invisible mathematical path.

Each sequence of numbers that enters the chamber follows a sacred pattern:
an Arithmetic Progression - where each number differs from the last by the
same magical constant (the "common difference").

Your quest: Enter these sequences and discover what echoes they produce!
The chamber will reveal the next numbers in the sequence and remember every
echo that has ever resonated within its walls.

Will you help us unlock the secrets of the Echo Chamber?
    `);
    console.log('━'.repeat(62) + '\n');
  }

  /**
   * Displays the main menu options
   */
  displayMenu() {
    console.log('\n📋 ECHO CHAMBER MENU:');
    console.log('  1. Predict next number(s) in a sequence');
    console.log('  2. Test with sample sequence [3, 6, 9, 12]');
    console.log('  3. View all stored memories');
    console.log('  4. Clear all memories');
    console.log('  5. Exit the chamber\n');
  }

  /**
   * Prompts user for input and returns a promise
   * @param {string} question - The question to ask
   * @returns {Promise<string>} - User input
   */
  prompt(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }

  /**
   * Parses a comma-separated string into an array of numbers
   * @param {string} input - The input string
   * @returns {array} - Array of numbers or empty array if parsing fails
   */
  parseSequence(input) {
    try {
      return input
        .split(',')
        .map(str => {
          const num = parseFloat(str.trim());
          return isNaN(num) ? null : num;
        })
        .filter(num => num !== null);
    } catch (error) {
      return [];
    }
  }

  /**
   * Handles the sequence prediction flow
   */
  async handlePrediction() {
    console.log('\n🔮 SEQUENCE PREDICTION MODE');
    console.log('━'.repeat(62));
    console.log('Enter a sequence of numbers separated by commas.');
    console.log('Example: 2, 4, 6, 8\n');

    const input = await this.prompt('Enter your sequence: ');
    const sequence = this.parseSequence(input);

    if (sequence.length === 0) {
      console.log('❌ Invalid input. Please enter numbers separated by commas.');
      return;
    }

    const countInput = await this.prompt('\nHow many next numbers to predict? (default: 1): ');
    const count = parseInt(countInput) || 1;

    const result = this.predictor.predictNext(sequence, count);
    console.log('\n' + result.message);

    if (result.success) {
      console.log(`\n✨ Full sequence including predictions:`);
      console.log(`[${sequence.concat(result.predictions).join(', ')}]`);
    }
  }

  /**
   * Handles the sample sequence test
   */
  async handleSampleTest() {
    console.log('\n🧪 TESTING WITH SAMPLE SEQUENCE');
    console.log('━'.repeat(62));

    const sampleSequence = [3, 6, 9, 12];
    console.log(`Testing sequence: [${sampleSequence.join(', ')}]\n`);

    // Validate the sequence
    const validation = this.predictor.validateSequence(sampleSequence);
    console.log(`Validation: ${validation.message}`);

    // Predict next 3 numbers
    const result = this.predictor.predictNext(sampleSequence, 3);
    console.log(`\n${result.message}`);

    if (result.success) {
      console.log(`\nExpected: [3, 6, 9, 12, 15, 18, 21]`);
      console.log(`Got:      [${sampleSequence.concat(result.predictions).join(', ')}]`);
      console.log(`\n✅ Sample test completed successfully!`);
    }
  }

  /**
   * Handles viewing all memories
   */
  handleViewMemories() {
    console.log(this.predictor.displayAllMemories());
  }

  /**
   * Handles clearing all memories
   */
  async handleClearMemories() {
    const confirm = await this.prompt(
      '\n⚠️  Are you sure you want to clear all memories? (yes/no): '
    );

    if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
      this.predictor.clearMemories();
      console.log('🧹 All memories have been cleared from the Echo Chamber.');
    } else {
      console.log('❌ Memories have been preserved.');
    }
  }

  /**
   * Main application loop
   */
  async run() {
    this.displayWelcome();

    let running = true;
    while (running) {
      this.displayMenu();
      const choice = await this.prompt('Enter your choice (1-5): ');

      switch (choice.trim()) {
        case '1':
          await this.handlePrediction();
          break;
        case '2':
          await this.handleSampleTest();
          break;
        case '3':
          this.handleViewMemories();
          break;
        case '4':
          await this.handleClearMemories();
          break;
        case '5':
          console.log('\n👋 Thank you for visiting the Echo Chamber!');
          console.log(`📊 Total echoes recorded: ${this.predictor.getMemoryCount()}`);
          console.log('Farewell, seeker of mathematical mysteries!\n');
          running = false;
          break;
        default:
          console.log('❌ Invalid choice. Please select 1-5.');
      }
    }

    this.rl.close();
  }
}

// ============================================================================
// APPLICATION ENTRY POINT
// ============================================================================

/**
 * Initialize and run the application if this file is executed directly
 */
if (require.main === module) {
  const app = new EchoChamberApp();
  app.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

/**
 * Export classes for testing and external use
 */
module.exports = {
  SequencePredictor,
  EchoChamberApp
};
