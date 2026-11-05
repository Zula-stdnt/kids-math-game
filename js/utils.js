// ============================================================================
// ITE 387: Advanced Programming - Kids Math Game
// Utilities: Abstracted DOM Helper, Web Audio Engine, & Canvas Confetti
// ============================================================================

import { STORAGE_KEYS } from './config.js';

/**
 * Abstracted DOM creation helper adhering to ITE 387 standards
 * 4-Step Pattern: Create -> Configure -> Listen -> Append
 * @param {string} tag
 * @param {Object} attributes
 * @param  {...(Node|string)} children
 * @returns {HTMLElement}
 */
export const create = (tag, attributes = {}, ...children) => {
    const el = document.createElement(tag);

    Object.entries(attributes).forEach(([key, val]) => {
        if (key === 'className' || key === 'class') {
            el.className = val;
        } else if (key === 'dataset' && typeof val === 'object') {
            Object.assign(el.dataset, val);
        } else if (key === 'style' && typeof val === 'object') {
            Object.assign(el.style, val);
        } else if (key === 'on' && typeof val === 'object') {
            Object.entries(val).forEach(([event, handler]) => {
                el.addEventListener(event, handler);
            });
        } else if (key in el) {
            el[key] = val;
        } else {
            el.setAttribute(key, val);
        }
    });

    children.flat().forEach(child => {
        if (child === null || child === undefined) return;
        if (typeof child === 'string' || typeof child === 'number') {
            el.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
            el.appendChild(child);
        }
    });

    return el;
};

// ============================================================================
// Web Audio API Synthesizer (Zero External Audio Dependencies)
// ============================================================================

let audioCtx = null;
let isMuted = localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';

const getAudioContext = () => {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

export const getMuteState = () => isMuted;

export const setMuteState = (muted) => {
    isMuted = Boolean(muted);
    localStorage.setItem(STORAGE_KEYS.MUTED, String(isMuted));
    return isMuted;
};

export const toggleMuteState = () => setMuteState(!isMuted);

const playTone = (frequency, type = 'sine', duration = 0.15, gainValue = 0.1) => {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(gainValue, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch {
        // Fallback gracefully if Web Audio is unsupported
    }
};

export const playTapSound = () => {
    playTone(520, 'sine', 0.05, 0.05);
};

export const playCorrectSound = () => {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Pleasant dual-chime: C5 (523Hz) -> G5 (784Hz)
        [
            { freq: 523.25, time: now, dur: 0.12 },
            { freq: 783.99, time: now + 0.1, dur: 0.25 }
        ].forEach(({ freq, time, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + dur);
        });
    } catch {
        // Audio error fallback
    }
};

export const playIncorrectSound = () => {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Gentle boing: 220Hz down to 160Hz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    } catch {
        // Audio error fallback
    }
};

export const playFanfareSound = () => {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Cheerful victory arpeggio: C5, E5, G5, C6
        const notes = [
            { freq: 523.25, offset: 0.00, dur: 0.15 },
            { freq: 659.25, offset: 0.12, dur: 0.15 },
            { freq: 783.99, offset: 0.24, dur: 0.18 },
            { freq: 1046.50, offset: 0.38, dur: 0.45 }
        ];

        notes.forEach(({ freq, offset, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + offset);
            gain.gain.setValueAtTime(0.12, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + dur);
        });
    } catch {
        // Audio error fallback
    }
};

// ============================================================================
// Lightweight Canvas Particle Confetti
// ============================================================================

export const triggerConfetti = (durationMs = 2000) => {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = create('canvas', {
            id: 'confetti-canvas',
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: '9999'
            }
        });
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#6C5CE7', '#FF8C42', '#00B894'];
    const particleCount = 75;
    const particles = Array.from({ length: particleCount }, () => ({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
    }));

    const startTime = performance.now();

    const animate = (time) => {
        const elapsed = time - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.opacity = Math.max(0, 1 - elapsed / durationMs);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        });

        if (elapsed < durationMs) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    requestAnimationFrame(animate);
};
