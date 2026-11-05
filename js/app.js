// ============================================================================
// ITE 387: Advanced Programming - Kids Math Game
// Application Orchestrator & Event Listener Bootstrap
// ============================================================================

import { DEFAULT_QUESTIONS, FEEDBACK_DURATION_MS } from './config.js';
import { GameSession } from './game.js';
import {
    getOrCreateUser,
    findUser,
    saveUserScore,
    getLeaderboardData
} from './storage.js';
import { UI } from './ui.js';
import {
    getMuteState,
    toggleMuteState,
    playCorrectSound,
    playIncorrectSound,
    playFanfareSound,
    playTapSound,
    triggerConfetti
} from './utils.js';

// Application State
let currentUser = '';
let selectedMode = '';
let selectedQuestions = DEFAULT_QUESTIONS;
let activeSession = null;

/**
 * Validates and transitions to the game mode selection screen
 */
const handleLogin = () => {
    const input = document.getElementById('username-input');
    const username = input ? input.value.trim() : '';

    if (!username) {
        UI.showLoginValidation('⚠️ Oops! Please enter your name to play!');
        return;
    }

    if (username.length > 20) {
        UI.showLoginValidation('⚠️ Name must be 20 characters or fewer!');
        return;
    }

    UI.hideLoginValidation();
    currentUser = username;

    const existingUser = findUser(username);
    if (existingUser) {
        UI.setWelcomeMessage(`Welcome back, ${username}! 🎉`);
    } else {
        getOrCreateUser(username);
        UI.setWelcomeMessage(`Welcome to Math Fun, ${username}! 🚀`);
    }

    UI.updateUserDisplay(currentUser);
    UI.showScreen('mode-screen');
};

/**
 * Resets state and returns to login
 */
const handleLogout = () => {
    currentUser = '';
    selectedMode = '';
    selectedQuestions = DEFAULT_QUESTIONS;
    activeSession = null;

    const input = document.getElementById('username-input');
    if (input) input.value = '';
    UI.setWelcomeMessage('');
    UI.updateUserDisplay('');

    // Clear active button selections
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.btn-questions').forEach(b => b.classList.remove('selected'));

    UI.showScreen('login-screen');
};

/**
 * Handles selecting an arithmetic mode
 */
const handleModeSelect = (modeKey, buttonEl) => {
    document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('selected'));
    buttonEl.classList.add('selected');
    selectedMode = modeKey;
    UI.hideModeValidation();
    playTapSound();
};

/**
 * Handles selecting the question count
 */
const handleQuestionSelect = (count, buttonEl) => {
    document.querySelectorAll('.btn-questions').forEach(b => b.classList.remove('selected'));
    buttonEl.classList.add('selected');
    selectedQuestions = Number(count);
    UI.hideModeValidation();
    playTapSound();
};

/**
 * Validates mode & count selections, then launches the game
 */
const handleStartGame = () => {
    if (!selectedMode && !selectedQuestions) {
        UI.showModeValidation('⚠️ Please choose a math mode and question count!');
        return;
    }
    if (!selectedMode) {
        UI.showModeValidation('⚠️ Please choose a math mode (+, -, ×, ÷)!');
        return;
    }
    if (!selectedQuestions) {
        UI.showModeValidation('⚠️ Please choose how many questions to play!');
        return;
    }

    UI.hideModeValidation();
    playTapSound();

    // Start session
    activeSession = new GameSession(currentUser, selectedMode, selectedQuestions);
    UI.showScreen('game-screen');
    loadNextQuestion();
};

/**
 * Loads the next math question into the UI
 */
const loadNextQuestion = () => {
    if (!activeSession) return;

    if (activeSession.isGameOver()) {
        finishGame();
        return;
    }

    const questionData = activeSession.nextQuestion();
    if (!questionData) {
        finishGame();
        return;
    }

    UI.renderQuestion(questionData);
};

/**
 * Evaluates the submitted answer and triggers feedback
 */
