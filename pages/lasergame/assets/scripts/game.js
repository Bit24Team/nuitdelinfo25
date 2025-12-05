/* nuitdelinfo25/pages/lasergame/assets/scripts/game.js */

class LaserGame {
  constructor() {
    this.body = document.body;
    this.startBtn = document.getElementById("start-game-btn");
    this.stopBtn = document.getElementById("stop-game-btn");
    this.gameUI = document.getElementById("game-ui");
    this.crosshair = document.getElementById("crosshair");
    this.scoreDisplay = document.getElementById("score");
    this.healthDisplay = document.getElementById("health");
    this.gameOverModal = document.getElementById("game-over-modal");

    this.soundManager = new SoundManager();

    this.score = 0;
    this.health = 100;
    this.isPlaying = false;

    // Paramètres de difficulté
    this.baseSpawnRate = 2000;
    this.minSpawnRate = 500;
    this.currentSpawnRate = this.baseSpawnRate;
    this.spawnTimer = null;

    this.init();
  }

  init() {
    if (this.startBtn)
      this.startBtn.addEventListener("click", () => this.startGame());
    if (this.stopBtn)
      this.stopBtn.addEventListener("click", () => this.stopGame());
    const saveBtn = document.getElementById("save-score");
    if (saveBtn) saveBtn.addEventListener("click", () => this.saveScore());
  }

  startGame() {
    this.soundManager.init();
    this.soundManager.playStart();

    this.isPlaying = true;
    this.score = 0;
    this.health = 100;
    this.currentSpawnRate = this.baseSpawnRate;
    this.updateDisplay();

    this.body.classList.add("game-mode");
    this.gameUI.classList.remove("hidden");

    if (this.startBtn) this.startBtn.style.display = "none";
    const header = document.querySelector(".game-header");
    if (header) header.style.opacity = "0.5";

    this.boundMove = (e) => this.moveCrosshair(e);
    this.boundShoot = (e) => this.playerShoot(e);
    document.addEventListener("mousemove", this.boundMove);
    document.addEventListener("click", this.boundShoot);

    this.scheduleNextEnemy();
  }

  scheduleNextEnemy() {
    if (!this.isPlaying) return;

    // Spawn aléatoire d'ennemis différents
    const rand = Math.random();
    if (rand > 0.9) new Enemy(this, "boss").spawn(); // 10% Boss
    else if (rand > 0.7) new Enemy(this, "fast").spawn(); // 20% Rapide
    else new Enemy(this, "basic").spawn(); // 70% Basique

    // Augmentation difficulté (plus rapide à chaque spawn)
    const reduction = Math.floor(this.score / 150) * 100;
    let nextRate = this.baseSpawnRate - reduction;
    if (nextRate < this.minSpawnRate) nextRate = this.minSpawnRate;

    this.spawnTimer = setTimeout(() => {
      this.scheduleNextEnemy();
    }, nextRate);
  }

  stopGame() {
    this.endGame(false);
  }

  endGame(isDead) {
    this.isPlaying = false;
    clearTimeout(this.spawnTimer);

    if (isDead) this.soundManager.playGameOver();

    document.querySelectorAll(".enemy").forEach((e) => e.remove());
    document.querySelectorAll(".enemy-projectile").forEach((e) => e.remove());
    document.querySelectorAll(".laser-beam").forEach((e) => e.remove());

    this.body.classList.remove("game-mode");
    this.body.classList.remove("shake-screen");
    document.removeEventListener("mousemove", this.boundMove);
    document.removeEventListener("click", this.boundShoot);

    const finalScoreEl = document.getElementById("final-score");
    if (finalScoreEl) finalScoreEl.innerText = this.score;

    this.gameOverModal.classList.remove("hidden");
    this.loadLeaderboard();

    // Reset l'opacité du header
    const header = document.querySelector(".game-header");
    if (header) header.style.opacity = "1";
  }

