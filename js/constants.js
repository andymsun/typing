/**
 * constants.js
 * * This file contains all the static data used throughout the application.
 * This includes word lists for generating tests and layout information for the on-screen keyboard.
 */

// A list of common English words for generating tests.
export const wordList = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "person", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"];

// A list of punctuation marks to optionally include in tests.
export const punctuationList = ['.', ',', ';', "'", '?', '!'];

// Defines the structure of the on-screen keyboard for different layouts.
// t: text displayed on the key
// k: the 'code' of the key event
// s: the CSS class for sizing the key
export const layouts = {
    full: [
        [{t:'`',k:'Backquote',s:'u-100'},{t:'1',k:'Digit1',s:'u-100'},{t:'2',k:'Digit2',s:'u-100'},{t:'3',k:'Digit3',s:'u-100'},{t:'4',k:'Digit4',s:'u-100'},{t:'5',k:'Digit5',s:'u-100'},{t:'6',k:'Digit6',s:'u-100'},{t:'7',k:'Digit7',s:'u-100'},{t:'8',k:'Digit8',s:'u-100'},{t:'9',k:'Digit9',s:'u-100'},{t:'0',k:'Digit0',s:'u-100'},{t:'-',k:'Minus',s:'u-100'},{t:'=',k:'Equal',s:'u-100'},{t:'Backspace',k:'Backspace',s:'u-200'}],
        [{t:'Tab',k:'Tab',s:'u-150'},{t:'q',k:'KeyQ',s:'u-100'},{t:'w',k:'KeyW',s:'u-100'},{t:'e',k:'KeyE',s:'u-100'},{t:'r',k:'KeyR',s:'u-100'},{t:'t',k:'KeyT',s:'u-100'},{t:'y',k:'KeyY',s:'u-100'},{t:'u',k:'KeyU',s:'u-100'},{t:'i',k:'KeyI',s:'u-100'},{t:'o',k:'KeyO',s:'u-100'},{t:'p',k:'KeyP',s:'u-100'},{t:'[',k:'BracketLeft',s:'u-100'},{t:']',k:'BracketRight',s:'u-100'},{t:'\\',k:'Backslash',s:'u-150'}],
        [{t:'Caps Lock',k:'CapsLock',s:'u-175'},{t:'a',k:'KeyA',s:'u-100'},{t:'s',k:'KeyS',s:'u-100'},{t:'d',k:'KeyD',s:'u-100'},{t:'f',k:'KeyF',s:'u-100'},{t:'g',k:'KeyG',s:'u-100'},{t:'h',k:'KeyH',s:'u-100'},{t:'j',k:'KeyJ',s:'u-100'},{t:'k',k:'KeyK',s:'u-100'},{t:'l',k:'KeyL',s:'u-100'},{t:';',k:'Semicolon',s:'u-100'},{t:'\'',k:'Quote',s:'u-100'},{t:'Enter',k:'Enter',s:'u-225'}],
        [{t:'Shift',k:'ShiftLeft',s:'u-225'},{t:'z',k:'KeyZ',s:'u-100'},{t:'x',k:'KeyX',s:'u-100'},{t:'c',k:'KeyC',s:'u-100'},{t:'v',k:'KeyV',s:'u-100'},{t:'b',k:'KeyB',s:'u-100'},{t:'n',k:'KeyN',s:'u-100'},{t:'m',k:'KeyM',s:'u-100'},{t:',',k:'Comma',s:'u-100'},{t:'.',k:'Period',s:'u-100'},{t:'/',k:'Slash',s:'u-100'},{t:'Shift',k:'ShiftRight',s:'u-275'}],
        [{t:'Ctrl',k:'ControlLeft',s:'u-125'},{t:'Alt',k:'AltLeft',s:'u-125'},{t:' ',k:'Space',s:'u-625'},{t:'Alt',k:'AltRight',s:'u-125'},{t:'Ctrl',k:'ControlRight',s:'u-125'}]
    ],
    'no-numrow': [
        [{t:'Tab',k:'Tab',s:'u-150'},{t:'q',k:'KeyQ',s:'u-100'},{t:'w',k:'KeyW',s:'u-100'},{t:'e',k:'KeyE',s:'u-100'},{t:'r',k:'KeyR',s:'u-100'},{t:'t',k:'KeyT',s:'u-100'},{t:'y',k:'KeyY',s:'u-100'},{t:'u',k:'KeyU',s:'u-100'},{t:'i',k:'KeyI',s:'u-100'},{t:'o',k:'KeyO',s:'u-100'},{t:'p',k:'KeyP',s:'u-100'},{t:'[',k:'BracketLeft',s:'u-100'},{t:']',k:'BracketRight',s:'u-100'},{t:'\\',k:'Backslash',s:'u-150'}],
        [{t:'Caps Lock',k:'CapsLock',s:'u-175'},{t:'a',k:'KeyA',s:'u-100'},{t:'s',k:'KeyS',s:'u-100'},{t:'d',k:'KeyD',s:'u-100'},{t:'f',k:'KeyF',s:'u-100'},{t:'g',k:'KeyG',s:'u-100'},{t:'h',k:'KeyH',s:'u-100'},{t:'j',k:'KeyJ',s:'u-100'},{t:'k',k:'KeyK',s:'u-100'},{t:'l',k:'KeyL',s:'u-100'},{t:';',k:'Semicolon',s:'u-100'},{t:'\'',k:'Quote',s:'u-100'},{t:'Enter',k:'Enter',s:'u-225'}],
        [{t:'Shift',k:'ShiftLeft',s:'u-225'},{t:'z',k:'KeyZ',s:'u-100'},{t:'x',k:'KeyX',s:'u-100'},{t:'c',k:'KeyC',s:'u-100'},{t:'v',k:'KeyV',s:'u-100'},{t:'b',k:'KeyB',s:'u-100'},{t:'n',k:'KeyN',s:'u-100'},{t:'m',k:'KeyM',s:'u-100'},{t:',',k:'Comma',s:'u-100'},{t:'.',k:'Period',s:'u-100'},{t:'/',k:'Slash',s:'u-100'},{t:'Shift',k:'ShiftRight',s:'u-275'}],
        [{t:'Ctrl',k:'ControlLeft',s:'u-125'},{t:'Alt',k:'AltLeft',s:'u-125'},{t:' ',k:'Space',s:'u-625'},{t:'Alt',k:'AltRight',s:'u-125'},{t:'Ctrl',k:'ControlRight',s:'u-125'}]
    ],
    split: [
        [{t:'Tab',k:'Tab',s:'u-150'},{t:'q',k:'KeyQ',s:'u-100'},{t:'w',k:'KeyW',s:'u-100'},{t:'e',k:'KeyE',s:'u-100'},{t:'r',k:'KeyR',s:'u-100'},{t:'t',k:'KeyT',s:'u-100'},{t:'gap'},{t:'y',k:'KeyY',s:'u-100'},{t:'u',k:'KeyU',s:'u-100'},{t:'i',k:'KeyI',s:'u-100'},{t:'o',k:'KeyO',s:'u-100'},{t:'p',k:'KeyP',s:'u-100'},{t:'[',k:'BracketLeft',s:'u-100'},{t:']',k:'BracketRight',s:'u-100'}, {t:'\\', k:'Backslash', s:'u-150'}],
        [{t:'Caps',k:'CapsLock',s:'u-175'},{t:'a',k:'KeyA',s:'u-100'},{t:'s',k:'KeyS',s:'u-100'},{t:'d',k:'KeyD',s:'u-100'},{t:'f',k:'KeyF',s:'u-100'},{t:'g',k:'KeyG',s:'u-100'},{t:'gap'},{t:'h',k:'KeyH',s:'u-100'},{t:'j',k:'KeyJ',s:'u-100'},{t:'k',k:'KeyK',s:'u-100'},{t:'l',k:'KeyL',s:'u-100'},{t:';',k:'Semicolon',s:'u-100'},{t:'\'',k:'Quote',s:'u-100'}, {t:'Enter', k:'Enter', s:'u-225'}],
        [{t:'Shift',k:'ShiftLeft',s:'u-225'},{t:'z',k:'KeyZ',s:'u-100'},{t:'x',k:'KeyX',s:'u-100'},{t:'c',k:'KeyC',s:'u-100'},{t:'v',k:'KeyV',s:'u-100'},{t:'b',k:'KeyB',s:'u-100'},{t:'gap'},{t:'n',k:'KeyN',s:'u-100'},{t:'m',k:'KeyM',s:'u-100'},{t:',',k:'Comma',s:'u-100'},{t:'.',k:'Period',s:'u-100'},{t:'/',k:'Slash',s:'u-100'},{t:'Shift',k:'ShiftRight',s:'u-275'}],
        [{t:'Ctrl',k:'ControlLeft',s:'u-125'},{t:'Alt',k:'AltLeft',s:'u-125'},{t:' ',s:'u-275',k:'Space'},{t:'gap'},{t:' ',s:'u-275',k:'Space'},{t:'Alt',k:'AltRight',s:'u-125'},{t:'Ctrl',k:'ControlRight',s:'u-125'}]
    ]
};

// Defines the available test modes and their specific options.
export const modeOptions = { 
    time: [15, 30, 60, 120], 
    words: [10, 25, 50, 100], 
    quote: ['short', 'medium', 'long'], 
    zen: [] 
};
