// ============================================================================
// ITE 387: Advanced Programming - Kids Math Game
// Storage Management: Factory Functions, Single Source of Truth, Functional Pipelines
// ============================================================================

import { STORAGE_KEYS } from './config.js';

/**
 * Factory function to create a new user profile object
 * @param {string} username
 * @returns {Object}
 */
export const createUserProfile = (username) => ({
    username: username.trim(),
    createdAt: new Date().toISOString(),
    scores: []
});

/**
 * Factory function to create a standardized score record
 * @param {string} mode
 * @param {number} score
 * @param {number} total
 * @returns {Object}
 */
export const createScoreRecord = (mode, score, total) => ({
    mode,
    score: Number(score),
    total: Number(total),
    date: new Date().toLocaleDateString()
});

/**
 * Retrieves all users from localStorage (Single Source of Truth)
 * @returns {Array<Object>}
 */
export const getAllUsers = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.USERS);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Failed to parse users data from localStorage:', err);
        return [];
    }
};

/**
 * Saves all users to localStorage
 * @param {Array<Object>} users
 */
export const saveAllUsers = (users) => {
    try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (err) {
        console.error('Failed to save users data to localStorage:', err);
    }
};

/**
 * Finds a user by username using Array.prototype.find
 * @param {string} username
 * @returns {Object|null}
 */
export const findUser = (username) => {
    const cleanName = username.trim().toLowerCase();
    const users = getAllUsers();
    return users.find(u => u.username.toLowerCase() === cleanName) || null;
};

/**
 * Registers or retrieves a user by username
 * @param {string} username
 * @returns {Object}
 */
export const getOrCreateUser = (username) => {
    const cleanName = username.trim();
    const users = getAllUsers();
    const existing = users.find(u => u.username.toLowerCase() === cleanName.toLowerCase());

    if (existing) {
        return existing;
    }

    const newUser = createUserProfile(cleanName);
    users.push(newUser);
    saveAllUsers(users);
    return newUser;
};

/**
 * Appends a score record to a user's history
 * @param {string} username
 * @param {string} mode
 * @param {number} score
 * @param {number} total
 */
export const saveUserScore = (username, mode, score, total) => {
    const cleanName = username.trim();
    const users = getAllUsers();
    const targetUser = users.find(u => u.username.toLowerCase() === cleanName.toLowerCase());

    if (!targetUser) return;

    if (!Array.isArray(targetUser.scores)) {
        targetUser.scores = [];
    }

    targetUser.scores.push(createScoreRecord(mode, score, total));
    saveAllUsers(users);
};

/**
 * Compiles and ranks the leaderboard using functional array pipelines (.reduce, .map, .filter, .sort)
 * @returns {Array<Object>} Ranked leaderboard entries
 */
export const getLeaderboardData = () => {
    const users = getAllUsers();
    const modes = ['add', 'sub', 'mul', 'div'];

    // Extract best performance per mode per user
    const allBestEntries = users.flatMap(user => {
        if (!Array.isArray(user.scores) || user.scores.length === 0) return [];

        return modes.map(mode => {
            const modeScores = user.scores.filter(s => s.mode === mode && s.total > 0);
            if (modeScores.length === 0) return null;

            // Find best score for this mode using reduce
            const best = modeScores.reduce((top, current) => {
                const currentPct = (current.score / current.total) * 100;
                const topPct = (top.score / top.total) * 100;

                if (currentPct > topPct) return current;
                if (currentPct === topPct && current.score > top.score) return current;
                return top;
            });

            return {
                username: user.username,
                mode,
                score: best.score,
                total: best.total,
                date: best.date,
                percentage: Math.round((best.score / best.total) * 100)
            };
        }).filter(Boolean);
    });

    // Sort entries descending by percentage, then by raw score
    return allBestEntries.sort((a, b) => {
        if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
        }
        return b.score - a.score;
    });
};