  moveCrosshair(e) {
    this.crosshair.style.left = e.clientX + "px";
    this.crosshair.style.top = e.clientY + "px";
  }

  playerShoot(e) {
    if (!this.isPlaying) return;
    if (e.target.closest("#game-ui") || e.target.closest(".navbar")) return;

    this.soundManager.playShoot();
    this.createLaserBeam(e.clientX, e.clientY);

    const target = e.target;

    // Tir sur le site (Texte)
    if (
      target.classList.contains("targetable") ||
      target.closest(".targetable")
    ) {
      this.score += 10;
      this.soundManager.playHit();

      target.classList.add("element-hit");
      setTimeout(() => target.classList.remove("element-hit"), 150);

      let currentOp = parseFloat(window.getComputedStyle(target).opacity);
      target.style.opacity = currentOp - 0.25;

      if (currentOp - 0.25 <= 0) {
        target.style.visibility = "hidden";
        this.createExplosion(e.clientX, e.clientY, "var(--primary-color)");
      }
      this.updateDisplay();
    }

    // Tir sur Ennemi
    if (target.classList.contains("enemy")) {
      // Logique simple: 1 coup = mort (sauf Boss qui pourrait en prendre plus, ici simplifié)
      const pts = target.dataset.type === "boss" ? 150 : 50;
      this.score += pts;

      this.soundManager.playExplosion();
      this.createExplosion(e.clientX, e.clientY, "var(--accent-color)");
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
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    beam.style.width = length + "px";
    beam.style.left = startX + "px";
    beam.style.top = startY + "px";
    beam.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => beam.remove(), 80);
  }

