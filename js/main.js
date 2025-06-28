/**
 * main.js
 * * This is the main entry point for the TapDance application.
 * It handles:
 * - State management
 * - Core application logic (starting tests, handling input)
 * - Event listener setup
 * - Initialization
 */

import { wordList, punctuationList, modeOptions } from './constants.js';
import * as ui from './ui.js';

// --- Application State ---
let keyMap = {};
let originalText = '';
let typedText = '';
let isTestActive = false;
let isTestComplete = false;
let startTime = null;
let lastTypedTime = null;
let statTimer = null;
let inactivityTimer = null;
let totalCharsTyped = 0;
let totalErrors = 0;
let justSkipped = false;
let lastSkipInfo = null;
let synth; // For Tone.js

// Test configuration state
let testConfig = {
    mode: 'words',
    value: 25,
    includePunctuation: false,
    includeNumbers: false,
};

// User settings state
let settings = {
    theme: 'dark',
    accent: '#BEB05B',
    font: "'Roboto Mono', monospace",
    caretStyle: 'line',
    smoothCaret: true,
    skipWordOnSpace: true,
    sound: false,
    keyboard: 'hidden',
    keyboardSize: 2.25,
    textDisplayMode: 'static',
    specialEffect: 'none',
};

// --- Sound Engine ---
const setupSound = () => {
    if (window.Tone && !synth) {
        synth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.1, },
        }).toDestination();
    }
};
const playKeySound = () => settings.sound && synth && synth.triggerAttackRelease('C5', '8n');
const playErrorSound = () => settings.sound && synth && synth.triggerAttackRelease('C4', '8n', Tone.now(), 0.6);

// --- Core Test Logic ---
/**
 * Generates the text for the typing test based on the current configuration.
 * @returns {string} The generated text.
 */
const generateText = () => {
    let newText = '';
    const { mode, value } = testConfig;

    const generateWords = (count) => {
        let words = Array.from({ length: count }, () => wordList[Math.floor(Math.random() * wordList.length)]);
        if (testConfig.includePunctuation) {
            words = words.map((word, i) => (Math.random() < 0.2 && i < words.length - 1) ? word + punctuationList[Math.floor(Math.random() * punctuationList.length)] : word);
        }
        if (testConfig.includeNumbers) {
            for (let i = 0; i < count * 0.15; i++) {
                words.splice(Math.floor(Math.random() * words.length), 0, Math.floor(Math.random() * 1000).toString());
            }
        }
        return words.join(' ');
    };

    if (mode === 'time') newText = generateWords(150);
    else if (mode === 'words') newText = generateWords(value);
    else if (mode === 'zen') newText = generateWords(300);
    else if (mode === 'quote') {
        const quotes = { short: "To be or not to be.", medium: "The quick brown fox jumps over the lazy dog.", long: "Success is not final, failure is not fatal: it is the courage to continue that counts." };
        newText = quotes[value] || quotes.medium;
    }
    return newText;
};

/**
 * Starts a new test by generating text and resetting the state.
 */
const startTest = () => {
    resetTest();
    originalText = generateText();
    ui.renderText(originalText, typedText, settings);
};

/**
 * Resets the application to its initial state before a test starts.
 */
const resetTest = () => {
    if (statTimer) clearInterval(statTimer);
    clearTimeout(inactivityTimer);

    isTestActive = false;
    isTestComplete = false;
    originalText = '';
    typedText = '';
    startTime = null;
    lastTypedTime = null;
    statTimer = null;
    inactivityTimer = null;
    totalCharsTyped = 0;
    totalErrors = 0;
    justSkipped = false;
    lastSkipInfo = null;

    ui.logo.classList.remove('hidden');
    ui.textDisplayContainer.style.opacity = '1';
    ui.statsContainer.classList.add('hidden');
    ui.inTestStats.classList.add('hidden');
    ui.modeControls.classList.remove('hidden');
    ui.restartBtn.classList.remove('visible');
    
    if (ui.caret) {
        ui.caret.style.animation = 'blink 1s infinite';
        ui.caret.style.opacity = '1';
    }

    ui.liveWPMDisplay.textContent = '';
    ui.liveAccDisplay.textContent = '';
    ui.textContentWrapper.style.transform = 'translate(0, 0)';
    
    ui.renderText(originalText, typedText, settings);
};

/**
 * Finalizes the test, calculates final stats, and updates the UI.
 */
