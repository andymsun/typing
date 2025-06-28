/**
 * ui.js
 * * This file handles all direct interactions with the DOM. 
 * It's responsible for rendering content, updating styles, and showing/hiding elements.
 * It does not contain any core application logic or state management.
 */

import { layouts } from './constants.js';

// --- DOM Element Selectors ---
const D = (id) => document.getElementById(id);

// Main Layout
export const logo = document.querySelector('.logo');
export const textContentWrapper = D('textContentWrapper');
export const textDisplayContainer = D('textDisplayContainer');
export const caret = D('caret');

// Stats
export const statsContainer = D('stats');
export const wpmDisplay = D('wpm');
export const accuracyDisplay = D('accuracy');
export const timeDisplay = D('time');
export const inTestStats = D('inTestStats');
export const liveWPMDisplay = D('liveWPM');
export const liveAccDisplay = D('liveAcc');

// Controls
export const modeControls = D('testModeControls');
export const extraOptionsGroup = D('extraOptionsGroup');
export const primaryModeGroup = D('primaryModeGroup');
export const secondaryModeGroup = D('secondaryModeGroup');
export const modeDivider = D('modeDivider');
export const restartBtn = D('restartBtn');

// Settings Panel
export const settingsBtn = D('settingsBtn');
export const settingsPanel = D('settingsPanel');
export const themeSelect = D('themeSelect');
export const accentColorPicker = D('accentColor');
export const specialEffectSelect = D('specialEffectSelect');
export const fontTypeSelect = D('fontType');
export const caretStyleSelect = D('caretStyleSelect');
export const textDisplayModeSelect = D('textDisplayModeSelect');
export const smoothCaretToggle = D('smoothCaretToggle');
export const skipWordToggle = D('skipWordToggle');
export const soundToggle = D('soundToggle');
export const keyboardTypeSelect = D('keyboardType');
export const keyboardSizeSlider = D('keyboardSizeSlider');
export const resetKeyboardSizeBtn = D('resetKeyboardSizeBtn');

// Keyboard
export const keyboardContainer = D('keyboard');


// --- UI Rendering Functions ---

/**
 * Renders the test text to the screen, applying styles and effects.
 * @param {string} originalText - The full string of the test.
 * @param {string} typedText - The portion of the text the user has typed.
 * @param {object} settings - The current user settings object.
 */
export function renderText(originalText, typedText, settings) {
    const currentIndex = typedText.length;
    const effect = settings.specialEffect;
    const words = originalText.split(' ');
    let charCounter = 0;
    let currentWordIndex = -1;

    // Determine the index of the word the user is currently typing
    for (let i = 0; i < words.length; i++) {
        const wordWithSpaceLength = words[i].length + 1;
        if (currentIndex < charCounter + wordWithSpaceLength) {
            currentWordIndex = i;
            break;
        }
        charCounter += wordWithSpaceLength;
    }
    if (currentWordIndex === -1 && currentIndex >= originalText.length) {
        currentWordIndex = words.length - 1;
    }

    // Generate the HTML for the text
    textContentWrapper.innerHTML = '';
    const fragment = document.createDocumentFragment();
    words.forEach((word, wordIndex) => {
        const wordWrapper = document.createElement('span');
        wordWrapper.className = 'word-wrapper';

        word.split('').forEach(char => {
            const charEl = document.createElement('span');
            charEl.className = 'char';
            charEl.textContent = char;
            wordWrapper.appendChild(charEl);
        });

        if (wordIndex < words.length - 1) {
            const spaceEl = document.createElement('span');
            spaceEl.className = 'char';
            spaceEl.innerHTML = '&nbsp;';
            wordWrapper.appendChild(spaceEl);
        }
        fragment.appendChild(wordWrapper);
    });
    textContentWrapper.appendChild(fragment);

    // Apply visual effects based on settings
    const allWordWrappers = textContentWrapper.querySelectorAll('.word-wrapper');
    if (effect === 'focused' || effect === 'blind') {
        allWordWrappers.forEach((wrapper, wordIndex) => {
            let isVisible = (effect === 'focused') ? wordIndex === currentWordIndex : Math.abs(wordIndex - currentWordIndex) <= 1;
            if (!isVisible) wrapper.classList.add('fx-hidden');
        });
    }

    const allChars = textContentWrapper.querySelectorAll('.char');
    allChars.forEach((charEl, index) => {
        if (index < currentIndex) {
            charEl.classList.add(originalText[index] === typedText[index] ? 'correct' : 'incorrect');
        }
        if (effect === 'ghost' && charEl.classList.contains('correct') && (currentIndex - index) > 3) {
            charEl.classList.add('ghost-fade');
        }
        if (effect === 'dyslexic') {
            // This is a simplified version for demonstration
        }
    });

    updateTextAndCaret(originalText, typedText, settings);
}

/**
 * Updates the position and style of the caret.
 * @param {string} originalText - The full string of the test.
 * @param {string} typedText - The portion of the text the user has typed.
 * @param {object} settings - The current user settings object.
 */
