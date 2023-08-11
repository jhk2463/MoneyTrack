const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const video = document.getElementById('player');
video.volume = 0.5;

let charIndex = 0;
let quote;

// Called on every input
quoteInputElement.addEventListener('input', () => {
    
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');   // Get the whole quote as array of characters
    let typedChar = quoteInputElement.value.split('')[charIndex];      // Split up input into array of characters and get current character
     
    if (typedChar == null) {                                           // If input is backspace, decrement index, remove green or red
        charIndex--;
        arrayQuote[charIndex].classList.remove('correct', 'incorrect'); 
    } else{ 
        if (typedChar === arrayQuote[charIndex].innerText){            // If input matches, quote is green
            arrayQuote[charIndex].classList.add('correct');
        } else {                                                       // If input does not match, quote is red                 
            arrayQuote[charIndex].classList.add('incorrect');          
        }
        charIndex++;
    }
    
    arrayQuote.forEach(charSpan => charSpan.classList.remove('active'));    // Make sure none of the others are highlighted

    if (arrayQuote[charIndex] == null) {
        resetGame();                                                        // Once finished, reset everything
    } else {
        arrayQuote[charIndex].classList.add('active');                      // Current character is highlighted
    }
    
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
}

// Reset key variables for new quote
function resetGame() {
    charIndex = 0;
    renderNewQuote();
}

renderNewQuote();