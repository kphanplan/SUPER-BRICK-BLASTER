//Game settings
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var mainColor = "#0095DD";
var score = 0;
var lives = 3;

function bonkSound() {
    var sound = document.getElementById("bonk");
    sound.play();
}

function bgm() {
    var sound = document.getElementById("bgm");
    sound.volume = 0.2;
    sound.play();
}

function victorySound() {
    var sound = document.getElementById("victory");
    sound.play();
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

//Player controls
//mouse controls
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
//keyboard controls
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

//paddle variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

//generates the Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = mainColor;
  ctx.fill();
  ctx.closePath();
}

//ball start position
var x = canvas.width / 2;
var y = canvas.height - 30;
//ball velocity
var dx = 2;
var dy = -2;
//ball hitbox
var ballRadius = 10;
ctx.arc(x, y, ballRadius, 0, Math.PI * 2);

//generates the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = mainColor;
  ctx.fill();
  ctx.closePath();
}

//Brick variables
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 120;
var brickHeight = 40;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
//generates Z number of bricks with status of 1
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//draw the bricks
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = mainColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//create brick hitboxes
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          bonkSound();
          //ends the game when you have no bricks left
          if (score == brickRowCount * brickColumnCount) {
            victorySound();
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
}

//GAME PROPERTIES
function game() {
  //this clears and creates "fps"
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bgm();
  drawScore();
  drawLives();
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  //creates ball collision at frame ends (right, left)
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //ends the game if ball hits bottom Y wall
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    //paddle collision
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
        //prompts game over
        lives--;
        if(!lives) {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
        else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
    }
  }

  //updates paddle's position and adds wall collision
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  //updates the ball's position
  x += dx;
  y += dy;
}
//generates the ball every 10ms
var interval = setInterval(game, 10);
