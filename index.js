const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const delHistoryBtn = document.querySelector("#delHistoryBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
const snakeHeadUp = new Image();
const snakeHeadDown = new Image();
const snakeHeadRight = new Image();
const snakeHeadLeft = new Image();
snakeHeadUp.src = "img/SnakeHeadUp.png";
snakeHeadDown.src = "img/snakeHeadDown.png";
snakeHeadRight.src = "img/snakeHeadRight.png";
snakeHeadLeft.src = "img/snakeHeadLeft.png";
let running = false;
let foodOnMap = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0},
];
let changeDirectionCounter = 0;
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
delHistoryBtn.addEventListener("click", delHistory);
gameStart();


function gameStart(){
    running = true;
    drawSnake();
    nextTick();
    createFood();
}
function nextTick(){
    if(running){
        intervalId = setInterval(() => {
            const startTime = performance.now();
            changeDirectionCounter = 0;
            clearBoard();
            moveSnake();
            drawSnake();
            drawFood();
            if(snake[0].x == foodX && snake[0].y == foodY){
                score += 1;
                snake.push({x:[snake.lenth].x - xVelocity, y:[snake.lenth].y - yVelocity})
                createFood();
            }
            scoreText.textContent = score;
            checkGameOver();
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            // console.log((executionTime.toFixed(3)));
        }, 100);
    }
}
function drawSnake(){
    snake.forEach(cell => {
        ctx.strokeStyle = snakeBorder;
        ctx.strokeRect(cell.x, cell.y, unitSize, unitSize);
        ctx.fillStyle = snakeColor;
        ctx.fillRect(cell.x, cell.y, unitSize, unitSize);
    });
    switch(true){
        case xVelocity == 0 && yVelocity == -unitSize:
            ctx.drawImage(snakeHeadUp, snake[0].x, snake[0].y, unitSize, unitSize);
            break;
        case xVelocity == 0 && yVelocity == unitSize:
            ctx.drawImage(snakeHeadDown, snake[0].x, snake[0].y, unitSize, unitSize);
            break;
        case xVelocity == unitSize && yVelocity == 0:
            ctx.drawImage(snakeHeadRight, snake[0].x, snake[0].y, unitSize, unitSize);
            break;
        case xVelocity == -unitSize && yVelocity == 0:
            ctx.drawImage(snakeHeadLeft, snake[0].x, snake[0].y, unitSize, unitSize);
            break;
    }
}
function clearBoard(){
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}
function createFood(){
    randomFood();
    for(let i = 0; i < snake.length; i++){
        if(snake[i].x != foodX && snake[i].y != foodY){
            continue;
        }
        else if(snake[i].x == foodX && snake[i].y == foodY){
            randomFood();
        }
    }
    function randomFood(){
        foodX = Math.round((Math.random()*(gameWidth - unitSize)) / unitSize) * unitSize;
        foodY = Math.round((Math.random()*(gameHeight - unitSize)) / unitSize) * unitSize;
    }
}

function drawFood(){
    ctx.strokeStyle = snakeBorder;
    ctx.strokeRect(foodX, foodY, unitSize, unitSize);
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake(){
    let prevX = snake[0].x;
    let prevY = snake[0].y;
    snake[0].x += xVelocity;
    snake[0].y += yVelocity;
    for(let i = 1; i < snake.length; i++){
        let tempX = snake[i].x;
        let tempY = snake[i].y;
        snake[i].x = prevX;
        snake[i].y = prevY;
        prevX = tempX;
        prevY = tempY;
    }
    snake[0].x > gameWidth - unitSize? snake[0].x = 0 : snake[0].x;
    snake[0].x < 0 ? snake[0].x = gameWidth - unitSize : snake[0].x;
    snake[0].y > gameHeight - unitSize ? snake[0].y = 0 : snake[0].y;
    snake[0].y < 0 ? snake[0].y = gameHeight - unitSize : snake[0].y;
}
function changeDirection(keyPressed){
    if(changeDirectionCounter == 0){
        switch(keyPressed.code){
            case "KeyW":
            case "ArrowUp":
                if(yVelocity != unitSize){
                    changeDirectionCounter += 1;
                    yVelocity = -unitSize;
                    xVelocity = 0;
                }
                break;
            case "KeyS":
            case "ArrowDown":
                if(yVelocity != -unitSize){
                    changeDirectionCounter += 1;
                    yVelocity = unitSize;
                    xVelocity = 0;
                }
                break;
            case "KeyA":
            case "ArrowLeft":
                if(xVelocity != unitSize){
                    changeDirectionCounter += 1;
                    xVelocity = -unitSize;
                    yVelocity = 0;
                }
                break;
            case "KeyD":
            case "ArrowRight":
                if(xVelocity != -unitSize){
                    changeDirectionCounter += 1;
                    xVelocity = unitSize;
                    yVelocity = 0;
                }
                break;
        }
    }
}
function checkGameOver(){
    for(i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            running = false;
            clearInterval(intervalId);
            addCokie();
            displayGameOver();
            break;
        }
    }
}
function displayGameOver(){
    let textOne = `GAME OVER!`;
    let textTwo = `Yout highest score is: ${getMaxCookie()}`;
    let verticalSpace = 30;

    ctx.font = " 80px 'Permanent Marker', cursive";
    ctx.fillStyle = "black";
    let textOneWidth = ctx.measureText(textOne).width;
    let textOneX = (gameWidth - textOneWidth) / 2;
    let textOneY = gameHeight / 2 - verticalSpace;
    ctx.fillText(textOne, textOneX, textOneY);

    ctx.font = " 35px 'Permanent Marker', cursive";
    ctx.fillStyle = "black";
    let textTwoWidth = ctx.measureText(textTwo).width;
    let textTwoX = (gameWidth - textTwoWidth) / 2;
    let textTwoY = gameHeight / 2 + verticalSpace;
    ctx.fillText(textTwo, textTwoX, textTwoY);
}
function resetGame(){
    clearInterval(intervalId)
    clearBoard();
    score = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0},
    ];
    xVelocity = unitSize;
    yVelocity = 0;
    foodOnMap = false;
    gameStart();
}
function setCookie(cookieName, cookieValue, cookieLifetime){
    const date = new Date();
    date.setTime(date.getTime() + cookieLifetime * 24 * 60 * 60 * 1000);
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${cookieName}=${cookieValue}; ${expires}; path=/`
}
function addCokie(){
    const cDecoded = decodeURIComponent(document.cookie);
    let cArray = [];
    cDecoded.split("; ").forEach(element => {
        cArray.push(element.substring(element.indexOf("=") + 1));
    });
    if(score > getMaxCookie()){
        setCookie("HighestScore", score, 365);
    }
}
function delHistory(){
    setCookie("HighestScore", null, null)
}
function getMaxCookie(){
    const cDecoded = decodeURIComponent(document.cookie);
    let cArray = [];
    cDecoded.split("; ").forEach(element => {
        cArray.push(element.substring(element.indexOf("=") + 1));
    });
    return Math.max(...cArray);
}