const handleSubmitAnswer = () => {
    if (!activeSession || activeSession.isLocked) return;

    const answerInput = document.getElementById('answer-input');
    const rawVal = answerInput ? answerInput.value : '';

    const result = activeSession.evaluateAnswer(rawVal);

    if (!result.valid) {
        if (result.message) {
            const feedbackEl = document.getElementById('feedback-text');
            if (feedbackEl) {
                feedbackEl.className = 'feedback incorrect';
                feedbackEl.textContent = result.message;
            }
            if (answerInput) {
                answerInput.classList.add('shake');
                setTimeout(() => answerInput.classList.remove('shake'), 400);
            }
        }
        return;
    }

    // Play sound & render feedback
    UI.setGameControlsLocked(true);
    UI.showFeedback(result);

    const scoreDisplay = document.getElementById('current-score');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${result.score}`;
    }

    if (result.isCorrect) {
        playCorrectSound();
    } else {
        playIncorrectSound();
    }

    // Advance to next question after brief feedback pause
    setTimeout(() => {
        loadNextQuestion();
    }, FEEDBACK_DURATION_MS);
};

/**
 * Concludes the game, saves scores, triggers celebration
 */
const finishGame = () => {
    if (!activeSession) return;

    const stats = activeSession.getStats();
    saveUserScore(stats.username, stats.mode, stats.score, stats.totalQuestions);

    UI.renderGameOver(stats);

    if (stats.percentage >= 80) {
        playFanfareSound();
        triggerConfetti(2500);
    } else if (stats.percentage >= 50) {
        playCorrectSound();
    }
};

/**
 * Replays game with the same mode and settings
 */
const handlePlayAgain = () => {
    if (!currentUser || !selectedMode) {
        UI.showScreen('mode-screen');
        return;
    }
    playTapSound();
    activeSession = new GameSession(currentUser, selectedMode, selectedQuestions);
    loadNextQuestion();
};

/**
 * Returns from game screen to mode selection
 */
const handleBackToMode = () => {
    playTapSound();
    activeSession = null;
    UI.showScreen('mode-screen');
};

/**
 * Renders and displays the leaderboard
 */
const handleViewLeaderboard = () => {
    playTapSound();
    const data = getLeaderboardData();
    UI.renderLeaderboard(data);
    UI.showScreen('leaderboard-screen');
};

/**
 * Sets up child-friendly numpad actions
 */
const initNumpad = () => {
    const input = document.getElementById('answer-input');

    UI.buildNumpad(
        (digit) => {
            if (input && !input.disabled) {
                if (input.value.length < 5) {
                    input.value += digit;
                }
            }
        },
        () => {
            if (input && !input.disabled) {
                input.value = input.value.slice(0, -1);
            }
        },
        () => {
            handleSubmitAnswer();
        }
    );
};

// ============================================================================
// Safe DOM Initialization (ITE 387 Standard: wrap in DOMContentLoaded)
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Sound Toggle
    UI.updateSoundButton(getMuteState());
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const newState = toggleMuteState();
            UI.updateSoundButton(newState);
            if (!newState) {
                playTapSound();
            }
        });
    }

    // 2. Login Screen Events
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username-input');

    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (usernameInput) {
        usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    // 3. Mode Selection Events
    document.querySelectorAll('.btn-mode').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-mode');
            handleModeSelect(mode, btn);
        });
    });

    document.querySelectorAll('.btn-questions').forEach(btn => {
        btn.addEventListener('click', () => {
            const count = btn.getAttribute('data-questions');
            handleQuestionSelect(count, btn);
        });
    });

    // Default 10 questions selection active visually
    const defaultQuestionBtn = document.querySelector('.btn-questions[data-questions="10"]');
    if (defaultQuestionBtn) {
        defaultQuestionBtn.classList.add('selected');
        selectedQuestions = 10;
    }

    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) startGameBtn.addEventListener('click', handleStartGame);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
    if (viewLeaderboardBtn) viewLeaderboardBtn.addEventListener('click', handleViewLeaderboard);

    // 4. Game Screen Events
    const submitBtn = document.getElementById('submit-answer-btn');
    const answerInput = document.getElementById('answer-input');

    if (submitBtn) submitBtn.addEventListener('click', handleSubmitAnswer);
    if (answerInput) {
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSubmitAnswer();
        });
    }

    const quitGameBtn = document.getElementById('quit-game-btn');
    if (quitGameBtn) quitGameBtn.addEventListener('click', handleBackToMode);

    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) playAgainBtn.addEventListener('click', handlePlayAgain);

    const gameOverMenuBtn = document.getElementById('game-over-menu-btn');
    if (gameOverMenuBtn) gameOverMenuBtn.addEventListener('click', handleBackToMode);

    const gameOverLeaderboardBtn = document.getElementById('game-over-leaderboard-btn');
    if (gameOverLeaderboardBtn) gameOverLeaderboardBtn.addEventListener('click', handleViewLeaderboard);

    // 5. Leaderboard Screen Events
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    if (backToMenuBtn) backToMenuBtn.addEventListener('click', handleBackToMode);

    // 6. Build On-Screen Numpad
    initNumpad();

    // 7. Initial Screen Display
    UI.showScreen('login-screen');
});
