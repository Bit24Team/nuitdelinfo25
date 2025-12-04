/* nuitdelinfo25/pages/lasergame/assets/scripts/game.js */

class LaserGame {
  constructor() {
    // Éléments du DOM
    this.body = document.body;
    this.startBtn = document.getElementById("start-game-btn");
    this.stopBtn = document.getElementById("stop-game-btn");
    this.gameUI = document.getElementById("game-ui");
    this.crosshair = document.getElementById("crosshair");
    this.scoreDisplay = document.getElementById("score");
    this.healthDisplay = document.getElementById("health");
    this.gameOverModal = document.getElementById("game-over-modal");

    // État du jeu
    this.score = 0;
    this.health = 100;
    this.isPlaying = false;
    this.enemyInterval = null;

    this.init();
  }

  init() {
    this.startBtn.addEventListener("click", () => this.startGame());
    this.stopBtn.addEventListener("click", () => this.stopGame());

    const saveBtn = document.getElementById("save-score");
    saveBtn.addEventListener("click", () => this.saveScore());
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.health = 100;
    this.updateDisplay();

    this.body.classList.add("game-mode");
    this.gameUI.classList.remove("hidden");
    this.startBtn.style.display = "none";

    document.addEventListener("mousemove", (e) => this.moveCrosshair(e));
    document.addEventListener("click", (e) => this.playerShoot(e));

    this.enemyInterval = setInterval(() => this.spawnEnemy(), 2000);
  }

  stopGame() {
    this.endGame(false);
  }

  endGame(isDead) {
    this.isPlaying = false;
    clearInterval(this.enemyInterval);

    document.querySelectorAll(".enemy").forEach((e) => e.remove());

    this.body.classList.remove("game-mode");
    document.removeEventListener("mousemove", (e) => this.moveCrosshair(e));
    document.removeEventListener("click", (e) => this.playerShoot(e));

    document.getElementById("final-score").innerText = this.score;
    this.gameOverModal.classList.remove("hidden");
    this.loadLeaderboard();
  }

  moveCrosshair(e) {
    this.crosshair.style.left = e.clientX + "px";
    this.crosshair.style.top = e.clientY + "px";
  }

  playerShoot(e) {
    if (!this.isPlaying) return;

    this.createLaserBeam(e.clientX, e.clientY);

    const target = e.target;

    if (
      target.classList.contains("targetable") ||
      target.closest(".targetable")
    ) {
      this.score += 10;
      this.animateHit(target);
      target.style.opacity = "0";
      setTimeout(() => (target.style.visibility = "hidden"), 300);
      this.updateDisplay();
    }

    if (target.classList.contains("enemy")) {
      this.score += 50;
      target.remove();
      this.updateDisplay();
    }
  }

  createLaserBeam(x, y) {
    const beam = document.createElement("div");
    beam.classList.add("laser-beam");
    document.body.appendChild(beam);

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight;

    const deltaX = x - startX;
    const deltaY = y - startY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    beam.style.width = length + "px";
    beam.style.left = startX + "px";
    beam.style.top = startY + "px";
    beam.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => beam.remove(), 100);
  }

  animateHit(element) {
    element.style.transform = "scale(0.9)";
    element.style.color = "red";
  }

  spawnEnemy() {
    if (!this.isPlaying) return;

    const enemy = new Enemy(this);
    enemy.spawn();
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
    this.updateDisplay();

    this.body.classList.add("damage-flash");
    setTimeout(() => this.body.classList.remove("damage-flash"), 200);

    if (this.health <= 0) {
      this.endGame(true);
    }
  }

  updateDisplay() {
    this.scoreDisplay.innerText = this.score;
    this.healthDisplay.innerText = this.health;
  }

  saveScore() {
    const name = document.getElementById("player-name").value || "Anonyme";
    const newScore = { name: name, score: this.score };

    let scores = JSON.parse(localStorage.getItem("lasergame_scores")) || [];
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);

    localStorage.setItem("lasergame_scores", JSON.stringify(scores));
    this.loadLeaderboard();
    document.getElementById("save-score").disabled = true;
  }

  loadLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    const scores = JSON.parse(localStorage.getItem("lasergame_scores")) || [];

    scores.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = `${s.name} : ${s.score} pts`;
      list.appendChild(li);
    });
  }
}

class Enemy {
  constructor(game) {
    this.game = game;
    this.element = null;
  }

  spawn() {
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    this.element.innerHTML = "👾";

    const x = Math.random() * (window.innerWidth - 50);
    const y = Math.random() * (window.innerHeight - 200) + 50;

    this.element.style.left = x + "px";
    this.element.style.top = y + "px";

    document.body.appendChild(this.element);

    setTimeout(() => {
      if (document.body.contains(this.element) && this.game.isPlaying) {
        this.fireBack();
      }
    }, 1500);

    setTimeout(() => {
      if (document.body.contains(this.element)) this.element.remove();
    }, 4000);
  }

  fireBack() {
    const rect = this.element.getBoundingClientRect();

    const projectile = document.createElement("div");
    projectile.style.position = "fixed";
    projectile.style.width = "10px";
    projectile.style.height = "10px";
    projectile.style.background = "red";
    projectile.style.borderRadius = "50%";
    projectile.style.left = rect.left + "px";
    projectile.style.top = rect.top + "px";
    projectile.style.transition = "all 0.5s linear";
    projectile.style.zIndex = "950";
    document.body.appendChild(projectile);

    setTimeout(() => {
      projectile.style.left = window.innerWidth / 2 + "px";
      projectile.style.top = window.innerHeight + "px";
      projectile.style.opacity = "0";
    }, 10);

    setTimeout(() => {
      projectile.remove();
      this.game.takeDamage(10);
    }, 500);
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  new LaserGame();
});