  createExplosion(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("div");
      p.style.position = "fixed";
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.width = "6px";
      p.style.height = "6px";
      p.style.borderRadius = "50%";
      p.style.background = color || "white";
      p.style.pointerEvents = "none";
      p.style.zIndex = "9999";

      const vx = (Math.random() - 0.5) * 150;
      const vy = (Math.random() - 0.5) * 150;

      p.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 },
        ],
        { duration: 500, easing: "ease-out", fill: "forwards" }
      );

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 500);
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    this.soundManager.playDamage(); // SON DÉGÂTS ICI

    if (this.health < 0) this.health = 0;
    this.updateDisplay();

    // Effets visuels
    this.body.classList.remove("shake-screen");
    void this.body.offsetWidth;
    this.body.classList.add("shake-screen");

    const flash = document.createElement("div");
    flash.className = "damage-overlay";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);

    if (this.health <= 0) this.endGame(true);
  }

  updateDisplay() {
    this.scoreDisplay.innerText = this.score;
    this.healthDisplay.innerText = this.health + "%";
    this.healthDisplay.style.color =
      this.health < 30 ? "#ef4444" : "var(--accent-color)";
  }

  saveScore() {
    // ... (Ton code de sauvegarde inchangé) ...
    const name = document.getElementById("player-name").value || "Anonyme";
    const newScore = { name: name, score: this.score };
    let scores = JSON.parse(localStorage.getItem("lasergame_scores")) || [];
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);
    localStorage.setItem("lasergame_scores", JSON.stringify(scores));
    this.loadLeaderboard();
    document.getElementById("save-score").disabled = true;
    document.getElementById("save-score").innerText = "Enregistré !";
  }

  loadLeaderboard() {
    // ... (Ton code de leaderboard inchangé) ...
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    const scores = JSON.parse(localStorage.getItem("lasergame_scores")) || [];
    scores.forEach((s) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${s.name}</span> <strong>${s.score}</strong>`;
      list.appendChild(li);
    });
  }
}

class Enemy {
  constructor(game, type = "basic") {
    this.game = game;
    this.element = null;
    this.type = type; // basic, fast, boss
  }

  spawn() {
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    this.element.dataset.type = this.type;

    // Customisation selon le type
    if (this.type === "boss") {
      this.element.innerHTML = "👹";
      this.element.style.fontSize = "60px";
      this.element.style.filter = "drop-shadow(0 0 20px red)";
    } else if (this.type === "fast") {
      this.element.innerHTML = "🛸";
      this.element.style.fontSize = "30px";
    } else {
      this.element.innerHTML = "👾"; // Basic
    }

    // Spawn Area
    const x = Math.random() * (window.innerWidth - 80) + 40;
    const y = Math.random() * (window.innerHeight * 0.5) + 80;
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";
    document.body.appendChild(this.element);

    // Comportement de tir
    if (this.type !== "fast") {
      setTimeout(() => {
        if (document.body.contains(this.element) && this.game.isPlaying) {
          this.fireBack();
        }
      }, 800 + Math.random() * 800);
    }

    // Mouvement "Erratique" pour les rapides
    if (this.type === "fast") {
      this.moveErratic();
    }

    // Disparition
    setTimeout(
      () => {
        if (this.element && this.element.parentNode) this.element.remove();
      },
      this.type === "boss" ? 5000 : 3500
    );
  }

  moveErratic() {
    if (!this.element.parentNode) return;
    const x = Math.random() * (window.innerWidth - 80);
    const y = Math.random() * (window.innerHeight - 80);

    this.element.style.transition = "all 1s ease-in-out";
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";

    setTimeout(() => {
      if (this.element.parentNode) this.moveErratic();
    }, 1000);
  }

  fireBack() {
    if (!this.element.parentNode) return;
    const rect = this.element.getBoundingClientRect();

    // Le Boss tire 3 balles !
    if (this.type === "boss") {
      this.spawnProjectile(rect, -50); // Gauche
      this.spawnProjectile(rect, 0); // Centre
      this.spawnProjectile(rect, 50); // Droite
    } else {
      this.spawnProjectile(rect, 0);
    }
  }

  spawnProjectile(rect, offsetX) {
    const p = document.createElement("div");
    p.className = "enemy-projectile";
    // Si Boss, projectile plus gros
    if (this.type === "boss") {
      p.style.width = "20px";
      p.style.height = "20px";
      p.style.background = "#8b5cf6"; // Violet méchant
    }

    p.style.left = rect.left + 25 + "px";
    p.style.top = rect.top + 25 + "px";
    document.body.appendChild(p);

    const targetX = window.innerWidth / 2 + offsetX; // Vise un peu à côté si salve
    const targetY = window.innerHeight;

    p.animate(
      [
        { transform: "translate(0,0)" },
        {
          transform: `translate(${targetX - rect.left}px, ${
            targetY - rect.top
          }px)`,
        },
      ],
      {
        duration: this.type === "boss" ? 900 : 600,
        easing: "linear",
        fill: "forwards",
      }
    ).onfinish = () => {
      p.remove();
      if (this.game.isPlaying)
        this.game.takeDamage(this.type === "boss" ? 20 : 10);
    };
  }
}

class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx)
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  playTone(freq, type, duration, vol = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Effet de chute de fréquence (Pew !)
    if (type === "square" || type === "sawtooth") {
      osc.frequency.exponentialRampToValueAtTime(
        freq / 2,
        this.ctx.currentTime + duration
      );
    }

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.ctx.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // --- BRUITAGES CALIBRÉS ---
  playShoot() {
    this.playTone(800, "square", 0.1, 0.05);
  }
  playHit() {
    this.playTone(600, "triangle", 0.1, 0.05);
  }
  playExplosion() {
    this.playTone(100, "sawtooth", 0.4, 0.15);
  }
  playDamage() {
    this.playTone(120, "sawtooth", 0.3, 0.2);
  } // Plus fort
  playStart() {
    this.playTone(500, "sine", 0.5, 0.1);
  }
  playGameOver() {
    this.playTone(200, "sawtooth", 1, 0.2);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LaserGame();
});
