// ============================================================================
// ITE 387: Advanced Programming - Kids Math Game
// Game Logic & Pure Mathematical Problem Generators
// ============================================================================

import { GAME_MODES, NUMBER_RANGE } from './config.js';

/**
 * Returns a random integer between min and max inclusive
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const getRandomInt = (min = NUMBER_RANGE.min, max = NUMBER_RANGE.max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Pure generator for addition problems (1–10)
 * @returns {Object} { text, answer, opA, opB, operator: '+' }
 */
export const generateAdditionProblem = () => {
    const a = getRandomInt();
    const b = getRandomInt();
    return {
        text: `${a} + ${b} = ?`,
        displayQuestion: `${a} + ${b}`,
        answer: a + b,
        opA: a,
        opB: b,
        operator: '+'
    };
};

/**
 * Pure generator for subtraction problems (guarantees non-negative result)
 * @returns {Object} { text, answer, opA, opB, operator: '-' }
 */
export const generateSubtractionProblem = () => {
    let a = getRandomInt();
    let b = getRandomInt();

    // Ensure non-negative result for elementary kids
    if (b > a) {
        [a, b] = [b, a];
    }

    return {
        text: `${a} - ${b} = ?`,
        displayQuestion: `${a} - ${b}`,
        answer: a - b,
        opA: a,
        opB: b,
        operator: '-'
    };
};

/**
 * Pure generator for multiplication problems (1–10)
 * @returns {Object} { text, answer, opA, opB, operator: '×' }
 */
export const generateMultiplicationProblem = () => {
    const a = getRandomInt();
    const b = getRandomInt();
    return {
        text: `${a} × ${b} = ?`,
        displayQuestion: `${a} × ${b}`,
        answer: a * b,
        opA: a,
        opB: b,
        operator: '×'
    };
};

/**
 * Pure generator for division problems (guarantees whole integer quotient)
 * @returns {Object} { text, answer, opA, opB, operator: '÷' }
 */
export const generateDivisionProblem = () => {
    const divisor = getRandomInt(); // 1 to 10
    const quotient = getRandomInt(); // 1 to 10
    const dividend = divisor * quotient;

    return {
        text: `${dividend} ÷ ${divisor} = ?`,
        displayQuestion: `${dividend} ÷ ${divisor}`,
        answer: quotient,
        opA: dividend,
        opB: divisor,
        operator: '÷'
    };
};

/**
 * Factory dispatcher for problem generation by mode
 * @param {string} mode
 * @returns {Object}
 */
export const generateProblem = (mode) => {
    switch (mode) {
        case 'add':
            return generateAdditionProblem();
        case 'sub':
            return generateSubtractionProblem();
        case 'mul':
            return generateMultiplicationProblem();
        case 'div':
            return generateDivisionProblem();
        default:
            throw new Error(`Unsupported math mode: ${mode}`);
    }
};

/**
 * Game Session State Controller
 */
export class GameSession {
    constructor(username, mode, totalQuestions) {
        if (!GAME_MODES[mode]) {
            throw new Error(`Invalid mode: ${mode}`);
        }
        this.username = username;
        this.mode = mode;
        this.totalQuestions = Number(totalQuestions) || 10;
        this.currentIndex = 0;
        this.score = 0;
        this.currentProblem = null;
        this.isLocked = false;
        this.history = [];
    }

    nextQuestion() {
        if (this.currentIndex >= this.totalQuestions) {
            return null;
        }
        this.currentProblem = generateProblem(this.mode);
        this.isLocked = false;
        return {
            problem: this.currentProblem,
            questionNumber: this.currentIndex + 1,
            totalQuestions: this.totalQuestions,
            currentScore: this.score
        };
    }

    /**
     * Evaluates user input against the current problem
     * Fixes empty input / NaN bug where empty strings converted to 0
     * @param {string|number} rawInput
     * @returns {Object}
     */
    evaluateAnswer(rawInput) {
        const trimmed = String(rawInput ?? '').trim();

        if (trimmed === '') {
            return {
                valid: false,
                message: '⚠️ Please enter an answer first!'
            };
        }

        const numericAnswer = Number(trimmed);
        if (Number.isNaN(numericAnswer)) {
            return {
                valid: false,
                message: '⚠️ Please enter a valid number!'
            };
        }

        if (this.isLocked) {
            return { valid: false, message: '' }; // Prevent double submission
        }

        this.isLocked = true;
        const isCorrect = numericAnswer === this.currentProblem.answer;

        if (isCorrect) {
            this.score += 1;
        }

        this.history.push({
            problem: this.currentProblem,
            userAnswer: numericAnswer,
            isCorrect
        });

        this.currentIndex += 1;

        return {
            valid: true,
            isCorrect,
            userAnswer: numericAnswer,
            correctAnswer: this.currentProblem.answer,
            score: this.score,
            isGameOver: this.currentIndex >= this.totalQuestions
        };
    }

    isGameOver() {
        return this.currentIndex >= this.totalQuestions;
    }

    getStats() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        return {
            username: this.username,
            mode: this.mode,
            score: this.score,
            totalQuestions: this.totalQuestions,
            percentage,
            isPerfect: this.score === this.totalQuestions
        };
    }
}
