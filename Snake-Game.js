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

const gameOverOverlay = document.getElementById("game-over");
const scoreSummary = document.getElementById("score-summary");
const playAgainButton = document.getElementById("play-again");
const volumeToggle = document.getElementById("volume-toggle");

let soundEnabled = true; // Variable to track if sound is enabled or disabled

volumeToggle.addEventListener("change", () => {
  soundEnabled = volumeToggle.checked; // Toggle soundEnabled based on checkbox state
});

function playSound(src, volume = 0.2) {
  if (!soundEnabled) return; // Only play sound if soundEnabled is true
  const audio = document.createElement("audio");
  audio.src = src;
  audio.volume = volume;
  audio.play();
}

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

  if (
    !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
  ) {
    event.preventDefault();
    return;
  } // that function ignores all non arrow keys starting the movement of the snake

  if (!interval) {
    startAuto();
  }

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
});

// enter key to restart the "Play Again Feature"
document.addEventListener("keydown", (event) => {
  if (isGameOver && event.key === "Enter") {
    playAgainButton.click();
  }
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
    if (direction !== "up") {
      nextHead += width;
      if (nextHead >= width * height) {
        GameOver();
        return;
      }
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
    playSound("Pebble.ogg", 0.2); // Updated to use playSound for blueberry sound
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

  playSound("Country_Blues.ogg", 0.1); // Updated to use playSound for game-over sound

  scoreSummary.textContent = `Your Score: ${score} | High Score: ${highScore}`;
  displayPlayAgain();
}

function displayPlayAgain() {
  gameOverOverlay.classList.remove("hidden");
}

playAgainButton.addEventListener("click", () => {
  gameOverOverlay.classList.add("hidden");
  restartGame();
});

// Touch controls for swipe input
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const threshold = 30; // Minimum swipe distance in pixels

function handleTouchStart(event) {
  const touch = event.changedTouches[0];
  touchStartX = touch.screenX;
  touchStartY = touch.screenY;
}

function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  touchEndX = touch.screenX;
  touchEndY = touch.screenY;

  handleSwipeGesture();
}

function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && direction !== "left") {
        move("right");
      } else if (deltaX < 0 && direction !== "right") {
        move("left");
      }
    }
  } else {
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0 && direction !== "up") {
        move("down");
      } else if (deltaY < 0 && direction !== "down") {
        move("up");
      }
    }
  }
  startAuto();
}

//

function restartGame() {
  // Reset variables
  snake.length = 0;
  for (let i = 6; i >= 0; i--) {
    snake.push(i);
  }
  head = snake[0];
  direction = "right";
  isGameOver = false;
  score = 0;

  // Clear the board
  const divs = board.querySelectorAll("div");
  divs.forEach((div) =>
    div.classList.remove(
      "snake",
      "head",
      "blueberry",
      "up",
      "right",
      "down",
      "left"
    )
  );

  // Reset and start the game without starting the interval
  setRandom();
  color();
  updateScore();
  interval = null; // Ensure interval is reset
}

//

const gameArea = document.querySelector(".frame");
gameArea.addEventListener("touchstart", handleTouchStart, false);
gameArea.addEventListener("touchend", handleTouchEnd, false);

document.body.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault();
  },
  { passive: false }
);
