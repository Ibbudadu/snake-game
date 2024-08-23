const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
canvas.width = 400;
canvas.height = 400;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
};

let score = 0;
let d;
let gameOver = false;
let gameSpeed = 100;
let game;

document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode === 38 && d !== 'DOWN') {
        d = 'UP';
    } else if (event.keyCode === 39 && d !== 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode === 40 && d !== 'UP') {
        d = 'DOWN';
    }
}

function draw() {
    if (gameOver) {
        ctx.fillStyle = '#FF0000';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 6.5, canvas.height / 2);
        ctx.font = '30px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2.5, canvas.height / 1.5);
        document.getElementById('restartGame').style.display = 'block';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#00FF00' : '#00AA00';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = '#003300';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver = true;
    }

    snake.unshift(newHead);

    document.getElementById('score').innerHTML = `Score: ${score}`;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function startGame() {
    const difficultyForm = document.getElementById('difficultyForm');
    const difficulty = difficultyForm.elements['difficulty'].value;

    switch (difficulty) {
        case 'easy':
            gameSpeed = 150;
            break;
        case 'intermediate':
            gameSpeed = 100;
            break;
        case 'hard':
            gameSpeed = 50;
            break;
    }

    document.querySelector('.difficulty-container').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';

    gameOver = false;
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    d = null;
    
    game = setInterval(draw, gameSpeed);
}

document.getElementById('startGame').addEventListener('click', startGame);

document.getElementById('restartGame').addEventListener('click', function() {
    clearInterval(game);
    document.querySelector('.difficulty-container').style.display = 'block';
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('restartGame').style.display = 'none';
});
