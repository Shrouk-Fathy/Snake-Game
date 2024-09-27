const startButton = document.querySelector("#interface .button-interface button");
const buttonInterface = document.querySelector("#interface .button-interface");
const gameContainer = document.querySelector(".game-container");
const gameBoard = document.querySelector(".game-container .game-board");
let scoreContainer = document.querySelector(".game-container h2");
let score = 0;
let timer;

let touchStartX = 0;
let touchStartY = 0;

startButton.addEventListener("click", () => {
    const snakeSound = document.getElementById("snakeSound");
    snakeSound.currentTime = 0;
    snakeSound.play();
    buttonInterface.remove();
    setTimeout(() => {
        snakeSound.pause();
        gameContainer.style.display = "flex";
        timer = setInterval(moveSnake, 500);
    }, 2000);
});

const gameBoardSize = 20;
let snake = [{ x: 10, y: 11 }];
let food = generateFood();
let direction = 'right';
let snakeSpeed = 200;

function draw() {
    gameBoard.innerHTML = "";
    drawSnake();
    drawFood();
}
draw();

function drawSnake() {
    snake.forEach((segment, index) => {
        const snakeElement = createGameElement("div", "snake");

        if (index === 0) {
            snakeElement.style.borderRadius = "5px";
        }

        setPosition(snakeElement, segment);
        gameBoard.appendChild(snakeElement);
    });
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridRow = position.y;
    element.style.gridColumn = position.x;
}

function drawFood() {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
}

function generateFood() {
    const x = Math.floor(Math.random() * gameBoardSize) + 1;
    const y = Math.floor(Math.random() * gameBoardSize) + 1;
    return { x, y };
}

document.addEventListener("keydown", (event) => {
    const key = event.key;

    switch (key) {
        case "ArrowDown":
            direction = 'down';
            break;
        case "ArrowUp":
            direction = 'up';
            break;
        case "ArrowRight":
            direction = 'right';
            break;
        case "ArrowLeft":
            direction = 'left';
            break;
    }
});

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (flag) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
}

let flag = false;

function moveSnake() {
    if (flag) {
        return;
    }

    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
    }

    if (head.x < 1 || head.x > gameBoardSize || head.y < 1 || head.y > gameBoardSize || isSnakeBody(head.x, head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x !== food.x || head.y !== food.y) {
        snake.pop();
    } else {
        score++;
        updateScore();
        increaseSnakeSpeed();
        food = generateFood();
        drawFood();
    }

    draw();
}

function increaseSnakeSpeed() {
    snakeSpeed--;
    clearInterval(timer);
    timer = setInterval(moveSnake, snakeSpeed);
}

function isSnakeBody(x, y) {
    return snake.slice(1).some(segment => segment.x === x && segment.y === y);
}

function updateScore() {
    if (score < 10) scoreContainer.innerHTML = `00${score}`;
    else if (score < 100) scoreContainer.innerHTML = `0${score}`;
    else scoreContainer.innerHTML = `${score}`;
}

function gameOver() {
    flag = true;

    startButton.style.display = "none";
    const message = document.createElement("span");
    message.style.fontSize = "max(20px,3vw)";
    message.style.letterSpacing = "1";
    message.style.color = "#fff";
    const button = document.createElement("button");
    button.style.padding = "max(15px,1.5vw) max(15px,2.5vw)";
    button.style.fontSize = "max(20px,2vw)";
    button.style.marginTop = "20px";

    message.innerHTML = `Game Over! Your Score is ${snake.length - 1}`;
    button.innerHTML = "Play again";
    button.addEventListener("click", () => {
        location.reload();
    })

    buttonInterface.append(message);
    buttonInterface.append(button);
    document.body.prepend(buttonInterface);
}