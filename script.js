const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const boxSize = 20;
const canvasSize = 400;

let snake = [{ x: 8, y: 8 }];
let food = { x: 10, y: 10 };
let direction = 'right';
let score = 0;
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');
let gameLoop;

pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
restartButton.addEventListener('click', restartGame);



// Các đoạn mã JavaScript khác ở trên

function manhattanDistance(start, end) {
    const dx = Math.abs(start.x - end.x);
    const dy = Math.abs(start.y - end.y);
    return dx + dy;
}




function drawSnake() {
    snake.forEach((segment, index) => {
        const color = index === 0 ? '#00f' : '#0f0'; // Màu đầu con rắn khác màu phần còn lại
        ctx.fillStyle = color;
        ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });
}

function drawFood() {
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function updateGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    drawScore();
    checkCollision();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function moveSnake() {
    let head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'right') head.x++;
    if (direction === 'left') head.x--;
    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;

    // Wrap snake to the opposite side of the canvas
    if (head.x < 0) head.x = canvasSize / boxSize - 1;
    if (head.x >= canvasSize / boxSize) head.x = 0;
    if (head.y < 0) head.y = canvasSize / boxSize - 1;
    if (head.y >= canvasSize / boxSize) head.y = 0;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}


function generateFood() {
    const newFood = {
        x: Math.floor(Math.random() * (canvasSize / boxSize)),
        y: Math.floor(Math.random() * (canvasSize / boxSize))
    };

    // Make sure the food doesn't overlap with the snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        return generateFood();
    }

    food = newFood;
}

function checkCollision() {
    const head = snake[0];

    // Check collision with walls
    if (
        head.x < 0 || head.x >= canvasSize / boxSize ||
        head.y < 0 || head.y >= canvasSize / boxSize
    ) {
        endGame();
    }

    // Check collision with self
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameLoop);
    alert('Game over! Your score: ' + score);
    resetGame();
}

function resetGame() {
    snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
    direction = 'right';
    score = 0;
    generateFood();
    gameLoop = setInterval(updateGame, 100);
}

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
});

function pauseGame() {
    clearInterval(gameLoop);
}

function resumeGame() {
    gameLoop = setInterval(updateGame, 100);
    // resumeButton.style.display = 'none';
    //pauseButton.style.display = 'inline-block';
}

function restartGame() {
    clearInterval(gameLoop);
    resetGame();
}


resetGame();