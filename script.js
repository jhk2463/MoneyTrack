const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')

// Called on every input
quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')    // Get the whole quote as array of characters
    const arrayValue = quoteInputElement.value.split('')               // Split up input into array of characters
    let correct = true

    arrayQuote.forEach((characterSpan, index) => {                     
        const character = arrayValue[index]
        if (character == null) {                                       // If input is null, quote is black
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        } else if (character === characterSpan.innerText){             // If input matches, quote is green
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {                                                       // If input does not match, quote is red
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
        }
    })

    if (correct) renderNewQuote()                                      // If everything typed correctly, move on to new quote
})

// API call to get random quote
function getRandomQuote() { 
    return fetch(RANDOM_QUOTE_API_URL)
        .then(res => res.json())
        .then(data => data.content)
}

// Rendering quote on screen
async function renderNewQuote() { 
    const quote = await getRandomQuote()
    quoteDisplayElement.innerHTML = ''                          // Initialize empty display
    quote.split('').forEach(character => {                      // Split quote into array of characters and loop through
        const characterSpan = document.createElement('span')    // Make each character a span
        characterSpan.innerText = character                     
        quoteDisplayElement.appendChild(characterSpan)          // Append each character to the display element
    })
    quoteInputElement.value = null
    startTimer()                                                // New timer for new quote
}

let startTime
function startTimer() {
    timerElement.innerText = 0
    startTime = new Date()
    setInterval(() => {
        timer.innerText = getTimerTime()
    }, 1000)
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000)     // Calculate time elapsed, convert to seconds, round to integer
}

renderNewQuote()