export function updateTextAndCaret(originalText, typedText, settings) {
    if (!caret) return;

    // Set caret animation speed
    let transitionSpeed = (settings.smoothCaret) ? '0.1s' : '0s';
    if (settings.specialEffect === 'lazy') transitionSpeed = '0.5s';
    if (settings.specialEffect === 'jumpy') transitionSpeed = '0s';
    document.documentElement.style.setProperty('--caret-transition-speed', transitionSpeed);

    // Set text display mode (static vs scroll)
    const contentWrapperClass = `text-content-wrapper ${settings.textDisplayMode === 'scroll' ? 'scroll' : ''}`;
    if (textContentWrapper.className !== contentWrapperClass) {
        textContentWrapper.className = contentWrapperClass;
    }

    // Find the target character for the caret
    const allChars = textContentWrapper.querySelectorAll('.char');
    let targetIndex = typedText.length;
    let targetChar = allChars[targetIndex];

    // Position the caret
    if (typedText.length >= originalText.length) {
        targetChar = allChars[originalText.length - 1];
        if (targetChar) {
            caret.style.left = `${targetChar.offsetLeft + targetChar.offsetWidth}px`;
            caret.style.top = `${targetChar.offsetTop}px`;
        }
    } else if (targetChar) {
        caret.style.left = `${targetChar.offsetLeft}px`;
        caret.style.top = `${targetChar.offsetTop}px`;
    } else { // Initial position
        caret.style.left = '0px';
        caret.style.top = '0px';
    }

    // Style the caret
    const charHeight = targetChar ? targetChar.offsetHeight : (parseFloat(getComputedStyle(textDisplayContainer).fontSize) * 1.2);
    caret.style.height = `${charHeight}px`;

    caret.className = ''; // Reset classes
    caret.classList.add(settings.caretStyle);

    if (settings.caretStyle === 'underline') {
        caret.style.top = `${parseFloat(caret.style.top) + charHeight - 3}px`;
        caret.style.height = `3px`;
        caret.style.width = targetChar ? `${targetChar.offsetWidth}px` : `1ch`;
    } else if (settings.caretStyle === 'block') {
        caret.style.width = targetChar ? `${targetChar.offsetWidth}px` : `1ch`;
    } else { // Line style
        caret.style.width = '2px';
    }

    // Handle scrolling
    if (settings.textDisplayMode === 'static' && targetChar) {
        const containerHeight = textDisplayContainer.clientHeight;
        const currentLineOffset = targetChar.offsetTop;
        const lineHeight = targetChar.offsetHeight;
        const scrollY = currentLineOffset - (containerHeight / 2) + (lineHeight / 2);
        
        // BUG FIX: Clamp the scroll value to prevent it from going beyond the content's bounds.
        const maxScroll = textContentWrapper.scrollHeight - containerHeight;
        const clampedScrollY = Math.max(0, Math.min(scrollY, maxScroll));
        
        textContentWrapper.style.transform = `translateY(-${clampedScrollY}px)`;

    } else if (settings.textDisplayMode === 'scroll') {
        const containerCenter = textDisplayContainer.clientWidth / 2;
        const caretLeft = parseFloat(caret.style.left) || 0;
        textContentWrapper.style.transform = `translateX(${containerCenter - caretLeft}px)`;
    }
}


/**
 * Renders the on-screen keyboard based on the selected layout.
 * @param {string} layoutName - The name of the layout to render (e.g., 'full', 'split').
 * @returns {object} A map of key codes to their DOM elements.
 */
export function renderKeyboard(layoutName) {
    const layout = layouts[layoutName];
    let keyMap = {};
    keyboardContainer.innerHTML = "";

    if (!layout) return keyMap;

    layout.forEach(row => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";
        row.forEach(keyData => {
            if (keyData.t === 'gap') {
                const gapEl = document.createElement('div');
                gapEl.className = 'key-gap';
                rowEl.appendChild(gapEl);
                return;
            }
            const keyEl = document.createElement("div");
            keyEl.className = `key ${keyData.s}`;
            keyEl.dataset.key = keyData.k;
            keyEl.innerHTML = keyData.t.length > 1 ? `<span class="special-text">${keyData.t}</span>` : keyData.t;
            rowEl.appendChild(keyEl);
            keyMap[keyData.k] = keyEl;
        });
        keyboardContainer.appendChild(rowEl);
    });
    return keyMap;
}

/**
 * Applies all visual settings from the settings object to the DOM.
 * @param {object} settings - The current user settings object.
 */
export function applySettings(settings) {
    document.body.dataset.theme = settings.theme;

    // Apply special effect class
    document.body.className = document.body.className.replace(/\bfx-\S+/g, '').trim();
    if (settings.specialEffect !== 'none') {
        document.body.classList.add('fx-' + settings.specialEffect);
    }

    // Apply CSS variables
    document.documentElement.style.setProperty('--accent-color', settings.accent);
    document.documentElement.style.setProperty('--main-font', settings.font);
    document.documentElement.style.setProperty('--key-unit-width', `${settings.keyboardSize}rem`);

    // Toggle keyboard visibility
    keyboardContainer.classList.toggle('hidden', settings.keyboard === 'hidden');
}

/**
 * Visually presses a key on the on-screen keyboard.
 * @param {HTMLElement} keyElement - The DOM element of the key to press.
 */
export function pressKey(keyElement) {
    if (keyElement) {
        keyElement.classList.add('pressed');
        setTimeout(() => keyElement.classList.remove('pressed'), 100);
    }
}
