const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const popupElement = document.getElementById('popup');
const timerTag = document.querySelector('.timer span');
const mistakeTag = document.querySelector('.mistake span');
const wpmTag = document.querySelector('.wpm span');
const cpmTag = document.querySelector('.cpm span');

let timer;
const maxTime = 60;
let timeLeft = maxTime;
let mistakes = 0;
let charIndex = 0;
let quote;

// Called on every input
quoteInputElement.addEventListener('input', () => {
    
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');   // Get the whole quote as array of characters
    let typedChar = quoteInputElement.value.split('')[charIndex];      // Split up input into array of characters and get current character

    if (charIndex == 0 && typedChar != null){                          // Start timer once user starts typing
        startTimer(); 
    }
     
    if (typedChar == null) {                                           // If input is backspace, decrement index, remove green or red
        charIndex--;
        if (arrayQuote[charIndex].classList.contains('incorrect')) {   // If user deletes incorrect character, decrement mistakes
            mistakes--;
        }
        arrayQuote[charIndex].classList.remove('correct', 'incorrect'); 
    } else{ 
        if (typedChar === arrayQuote[charIndex].innerText){            // If input matches, quote is green
            arrayQuote[charIndex].classList.add('correct');
        } else {                                                       // If input does not match, quote is red                 
            arrayQuote[charIndex].classList.add('incorrect');          // increment mistakes
            mistakes++;
            correct = false;
        }
        charIndex++;
    }
    
    arrayQuote.forEach(charSpan => charSpan.classList.remove('active'));    // Make sure none of the others are highlighted

    if (arrayQuote[charIndex] == null) {
        openPopup();                                                        // Open popup once quote is finished
    } else {
        arrayQuote[charIndex].classList.add('active');                      // Current character is highlighted
    }
    
    const timeElapsed = maxTime - timerTag.innerText;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = Math.floor((charIndex - mistakes) / timeElapsed * 60);
    wpmTag.innerText = Math.floor((quote.split(' ').length) / timeElapsed * 60);
})

// API call to get random quote
function getRandomQuote() { 
    return fetch(RANDOM_QUOTE_API_URL)
        .then(res => res.json())
        .then(data => data.content);
}

// Rendering quote on screen
async function renderNewQuote() { 
    quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';                         // Initialize empty display
    quote.split('').forEach(character => {                      // Split quote into array of characters and loop through
        const characterSpan = document.createElement('span');   // Make each character a span
        characterSpan.innerText = character;                     
        quoteDisplayElement.appendChild(characterSpan);         // Append each character to the display element
    })
    quoteInputElement.value = null;
    //startStopwatch();                                               // New timer for new quote
}

let startTime;
// Timer Function
function startTimer() {
    timerTag.innerText = maxTime;
    startTime = new Date();
    setInterval(() => {
        timerTag.innerText = getTimerTime()
        if (timerTag.innerText == 0) {
            openPopup();
        }
    }, 1000);
}

function getTimerTime() {
    return Math.floor(maxTime - (new Date() - startTime) / 1000);     // Calculate time left, convert to seconds, round to integer
}

// Stopwatch Function
function startStopwatch() {
    timerTag.innerText = 0;
    startTime = new Date();
    setInterval(() => {
        timerTag.innerText = getStopwatchTime()
    }, 1000);
}

function getStopwatchTime() {
    return Math.floor((new Date() - startTime) / 1000);     // Calculate time elapsed, convert to seconds, round to integer
}

// Reset key variables to start new game
function resetGame() {
    mistakes = 0;
    charIndex = 0;
}

// Make popup visible
function openPopup() {                    
    popupElement.classList.add('open-popup');
}

// Make popup invisible and call necessary functions to restart new game
function closePopup() {
    popupElement.classList.remove('open-popup');
    renderNewQuote();
    resetGame();
}

renderNewQuote();