const completeTest = () => {
    if (statTimer) clearInterval(statTimer);
    clearTimeout(inactivityTimer);
    updateStats(true);
    isTestActive = false;
    isTestComplete = true;

    ui.logo.classList.remove('hidden');
    ui.modeControls.classList.remove('hidden');
    ui.restartBtn.classList.add('visible');
    ui.statsContainer.classList.remove('hidden');
    ui.inTestStats.classList.add('hidden');
    ui.textDisplayContainer.style.opacity = '0.5';
    
    if (ui.caret) {
        ui.caret.style.animation = 'none';
        ui.caret.style.opacity = '0';
    }

    setTimeout(() => ui.restartBtn.focus(), 100);
};

/**
 * Pauses the test due to inactivity.
 */
const pauseTest = () => {
    if (!isTestActive) return;
    isTestActive = false;
    clearInterval(statTimer);
    clearTimeout(inactivityTimer);
    inactivityTimer = null;

    ui.modeControls.classList.remove('hidden');
    ui.logo.classList.remove('hidden');
    ui.restartBtn.classList.add('visible');
    ui.textDisplayContainer.style.opacity = '0.5';
    requestAnimationFrame(() => ui.restartBtn.focus());
};

/**
 * Resets the inactivity timer. Called on every keypress during a test.
 */
const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    if (isTestActive) {
        inactivityTimer = setTimeout(pauseTest, 3000); // 3-second timeout
    }
};

/**
 * Calculates and displays typing stats (WPM, accuracy).
 * @param {boolean} isFinal - Whether these are the final stats for the test.
 */
const updateStats = (isFinal = false) => {
    if (!startTime) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const minutes = elapsed / 60;
    
    const correctChars = typedText.split('').filter((c, i) => c === originalText[i]).length;
    const wpm = minutes > 0.005 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = totalCharsTyped > 0 ? Math.round(((totalCharsTyped - totalErrors) / totalCharsTyped) * 100) : 100;

    if (isFinal || isTestComplete) {
        ui.wpmDisplay.textContent = wpm;
        ui.accuracyDisplay.textContent = `${accuracy}%`;
        ui.timeDisplay.textContent = `${Math.round(elapsed)}s`;
    } else if (isTestActive) {
        ui.liveWPMDisplay.textContent = `${wpm} WPM`;
        ui.liveAccDisplay.textContent = `${accuracy}% ACC`;

        if (testConfig.mode === 'time') {
            const remaining = testConfig.value - elapsed;
            ui.liveWPMDisplay.textContent = `${Math.ceil(remaining)}s | ${wpm} WPM`;
            if (remaining <= 0) completeTest();
        }
    }
};


// --- Event Handlers ---
/**
 * Handles all keydown events for the typing test.
 * @param {KeyboardEvent} e - The keydown event object.
 */
const handleKeyPress = (e) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault();
        if (isTestActive) pauseTest();
        else if (ui.restartBtn.classList.contains('visible')) ui.restartBtn.focus();
        return;
    }

    const ignoredKeys = ['Shift', 'CapsLock', 'Control', 'Alt', 'Meta', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (ignoredKeys.includes(e.key) || isTestComplete || e.ctrlKey || e.metaKey) return;
    
    if (originalText === '') return;

    if (!isTestActive) {
        if (e.key.length !== 1 && e.key !== 'Backspace') return;
        
        isTestActive = true;
        if (!startTime) {
            startTime = Date.now();
        } else {
            const pauseDuration = Date.now() - lastTypedTime;
            startTime += pauseDuration;
        }

        statTimer = setInterval(updateStats, 250);
        ui.logo.classList.add('hidden');
        ui.inTestStats.classList.remove('hidden');
        ui.modeControls.classList.add('hidden');
        ui.textDisplayContainer.style.opacity = '1';
        if(ui.caret) ui.caret.style.opacity = '1';
    }
    
    lastTypedTime = Date.now();
    resetInactivityTimer();
    ui.pressKey(keyMap[e.code]);
    e.preventDefault();

    if (e.key === 'Backspace') {
        if (justSkipped) {
            const amount = lastSkipInfo.to - lastSkipInfo.from;
            totalCharsTyped -= amount;
            totalErrors -= amount;
            typedText = typedText.substring(0, lastSkipInfo.from);
            justSkipped = false;
            lastSkipInfo = null;
        } else if (typedText.length > 0) {
            typedText = typedText.slice(0, -1);
            justSkipped = false;
        }
        playKeySound();
    } else if (e.key.length === 1 && typedText.length < originalText.length) {
        const isSkipAttempt = settings.skipWordOnSpace && e.key === ' ' && originalText[typedText.length] !== ' ';

        if (isSkipAttempt) {
            playErrorSound();
            const skipFrom = typedText.length;
            const nextSpaceIndex = originalText.indexOf(' ', skipFrom);
            const targetIndex = (nextSpaceIndex === -1) ? originalText.length : nextSpaceIndex + 1;
            const numToAdvance = targetIndex - skipFrom;
            typedText += '\0'.repeat(numToAdvance);
            totalCharsTyped += numToAdvance;
            totalErrors += numToAdvance;
            lastSkipInfo = { from: skipFrom, to: targetIndex };
            justSkipped = true;
        } else {
            justSkipped = false;
            totalCharsTyped++;
            if (e.key !== originalText[typedText.length]) {
                totalErrors++;
                playErrorSound();
            } else {
                playKeySound();
            }
            typedText += e.key;
        }
    } else {
        justSkipped = false;
    }

    ui.renderText(originalText, typedText, settings);
    updateStats();

    if (testConfig.mode !== 'time' && testConfig.mode !== 'zen' && typedText.length >= originalText.length) {
        completeTest();
    }
};

