// Create an array of all chessboard coordinates in regular order
const coordinates = [];
for (let rank = 8; rank >= 1; rank--) {
    for (let file = 'a'.charCodeAt(0); file <= 'h'.charCodeAt(0); file++) {
        coordinates.push(String.fromCharCode(file) + rank);
    }
}

const board = document.getElementById('board');
const squaresToGuess = [...coordinates]; // Create a copy of coordinates for random selection

// Shuffle the squaresToGuess array to randomize the order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(squaresToGuess);

// Create the chessboard
coordinates.forEach(coordinate => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.dataset.coordinate = coordinate;
    board.appendChild(square);
});

let currentIndex = 0;
let correctGuesses = 0;

// Stopwatch variables
let startTime;
let isGameFinished = false;

// Function to update the stopwatch display
function updateStopwatch() {
    if (!isGameFinished) {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 100; // Calculate elapsed tenths of a second
        const tenths = Math.floor(elapsedTime % 10); // Extract tenths of a second
        const seconds = Math.floor(elapsedTime / 10) % 60;
        const minutes = Math.floor(elapsedTime / 600);

        const secondsFormatted = (seconds < 10 ? '0' : '') + seconds.toString();

        const stopwatchElement = document.getElementById('time-display');
        stopwatchElement.innerText = `${minutes}:${secondsFormatted}.${tenths}`;

        setTimeout(updateStopwatch, 100); // Update the stopwatch approximately every 100 milliseconds
    }
}

// Function to reveal the color of the square when guessed
function revealColor(coordinate, color) {
    const square = document.querySelector(`.square[data-coordinate="${coordinate}"]`);
    square.classList.add(color);
    correctGuesses++;
}

// Function to mark the square as incorrect
function markIncorrect(coordinate) {
    const square = document.querySelector(`.square[data-coordinate="${coordinate}"]`);
    square.classList.add('wrong');
}

// Event listener for key presses ('w' for white, 'b' for black)
document.addEventListener('keydown', (event) => {
    if (event.repeat) {
        return;
    }

    const keyCode = event.key.toString();

    if (keyCode === ' ') {
        isGameFinished = true;
        restartGame();
        return;
    }

    if (currentIndex === squaresToGuess.length || (keyCode !== 'w' && keyCode !== 'b')) {
        return;
    }

    if (!startTime) {
        isGameFinished = false;
        startTime = Date.now();
        updateStopwatch();
    }

    const currentCoordinate = squaresToGuess[currentIndex];

    if (keyCode === 'w' && currentCoordinate.charCodeAt(0) % 2 !== currentCoordinate[1] % 2) {
        revealColor(currentCoordinate, 'white'); // White square color
    } else if (keyCode === 'b' && currentCoordinate.charCodeAt(0) % 2 === currentCoordinate[1] % 2) {
        revealColor(currentCoordinate, 'black'); // Black square color
    } else if (keyCode === 'w' || keyCode === 'b') {
        markIncorrect(currentCoordinate); // Mark the square as incorrect
    }

    currentIndex++;

    if (currentIndex < squaresToGuess.length) {
        document.getElementById('overlay').innerText = squaresToGuess[currentIndex];
    } else {
        document.getElementById('overlay').innerText = `${correctGuesses}/64`;
        isGameFinished = true; // Set the game as finished
    }
});

function restartGame() {
    currentIndex = 0;
    correctGuesses = 0;
    startTime = null;

    const stopwatchElement = document.getElementById('time-display');
    stopwatchElement.innerText = `0:00.0`;

    shuffleArray(squaresToGuess);
    document.getElementById('overlay').innerText = squaresToGuess[currentIndex];
    clearBoard();
}

function clearBoard() {
    // Remove all color classes from squares
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('white', 'black', 'wrong');
    });
}

// Initial display of the first coordinate in the overlay
document.getElementById('overlay').innerText = squaresToGuess[currentIndex];