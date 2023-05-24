const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerTag = document.querySelector('.timer span');
const mistakeTag = document.querySelector('.mistake span');
const wpmTag = document.querySelector('.wpm span');
const cpmTag = document.querySelector('.cpm span');

let mistakes = 0;
let charIndex = 0;

// Called on every input
quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');   // Get the whole quote as array of characters
    let typedChar = quoteInputElement.value.split('')[charIndex];      // Split up input into array of characters and get current character
    let correct = true;

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
    arrayQuote[charIndex].classList.add('active');                          // Current character is highlighted
    /*
    arrayQuote.forEach((characterSpan, index) => {                     
        const character = arrayValue[index];

        characterSpan.classList.remove('active');
        if (character == null && arrayValue[index-1] != null) {     // Current character is highlighted
            characterSpan.classList.add('active');
        }

        if (character == null) {                                       // If input is null, quote is black
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText){             // If input matches, quote is green
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {                                                       // If input does not match, quote is red
            characterSpan.classList.remove('correct');                 // increment mistakes
            characterSpan.classList.add('incorrect');
            mistakes++;
            correct = false;
        }
    })
    */
    mistakeTag.innerText = mistakes;
    //if (correct) renderNewQuote();                                     // If everything typed correctly, move on to new quote
})

// API call to get random quote
function getRandomQuote() { 
    return fetch(RANDOM_QUOTE_API_URL)
        .then(res => res.json())
        .then(data => data.content);
}

// Rendering quote on screen
async function renderNewQuote() { 
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';                         // Initialize empty display
    quote.split('').forEach(character => {                      // Split quote into array of characters and loop through
        const characterSpan = document.createElement('span');   // Make each character a span
        characterSpan.innerText = character;                     
        quoteDisplayElement.appendChild(characterSpan);         // Append each character to the display element
    })
    quoteInputElement.value = null;
    startTimer();                                               // New timer for new quote
}

// Continuously update time elapsed
let startTime;
function startTimer() {
    timerTag.innerText = 0;
    startTime = new Date();
    setInterval(() => {
        timerTag.innerText = getTimerTime()
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);     // Calculate time elapsed, convert to seconds, round to integer
}

renderNewQuote();