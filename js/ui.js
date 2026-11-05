// ============================================================================
// ITE 387: Advanced Programming - Kids Math Game
// UI Controller: Screen Switching, Hybrid DOM Rendering, Numpad, & Leaderboard
// ============================================================================

import { GAME_MODES } from './config.js';
import { create, playTapSound } from './utils.js';

export const UI = {
    // Screen Navigation
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    // User display bindings
    updateUserDisplay(username) {
        const displays = document.querySelectorAll('.username-display');
        displays.forEach(el => {
            el.textContent = username;
        });
        const topPill = document.getElementById('user-pill');
        if (topPill) {
            topPill.textContent = username ? `👤 ${username}` : '';
            topPill.classList.toggle('hidden', !username);
        }
    },

    setWelcomeMessage(message) {
        const el = document.getElementById('welcome-message');
        if (el) el.textContent = message;
    },

    showLoginValidation(message) {
        const el = document.getElementById('login-validation');
        if (!el) return;
        el.textContent = message;
        el.classList.add('show');
    },

    hideLoginValidation() {
        const el = document.getElementById('login-validation');
        if (!el) return;
        el.classList.remove('show');
        el.textContent = '';
    },

    showModeValidation(message) {
        const el = document.getElementById('mode-validation');
        if (!el) return;
        el.textContent = message;
        el.classList.add('show');
    },

    hideModeValidation() {
        const el = document.getElementById('mode-validation');
        if (!el) return;
        el.classList.remove('show');
        el.textContent = '';
    },

    // Sound toggle UI
    updateSoundButton(isMuted) {
        const btn = document.getElementById('sound-toggle-btn');
        if (!btn) return;
        btn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound On';
        btn.setAttribute('aria-label', isMuted ? 'Unmute sounds' : 'Mute sounds');
        btn.classList.toggle('muted', isMuted);
    },

    // Game Screen Rendering
    renderQuestion({ problem, questionNumber, totalQuestions, currentScore }) {
        const counterEl = document.getElementById('question-counter');
        const scoreEl = document.getElementById('current-score');
        const problemEl = document.getElementById('problem-text');
        const progressBar = document.getElementById('game-progress-bar');
        const answerInput = document.getElementById('answer-input');
        const feedbackEl = document.getElementById('feedback-text');
        const gameActiveArea = document.getElementById('game-active-area');
        const gameOverArea = document.getElementById('game-over-area');

        // Reset areas
        if (gameActiveArea) gameActiveArea.classList.remove('hidden');
        if (gameOverArea) gameOverArea.classList.add('hidden');

        if (counterEl) counterEl.textContent = `Question ${questionNumber} of ${totalQuestions}`;
        if (scoreEl) scoreEl.textContent = `Score: ${currentScore}`;
        if (problemEl) problemEl.textContent = problem.text;

        // Visual progress bar
        if (progressBar) {
            const pct = Math.round(((questionNumber - 1) / totalQuestions) * 100);
            progressBar.style.width = `${pct}%`;
        }

        // Clean input & feedback
        if (answerInput) {
            answerInput.value = '';
            answerInput.disabled = false;
            answerInput.focus();
        }

        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }

        this.setGameControlsLocked(false);
    },

    setGameControlsLocked(isLocked) {
        const submitBtn = document.getElementById('submit-answer-btn');
        const answerInput = document.getElementById('answer-input');
        const numpadBtns = document.querySelectorAll('.numpad-btn');

        if (submitBtn) submitBtn.disabled = isLocked;
        if (answerInput) answerInput.disabled = isLocked;
        numpadBtns.forEach(btn => {
            btn.disabled = isLocked;
        });
    },

    showFeedback({ isCorrect, correctAnswer }) {
        const feedbackEl = document.getElementById('feedback-text');
        if (!feedbackEl) return;

        feedbackEl.className = 'feedback';
        if (isCorrect) {
            feedbackEl.classList.add('correct');
            feedbackEl.textContent = '🌟 Correct! Awesome job! 🎉';
        } else {
            feedbackEl.classList.add('incorrect');
            feedbackEl.textContent = `Try again — the answer was ${correctAnswer}`;
        }
    },

    renderGameOver(stats) {
        const gameActiveArea = document.getElementById('game-active-area');
        const gameOverArea = document.getElementById('game-over-area');
        const progressBar = document.getElementById('game-progress-bar');

        if (gameActiveArea) gameActiveArea.classList.add('hidden');
        if (gameOverArea) gameOverArea.classList.remove('hidden');

        if (progressBar) progressBar.style.width = '100%';

        const scoreSummary = document.getElementById('game-over-score');
        const messageEl = document.getElementById('game-over-message');

        if (scoreSummary) {
            scoreSummary.textContent = `${stats.score} / ${stats.totalQuestions} (${stats.percentage}%)`;
        }

        if (messageEl) {
            if (stats.percentage === 100) {
                messageEl.textContent = '🏆 PERFECT SCORE! You are a Math Champion! 🌟';
            } else if (stats.percentage >= 80) {
                messageEl.textContent = '🎉 Excellent work! Keep it up! 🚀';
            } else if (stats.percentage >= 50) {
                messageEl.textContent = '👍 Good effort! Practice makes perfect! 💪';
            } else {
                messageEl.textContent = 'Keep practicing! You can do it! ✨';
            }
        }
    },

    // Hybrid Leaderboard Rendering (Table on desktop, Cards on mobile)
    renderLeaderboard(entries) {
        const tbody = document.getElementById('leaderboard-list');
        const cardsContainer = document.getElementById('leaderboard-cards');

        if (tbody) tbody.innerHTML = '';
        if (cardsContainer) cardsContainer.innerHTML = '';

        if (!entries || entries.length === 0) {
            const emptyHtml = `
                <tr>
                    <td colspan="5" class="empty-message">
                        No scores yet. Play a game to earn your spot on the leaderboard! 🎮
                    </td>
                </tr>
            `;
            if (tbody) tbody.innerHTML = emptyHtml;
            if (cardsContainer) {
                cardsContainer.innerHTML = `
                    <div class="empty-card">
                        No scores yet. Play a game to earn your spot on the leaderboard! 🎮
                    </div>
                `;
            }
            return;
        }

        // Render Desktop Table Rows using template literals
        const tableRowsHtml = entries.map((entry, index) => {
            const modeInfo = GAME_MODES[entry.mode] || { badge: entry.mode };
            const rankBadge = index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `#${index + 1}`;
            return `
                <tr class="leaderboard-row ${index < 3 ? 'top-rank' : ''}">
                    <td class="col-rank">${rankBadge}</td>
                    <td class="col-player"><strong>${entry.username}</strong></td>
                    <td class="col-score">${entry.score} / ${entry.total} <span class="score-pct">(${entry.percentage}%)</span></td>
                    <td class="col-mode"><span class="mode-tag mode-${entry.mode}">${modeInfo.badge}</span></td>
                    <td class="col-date">${entry.date}</td>
                </tr>
            `;
        }).join('');

        if (tbody) tbody.innerHTML = tableRowsHtml;

        // Render Mobile Cards using ITE 387 create() helper
        if (cardsContainer) {
            entries.forEach((entry, index) => {
                const modeInfo = GAME_MODES[entry.mode] || { badge: entry.mode };
                const rankText = index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `#${index + 1}`;

                const card = create('div', { className: `leaderboard-card ${index < 3 ? 'top-card' : ''}` });
                card.innerHTML = `
                    <div class="card-header-row">
                        <span class="card-rank">${rankText}</span>
                        <span class="card-player">${entry.username}</span>
                        <span class="card-mode mode-${entry.mode}">${modeInfo.badge}</span>
                    </div>
                    <div class="card-body-row">
                        <span class="card-score">Score: <strong>${entry.score} / ${entry.total}</strong></span>
                        <span class="card-pct">${entry.percentage}%</span>
                        <span class="card-date">${entry.date}</span>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        }
    },

    // Build Child-Friendly Interactive On-Screen Numpad
    buildNumpad(onDigit, onBackspace, onSubmit) {
        const container = document.getElementById('touch-numpad');
        if (!container) return;
        container.innerHTML = '';

        const keys = [
            '1', '2', '3',
            '4', '5', '6',
            '7', '8', '9',
            '⌫', '0', '✔'
        ];

        const grid = create('div', { className: 'numpad-grid' });

        keys.forEach(key => {
            const isBackspace = key === '⌫';
            const isSubmit = key === '✔';
            let btnClass = 'btn numpad-btn';
            if (isBackspace) btnClass += ' numpad-backspace';
            if (isSubmit) btnClass += ' numpad-submit';

            const btn = create('button', {
                type: 'button',
                className: btnClass,
                'aria-label': isBackspace ? 'Backspace' : isSubmit ? 'Submit Answer' : `Digit ${key}`
            }, key);

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                playTapSound();
                if (isBackspace) {
                    onBackspace();
                } else if (isSubmit) {
                    onSubmit();
                } else {
                    onDigit(key);
                }
            });

            grid.appendChild(btn);
        });

        container.appendChild(grid);
    }
};