// --- Settings & Initialization ---
/**
 * Saves the current settings to localStorage.
 */
const saveSettings = () => {
    localStorage.setItem('tapdance-settings', JSON.stringify(settings));
};

/**
 * Loads settings from localStorage and updates the UI controls.
 */
const loadSettings = () => {
    const saved = localStorage.getItem('tapdance-settings');
    if (saved) {
        let loadedSettings = JSON.parse(saved);
        if (loadedSettings.textDisplayMode && loadedSettings.textDisplayMode.startsWith('scroll')) {
            loadedSettings.textDisplayMode = 'scroll';
        }
        settings = { ...settings, ...loadedSettings };
    }
    ui.themeSelect.value = settings.theme;
    ui.accentColorPicker.value = settings.accent;
    ui.specialEffectSelect.value = settings.specialEffect;
    ui.fontTypeSelect.value = settings.font;
    ui.caretStyleSelect.value = settings.caretStyle;
    ui.textDisplayModeSelect.value = settings.textDisplayMode;
    ui.smoothCaretToggle.checked = settings.smoothCaret;
    ui.skipWordToggle.checked = settings.skipWordOnSpace;
    ui.soundToggle.checked = settings.sound;
    ui.keyboardTypeSelect.value = settings.keyboard;
    ui.keyboardSizeSlider.value = settings.keyboardSize;
    
    ui.applySettings(settings);
    keyMap = ui.renderKeyboard(settings.keyboard);
};

/**
 * Sets up the mode selector buttons and their event listeners.
 */
