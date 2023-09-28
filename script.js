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

function updateStopwatch() {
    if (!isGameFinished) {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 100;
        const tenths = Math.floor(elapsedTime % 10);
        const seconds = Math.floor(elapsedTime / 10) % 60;
        const minutes = Math.floor(elapsedTime / 600);

        const secondsFormatted = (seconds < 10 ? '0' : '') + seconds.toString();

        const stopwatchElement = document.getElementById('stopwatch');
        stopwatchElement.innerText = `${minutes}:${secondsFormatted}.${tenths}`;

        setTimeout(updateStopwatch, 100); // Update the stopwatch approximately every 100 milliseconds
    }
}

function revealColor(coordinate, color) {
    const square = document.querySelector(`.square[data-coordinate="${coordinate}"]`);
    square.classList.add(color);
    correctGuesses++;
}

function markIncorrect(coordinate) {
    const square = document.querySelector(`.square[data-coordinate="${coordinate}"]`);
    square.classList.add('wrong');
}

document.addEventListener('keydown', (event) => {
    if (event.repeat) {
        return;
    }

    const keyCode = event.key.toString();

    if (keyCode === ' ') {
        restartGame();
        return;
    }

    if (isGameFinished || (keyCode !== 'l' && keyCode !== 'd')) {
        return;
    }

    const currentCoordinate = squaresToGuess[currentIndex];

    if (keyCode === 'l' && currentCoordinate.charCodeAt(0) % 2 !== currentCoordinate[1] % 2) {
        revealColor(currentCoordinate, 'light');
    } else if (keyCode === 'd' && currentCoordinate.charCodeAt(0) % 2 === currentCoordinate[1] % 2) {
        revealColor(currentCoordinate, 'dark');
    } else if (keyCode === 'l' || keyCode === 'd') {
        markIncorrect(currentCoordinate);
    }

    currentIndex++;

    if (currentIndex < squaresToGuess.length) {
        document.getElementById('overlay').innerText = squaresToGuess[currentIndex];
    } else {
        document.getElementById('overlay').innerText = `${correctGuesses}/64`;
        isGameFinished = true;
    }
});

function restartGame() {
    isGameFinished = true;
    currentIndex = 0;
    correctGuesses = 0;

    const stopwatchElement = document.getElementById('stopwatch');
    stopwatchElement.innerText = `0:00.0`;

    shuffleArray(squaresToGuess);
    clearBoard();
    countdown();
}

function countdown() {
    document.getElementById('overlay').innerText = '3';
    setTimeout(() => {
        document.getElementById('overlay').innerText = '2';
        setTimeout(() => {
            document.getElementById('overlay').innerText = '1';
            setTimeout(() => {
                document.getElementById('overlay').innerText = 'go!';
                setTimeout(() => {
                    isGameFinished = false;
                    document.getElementById('overlay').innerText = squaresToGuess[currentIndex];
                    startTime = Date.now();
                    updateStopwatch();
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

function clearBoard() {
    // Remove all color classes from squares
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('light', 'dark', 'wrong');
    });
}

function displayTrueColors() {
    let interval = 0.5;

    function revealNextSquare() {
        if (currentIndex < coordinates.length) {
            const currentCoordinate = coordinates[currentIndex];
            const currentSquare = document.querySelector(`.square[data-coordinate="${currentCoordinate}"]`);

            // Change the background color to the true color with a delay
            setTimeout(() => {
                if (currentCoordinate.charCodeAt(0) % 2 !== currentCoordinate[1] % 2) {
                    currentSquare.classList.add('light');
                } else {
                    currentSquare.classList.add('dark');
                }

                currentIndex++;
                revealNextSquare();
            }, interval);
        } else {
            // All squares have been revealed, start the game
            document.getElementById('overlay').innerText = 'space';
        }
    }

    revealNextSquare();
}

// Call the function to display true colors when the game is loaded for the first time
displayTrueColors();
