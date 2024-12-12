const width = 20;
const height = 20;

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

const snake = [6, 5, 4, 3, 2, 1, 0];
let head = snake[0];

let score = 0;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

let direction = "right";
let interval;
let isGameOver = false;
let random;

let rightBoundaries = [];
let leftBoundaries = [];

for (let i = 0; i < height; i++) {
  rightBoundaries.push(i * width - 1);
}

for (let i = 1; i < height; i++) {
  leftBoundaries.push(i * width);
}

function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    board.appendChild(div);
  }
  setRandom();
  color();
  updateScore(); // Initialize score display
}

function color() {
  const divs = board.querySelectorAll("div");
  divs.forEach((div) => div.classList.remove("snake", "head", "up", "right", "down", "left"));
  snake.forEach((num) => divs[num].classList.add("snake"));
  divs[head].classList.add("head", direction);
}

function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => move(direction), 40);
}

window.addEventListener("keydown", (event) => {
  event.preventDefault();
  console.log(event.key);
  switch (event.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowDown":
      move("down");
      break;
  }
  startAuto();
});

function move(dir) {
  if (isGameOver) return;
  const divs = board.querySelectorAll("div");

  if (dir === "up") {
    if (direction === "down") return;
    head -= width;
    if (!divs[head]) GameOver();
  } else if (dir === "right") {
    if (direction === "left") return;
    head++;
    if (rightBoundaries.includes(head)) GameOver();
  } else if (dir === "left") {
    if (direction === "right") return;
    head--;
    if (leftBoundaries.includes(head)) GameOver();
  } else if (dir === "down") {
    if (direction === "up") return;
    head += width;
    if (!divs[head]) GameOver();
  }
  if (snake.includes(head)) {
    GameOver();
    return;
  }

  direction = dir;
  snake.unshift(head);

  if (random === head) {
    const audio = document.createElement("audio");
    audio.src = "Pebble.ogg";
    audio.volume = 0.2;
    audio.play();

    score++; 
    updateScore();

    setRandom();
  } else {
    snake.pop();
  }

  startAuto();
  color();
}

function setRandom() {
  random = Math.floor(Math.random() * width * height);
  if (snake.includes(random)) {
    setRandom();
  } else {
    const divs = board.querySelectorAll("div");
    divs.forEach((div) => div.classList.remove("blueberry"));
    divs[random].classList.add("blueberry");
  }
}

function updateScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); 
  }
  const scoreCounter = document.getElementById("score-counter");
  scoreCounter.textContent = `Score: ${score} | High Score: ${highScore}`;
}

function GameOver() {
  isGameOver = true;
  clearInterval(interval);
  const audio = document.createElement("audio");
  audio.src = "Country_Blues.ogg";
  audio.volume = 0.1;
  audio.play();

  setTimeout(() => {
    alert("GAME OVER 🥺");
    location.reload();
  }, 200);
}