const initializeModeSelector = () => {
    const createBtn = (group, config, clickHandler) => {
        const btn = document.createElement('button');
        btn.className = 'mode-btn';
        if (config.isToggle) btn.classList.add('toggle-btn');
        Object.keys(config.data).forEach(key => btn.dataset[key] = config.data[key]);
        btn.innerHTML = `${config.icon || ''} ${config.name}`;
        btn.addEventListener('click', () => clickHandler(btn));
        group.appendChild(btn);
        return btn;
    };

    ['punctuation', 'numbers'].forEach(name => {
        createBtn(ui.extraOptionsGroup, { name, isToggle: true, data: { option: name } }, (btn) => {
            btn.classList.toggle('active');
            testConfig.includePunctuation = ui.extraOptionsGroup.querySelector('[data-option="punctuation"]').classList.contains('active');
            testConfig.includeNumbers = ui.extraOptionsGroup.querySelector('[data-option="numbers"]').classList.contains('active');
            startTest();
        });
    });

    const primaryModes = [
        { name: 'zen', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.89,15.73C16.58,15.93 16.27,16.14 15.97,16.34...Z" /></svg>' },
        { name: 'time', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12...Z" /></svg>' },
        { name: 'words', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4.5,18H6V19.5H4.5V18M18...Z" /></svg>' },
        { name: 'quote', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" /></svg>' }
    ];
    primaryModes.forEach(mode => {
        const btn = createBtn(ui.primaryModeGroup, { ...mode, data: { mode: mode.name } }, () => {
            setMode(mode.name, modeOptions[mode.name][0]);
        });
        if (mode.name === testConfig.mode) btn.classList.add('active');
    });

    updateSecondaryOptions(testConfig.mode, testConfig.value);
};

const setMode = (mode, value) => {
    document.querySelectorAll('#primaryModeGroup .mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.mode-btn[data-mode="${mode}"]`)?.classList.add('active');
    testConfig.mode = mode;
    testConfig.value = value;
    updateSecondaryOptions(mode, value);
    startTest();
};

const updateSecondaryOptions = (mode, defaultValue) => {
    ui.secondaryModeGroup.innerHTML = '';
    const options = modeOptions[mode];
    if (!options || options.length === 0) {
        ui.modeDivider.style.display = 'none';
        return;
    }
    ui.modeDivider.style.display = 'block';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'mode-btn';
        btn.dataset.value = option;
        btn.textContent = option;
        btn.addEventListener('click', () => {
            testConfig.value = isNaN(parseInt(option)) ? option : parseInt(option);
            document.querySelectorAll('#secondaryModeGroup .mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            startTest();
        });
        ui.secondaryModeGroup.appendChild(btn);
    });

    const defaultBtn = ui.secondaryModeGroup.querySelector(`[data-value="${defaultValue}"]`) || ui.secondaryModeGroup.firstChild;
    if (defaultBtn) {
        defaultBtn.classList.add('active');
        const val = defaultBtn.dataset.value;
        testConfig.value = isNaN(parseInt(val)) ? val : parseInt(val);
    }
};

/**
 * Sets up all the application's event listeners.
 */
const setupEventListeners = () => {
    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('resize', () => ui.updateTextAndCaret(originalText, typedText, settings));
    
    ui.restartBtn.addEventListener('click', startTest);
    ui.textDisplayContainer.addEventListener('click', () => document.body.focus());

    // Settings Panel Listeners
    ui.settingsBtn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = ui.settingsPanel.style.display === 'flex';
        ui.settingsPanel.style.display = isOpen ? 'none' : 'flex';
        ui.settingsBtn.classList.toggle('open', !isOpen);
    });

    document.addEventListener('click', e => {
        if (!ui.settingsPanel.contains(e.target) && !ui.settingsBtn.contains(e.target)) {
            ui.settingsPanel.style.display = 'none';
            ui.settingsBtn.classList.remove('open');
        }
    });

    // Individual Setting Listeners
    ui.themeSelect.addEventListener('change', e => { settings.theme = e.target.value; ui.applySettings(settings); saveSettings(); });
    ui.accentColorPicker.addEventListener('input', e => { settings.accent = e.target.value; document.documentElement.style.setProperty('--accent-color', settings.accent); });
    ui.accentColorPicker.addEventListener('change', saveSettings);
    ui.specialEffectSelect.addEventListener('change', e => { settings.specialEffect = e.target.value; ui.applySettings(settings); saveSettings(); startTest(); });
    ui.fontTypeSelect.addEventListener('change', e => { settings.font = e.target.value; ui.applySettings(settings); saveSettings(); });
    ui.caretStyleSelect.addEventListener('change', e => { settings.caretStyle = e.target.value; ui.applySettings(settings); saveSettings(); });
    ui.textDisplayModeSelect.addEventListener('change', e => { settings.textDisplayMode = e.target.value; ui.applySettings(settings); saveSettings(); });
    ui.smoothCaretToggle.addEventListener('change', e => { settings.smoothCaret = e.target.checked; saveSettings(); });
    ui.skipWordToggle.addEventListener('change', e => { settings.skipWordOnSpace = e.target.checked; saveSettings(); });
    ui.soundToggle.addEventListener('change', e => { settings.sound = e.target.checked; saveSettings(); if(settings.sound) setupSound(); });
    ui.keyboardTypeSelect.addEventListener('change', e => { settings.keyboard = e.target.value; ui.applySettings(settings); keyMap = ui.renderKeyboard(settings.keyboard); saveSettings(); });
    ui.keyboardSizeSlider.addEventListener('input', e => { settings.keyboardSize = e.target.value; ui.applySettings(settings); });
    ui.keyboardSizeSlider.addEventListener('change', saveSettings);
    ui.resetKeyboardSizeBtn.addEventListener('click', () => {
        settings.keyboardSize = 2.25;
        ui.keyboardSizeSlider.value = settings.keyboardSize;
        ui.applySettings(settings);
        saveSettings();
    });
};

/**
 * Initializes the application.
 */
const init = () => {
    loadSettings();
    initializeModeSelector();
    setupEventListeners();
    startTest();
};

// --- App Start ---
document.addEventListener('DOMContentLoaded', init);
