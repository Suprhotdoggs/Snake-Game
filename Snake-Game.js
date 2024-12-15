const width = 20;
const height = 20;

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

const snake = [6, 5, 4, 3, 2, 1, 0];
let head = snake[0];

let score = 0;
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;

let direction = "right";
let interval;
let isGameOver = false;
let random;

// Remove boundary arrays
// let rightBoundaries = [];
// let leftBoundaries = [];

// Control buttons
const upButton = document.getElementById("up");
const rightButton = document.getElementById("right");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");

// Game over screen
const gameOverOverlay = document.getElementById("game-over");
const scoreSummary = document.getElementById("score-summary");
const playAgainButton = document.getElementById("play-again");

// Remove boundary initializations
// ...

function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const div = document.createElement("div");
    board.appendChild(div);
  }
  setRandom();
  color();
  updateScore();
}

function color() {
  const divs = board.querySelectorAll("div");
  divs.forEach((div) =>
    div.classList.remove("snake", "head", "up", "right", "down", "left")
  );
  snake.forEach((num) => divs[num].classList.add("snake"));
  divs[head].classList.add("head", direction);
}

function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => move(direction), 40);
}

window.addEventListener("keydown", (event) => {
  event.preventDefault();
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") move("up");
      break;
    case "ArrowRight":
      if (direction !== "left") move("right");
      break;
    case "ArrowLeft":
      if (direction !== "right") move("left");
      break;
    case "ArrowDown":
      if (direction !== "up") move("down");
      break;
  }
  startAuto();
});

function move(dir) {
  if (isGameOver) return;
  const divs = board.querySelectorAll("div");

  let nextHead = head;

  if (dir === "up") {
    if (direction === "down") return;
    nextHead -= width;
    if (nextHead < 0) {
      GameOver();
      return;
    }
  } else if (dir === "right") {
    if (direction === "left") return;
    if ((head + 1) % width === 0) {
      GameOver();
      return;
    }
    nextHead++;
  } else if (dir === "left") {
    if (direction === "right") return;
    if (head % width === 0) {
      GameOver();
      return;
    }
    nextHead--;
  } else if (dir === "down") {
    if (direction === "up") return;
    nextHead += width;
    if (nextHead >= width * height) {
      GameOver();
      return;
    }
  }

  if (snake.includes(nextHead)) {
    GameOver();
    return;
  }

  head = nextHead;
  direction = dir;
  snake.unshift(head);

  if (head === random) {
    // Play sound when eating the blueberry
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

  color();
}

function setRandom() {
  const divs = board.querySelectorAll("div");
  divs.forEach((div) => div.classList.remove("blueberry"));

  do {
    random = Math.floor(Math.random() * width * height);
  } while (snake.includes(random));

  divs[random].classList.add("blueberry");
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

  scoreSummary.textContent = `Your Score: ${score} | High Score: ${highScore}`;
  displayPlayAgain();
}

function displayPlayAgain() {
  gameOverOverlay.classList.remove("hidden");
}

playAgainButton.addEventListener("click", () => {
  gameOverOverlay.classList.add("hidden");
  location.reload();
});

// Control button event listeners
upButton.addEventListener("click", () => {
  if (direction !== "down") {
    move("up");
    startAuto();
  }
});

rightButton.addEventListener("click", () => {
  if (direction !== "left") {
    move("right");
    startAuto();
  }
});

downButton.addEventListener("click", () => {
  if (direction !== "up") {
    move("down");
    startAuto();
  }
});

leftButton.addEventListener("click", () => {
  if (direction !== "right") {
    move("left");
    startAuto();
  }
});
