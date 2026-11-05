// ============================================================================
// ITE 387: Advanced Programming - Kids Math Game
// Configuration & Constants Module
// ============================================================================

export const STORAGE_KEYS = {
    USERS: 'mathGameUsers',
    MUTED: 'mathGameMuted'
};

export const GAME_MODES = {
    add: {
        id: 'add',
        name: 'Addition',
        symbol: '+',
        badge: '➕ Addition',
        color: '#4A90E2',
        gradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)'
    },
    sub: {
        id: 'sub',
        name: 'Subtraction',
        symbol: '-',
        badge: '➖ Subtraction',
        color: '#50C878',
        gradient: 'linear-gradient(135deg, #50C878 0%, #3BA05F 100%)'
    },
    mul: {
        id: 'mul',
        name: 'Multiplication',
        symbol: '×',
        badge: '✖️ Multiplication',
        color: '#FF8C42',
        gradient: 'linear-gradient(135deg, #FF8C42 0%, #E67632 100%)'
    },
    div: {
        id: 'div',
        name: 'Division',
        symbol: '÷',
        badge: '➗ Division',
        color: '#9B59B6',
        gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)'
    }
};

export const QUESTION_OPTIONS = [5, 10, 15];
export const DEFAULT_QUESTIONS = 10;
export const NUMBER_RANGE = { min: 1, max: 10 };
export const FEEDBACK_DURATION_MS = 1200;
