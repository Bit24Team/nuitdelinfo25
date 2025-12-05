// Snake Game - Activated by typing "snake"
class SnakeGame {
    constructor() {
        this.active = false;
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.directionQueue = []; // File de commandes pour les mouvements rapides
        this.foods = [];
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.gameSpeed = 130;
        this.gameLoop = null;
        this.snakeSize = 40;
        this.smoothMovement = true;
        this.animationFrame = null;
        this.typedWord = '';
        this.typingTimeout = null;
        this.snakeElements = [];
        this.foodElements = [];
        
        // Challenge logos as food
        this.foodImages = [
            'https://www.nuitdelinfo.com/inscription/uploads/partenaires/307/logos/logo.png',
            'assets/logo_2.png',
            'https://www.nuitdelinfo.com/inscription/uploads/partenaires/467/logos/logo.jpg',
            'https://www.nuitdelinfo.com/inscription/uploads/partenaires/448/logos/logo.png',
            'https://www.nuitdelinfo.com/inscription/uploads/partenaires/500/logos/logo.jpg'
        ];
        
        // Sound effects
        this.sounds = {
            start: this.createSound([262, 330, 392, 523], [0.1, 0.1, 0.1, 0.2]),
            eat: this.createSound([523, 659], [0.05, 0.1]),
            gameOver: this.createSound([392, 330, 262, 196], [0.1, 0.1, 0.1, 0.3])
        };
        
        this.init();
    }
    
    init() {
        // Listen for typing "snake"
        document.addEventListener('keypress', (e) => {
            if (this.active) return;
            
            clearTimeout(this.typingTimeout);
            this.typedWord += e.key.toLowerCase();
            
            if (this.typedWord.includes('snake')) {
                this.activate();
                this.typedWord = '';
            }
            
            // Reset typed word after 2 seconds of inactivity
            this.typingTimeout = setTimeout(() => {
                this.typedWord = '';
            }, 2000);
        });
    }
    
    createSound(frequencies, durations) {
        return () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let startTime = audioContext.currentTime;
            
            frequencies.forEach((freq, i) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.1, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + durations[i]);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + durations[i]);
                
                startTime += durations[i];
            });
        };
    }
    
    activate() {
        if (this.active) return;
        
        this.active = true;
        this.score = 0;
        this.sounds.start();
        this.hideOriginalImages();
        this.initSnake();
        this.spawnFood();
        this.createScoreDisplay();
        this.startGame();
        this.showInstructions();
        
        // Listen for arrow keys and ESC
        this.keyHandler = this.handleKeyPress.bind(this);
        document.addEventListener('keydown', this.keyHandler);
    }
    
    hideOriginalImages() {
        // Hide challenge card images with fade-out animation
        const images = document.querySelectorAll('.card-icon img');
        images.forEach(img => {
            img.dataset.originalDisplay = img.style.display || '';
            img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            img.style.opacity = '0';
            img.style.transform = 'scale(0.8)';
            setTimeout(() => {
                img.style.visibility = 'hidden';
            }, 500);
        });
    }
    
    showOriginalImages() {
        const images = document.querySelectorAll('.card-icon img');
        images.forEach((img, index) => {
            img.style.visibility = 'visible';
            img.style.opacity = '0';
            img.style.transform = 'scale(0.8)';
            setTimeout(() => {
                img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            }, index * 100);
        });
    }
    
    createScoreDisplay() {
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'snake-score-display';
        scoreDisplay.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 18px;
            z-index: 10000;
        `;
        scoreDisplay.innerHTML = `
            <div style="font-size: 20px; margin-bottom: 10px; color: #e0e7ff;">Score : <span style="color: #000000ff; font-weight: bold;">${this.score}</span></div>
            <div style="font-size: 16px; margin-bottom: 20px; color: #a5b4fc;">Best : <span style="color: #000000ff; font-weight: bold;">${this.highScore}</span></div>
        `;
        document.body.appendChild(scoreDisplay);
    }
    
    initSnake() {
        // Align snake to grid
        const gridCols = Math.floor(window.innerWidth / this.snakeSize);
        const gridRows = Math.floor((window.innerHeight - 80) / this.snakeSize);
        
        const startGridX = Math.floor(gridCols / 2);
        const startGridY = Math.floor(gridRows / 2) + 3;
        
        const startX = startGridX * this.snakeSize + this.snakeSize / 2;
        const startY = startGridY * this.snakeSize + this.snakeSize / 2;
        
        this.snake = [
            { x: startX, y: startY },
            { x: startX - this.snakeSize, y: startY },
            { x: startX - this.snakeSize * 2, y: startY }
        ];
        
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        this.drawSnake();
    }
    
        spawnFood() {
        // Calculate grid-aligned position
        const gridCols = Math.floor(window.innerWidth / this.snakeSize);
        const gridRows = Math.floor((window.innerHeight - 80) / this.snakeSize);
        
        const gridX = Math.floor(Math.random() * (gridCols - 2)) + 1;
        const gridY = Math.floor(Math.random() * (gridRows - 2)) + 3;
        
        const food = {
            x: gridX * this.snakeSize + this.snakeSize / 2,
            y: gridY * this.snakeSize + this.snakeSize / 2,
            image: this.foodImages[Math.floor(Math.random() * this.foodImages.length)]
        };
        
        this.foods[0] = food;
        
        // Remove old food if exists
        if (this.foodElements[0]) {
            this.foodElements[0].remove();
        }
        
        // Create DOM element for food
        const foodEl = document.createElement('div');
        foodEl.style.cssText = `
            position: fixed;
            left: ${food.x - this.snakeSize / 2}px;
            top: ${food.y - this.snakeSize / 2}px;
            width: ${this.snakeSize}px;
            height: ${this.snakeSize}px;
            z-index: 9997;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const imgWrapper = document.createElement('div');
        imgWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.5);
            animation: foodPulse 1.5s ease-in-out infinite, foodRotate 3s linear infinite;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const img = document.createElement('img');
        img.src = food.image;
        img.style.cssText = `
            width: calc(100% - 6px);
            height: calc(100% - 6px);
            border-radius: 50%;
            object-fit: cover;
            background: white;
        `;
        
        imgWrapper.appendChild(img);
        foodEl.appendChild(imgWrapper);
        
        // Animation d'apparition
        foodEl.style.opacity = '0';
        foodEl.style.transform = 'scale(0)';
        document.body.appendChild(foodEl);
        
        requestAnimationFrame(() => {
            foodEl.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            foodEl.style.opacity = '1';
            foodEl.style.transform = 'scale(1)';
        });
        
        this.foodElements[0] = foodEl;
    }
    
    drawSnake() {
    // Remove old snke elements
    this.snakeElements.forEach(el => el.remove());
    this.snakeElements = [];
    
    // Draw each segment as square blocks forming a solid body
    this.snake.forEach((segment, index) => {
        const segmentEl = document.createElement('div');
        segmentEl.className = 'snake-segment';
        
        const isHead = index === 0;
        const isTail = index === this.snake.length - 1;
        const alpha = 1 - (index / this.snake.length) * 0.2;
        
        // Same size for all segments to create perfect block alignment
        const size = this.snakeSize;
        
        // --- NOUVEAUX STYLES ET ANIMATIONS POUR LA TÊTE ---
        let headStyles = '';
        if (isHead) {
            headStyles = `
                transition: left ${this.gameSpeed / 1000}s linear, top ${this.gameSpeed / 1000}s linear, transform 0.1s ease;
                animation: headGlow 1.5s ease-in-out infinite;
            `;
        } else {
            // Segments du corps avec transition smooth
            headStyles = `
                transition: left ${this.gameSpeed / 1000}s linear, top ${this.gameSpeed / 1000}s linear;
            `;
        }

        segmentEl.style.cssText = `
            position: fixed;
            left: ${segment.x - size / 2}px;
            top: ${segment.y - size / 2}px;
            width: ${size}px;
            height: ${size}px;
            background: ${isHead ? '#fbbf24' : (index % 2 === 0 ? '#fbbf24' : '#000000')};
            border-radius: 0;
            z-index: ${9999 - index};
            box-shadow: ${isHead 
            ? '0 0 24px rgba(216, 228, 50, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.3), inset -3px -3px 6px rgba(0, 0, 0, 0.3)' 
            : `0 0 10px rgba(99, 102, 241, ${alpha * 0.5}), inset 2px 2px 4px rgba(255, 255, 255, ${alpha * 0.2}), inset -2px -2px 4px rgba(0, 0, 0, ${alpha * 0.2})`};
            pointer-events: none;
            /* Contour en jaune plus foncé que le corps */
            border: ${isHead ? '3px solid #b36a00' : '2px solid rgba(179,106,0,0.95)'};
            ${headStyles}
        `;
        // Add eyes and tongue to head (code inchangé)
        if (isHead) {
            // Calculate tongue position based on direction (Y-shaped)
            let tongueHTML = '';
            let eyesHTML = '';
            
            if (this.direction.x === 1) {
                // Right - eyes on the right side
                tongueHTML = `
                    <div style="position: absolute; right: -10px; top: 50%; transform: translateY(-50%); width: 10px; height: 2px; background: #ec4899; box-shadow: 0 0 3px #ec4899;"></div>
                    <div style="position: absolute; right: -15px; top: calc(50% - 4px); width: 6px; height: 2px; background: #ec4899; transform: rotate(-30deg); box-shadow: 0 0 2px #ec4899;"></div>
                    <div style="position: absolute; right: -15px; top: calc(50% + 2px); width: 6px; height: 2px; background: #ec4899; transform: rotate(30deg); box-shadow: 0 0 2px #ec4899;"></div>
                `;
                eyesHTML = `
                    <div style="position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; bottom: 8px; right: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; top: 10px; right: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                    <div style="position: absolute; bottom: 10px; right: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                `;
            } else if (this.direction.x === -1) {
                // Left - eyes on the left side
                tongueHTML = `
                    <div style="position: absolute; left: -10px; top: 50%; transform: translateY(-50%); width: 10px; height: 2px; background: #ec4899; box-shadow: 0 0 3px #ec4899;"></div>
                    <div style="position: absolute; left: -15px; top: calc(50% - 4px); width: 6px; height: 2px; background: #ec4899; transform: rotate(30deg); box-shadow: 0 0 2px #ec4899;"></div>
                    <div style="position: absolute; left: -15px; top: calc(50% + 2px); width: 6px; height: 2px; background: #ec4899; transform: rotate(-30deg); box-shadow: 0 0 2px #ec4899;"></div>
                `;
                eyesHTML = `
                    <div style="position: absolute; top: 8px; left: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; bottom: 8px; left: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; top: 10px; left: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                    <div style="position: absolute; bottom: 10px; left: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                `;
            } else if (this.direction.y === -1) {
                // Up - eyes on the top
                tongueHTML = `
                    <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 2px; height: 10px; background: #ec4899; box-shadow: 0 0 3px #ec4899;"></div>
                    <div style="position: absolute; top: -15px; left: calc(50% - 4px); width: 2px; height: 6px; background: #ec4899; transform: rotate(-30deg); box-shadow: 0 0 2px #ec4899;"></div>
                    <div style="position: absolute; top: -15px; left: calc(50% + 2px); width: 2px; height: 6px; background: #ec4899; transform: rotate(30deg); box-shadow: 0 0 2px #ec4899;"></div>
                `;
                eyesHTML = `
                    <div style="position: absolute; top: 8px; left: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; top: 10px; left: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                    <div style="position: absolute; top: 10px; right: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                `;
            } else if (this.direction.y === 1) {
                // Down - eyes on the bottom
                tongueHTML = `
                    <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 2px; height: 10px; background: #ec4899; box-shadow: 0 0 3px #ec4899;"></div>
                    <div style="position: absolute; bottom: -15px; left: calc(50% - 4px); width: 2px; height: 6px; background: #ec4899; transform: rotate(30deg); box-shadow: 0 0 2px #ec4899;"></div>
                    <div style="position: absolute; bottom: -15px; left: calc(50% + 2px); width: 2px; height: 6px; background: #ec4899; transform: rotate(-30deg); box-shadow: 0 0 2px #ec4899;"></div>
                `;
                eyesHTML = `
                    <div style="position: absolute; bottom: 8px; left: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; bottom: 8px; right: 8px; width: 8px; height: 8px; background: white; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                    <div style="position: absolute; bottom: 10px; left: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                    <div style="position: absolute; bottom: 10px; right: 10px; width: 4px; height: 4px; background: #0f172a; border-radius: 1px;"></div>
                `;
            }
            
            segmentEl.innerHTML = `
                ${eyesHTML}
                ${tongueHTML}
            `;
        }
        
        document.body.appendChild(segmentEl);
        this.snakeElements.push(segmentEl);
    });
}
    
    handleKeyPress(e) {
        if (!this.active) return;
        
        if (e.key === 'Escape') {
            this.deactivate();
            return;
        }
        
        const key = e.key;
        
        // Prevent default for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            e.preventDefault();
        }
        
        // Change direction with queue (prevent 180-degree turns)
        const lastDirection = this.directionQueue.length > 0 
            ? this.directionQueue[this.directionQueue.length - 1] 
            : this.direction;
        
        let newDirection = null;
        
        if (key === 'ArrowUp' && lastDirection.y === 0) {
            newDirection = { x: 0, y: -1 };
        } else if (key === 'ArrowDown' && lastDirection.y === 0) {
            newDirection = { x: 0, y: 1 };
        } else if (key === 'ArrowLeft' && lastDirection.x === 0) {
            newDirection = { x: -1, y: 0 };
        } else if (key === 'ArrowRight' && lastDirection.x === 0) {
            newDirection = { x: 1, y: 0 };
        }
        
        // Add to queue if valid and queue not full
        if (newDirection && this.directionQueue.length < 3) {
            this.directionQueue.push(newDirection);
        }
    }
    
    startGame() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, this.gameSpeed);
    }
    
    update() {
        // Update direction from queue
        if (this.directionQueue.length > 0) {
            this.direction = this.directionQueue.shift();
        }
    
    // Calculate new head position
    const head = { ...this.snake[0] };
    const speed = this.snakeSize;
    head.x += this.direction.x * speed;
    head.y += this.direction.y * speed;
    
    // Wrap around screen edges with grid alignment
    const gridCols = Math.floor(window.innerWidth / this.snakeSize);
    const gridRows = Math.floor((window.innerHeight - 80) / this.snakeSize);
    
    if (head.x < this.snakeSize / 2) {
        head.x = (gridCols - 1) * this.snakeSize + this.snakeSize / 2;
    }
    if (head.x > window.innerWidth - this.snakeSize / 2) {
        head.x = this.snakeSize / 2;
    }
    if (head.y < 80 + this.snakeSize / 2) {
        head.y = (window.innerHeight - this.snakeSize / 2);
    }
    if (head.y > window.innerHeight - this.snakeSize / 2) {
        head.y = 80 + this.snakeSize / 2;
    }
    
    // Check self collision
    const collision = this.snake.slice(1).some(segment => 
        Math.abs(segment.x - head.x) < this.snakeSize && 
        Math.abs(segment.y - head.y) < this.snakeSize
    );
    
    if (collision) {
        this.gameOver();
        return;
    }
    
    // Add new head
    this.snake.unshift(head);
    
    // Check food collision (only one food)
    let ateFood = false;
    if (this.foods[0]) {
        const food = this.foods[0];
        // Check if head and food are on same grid position
        const headGridX = Math.round(head.x / this.snakeSize);
        const headGridY = Math.round(head.y / this.snakeSize);
        const foodGridX = Math.round(food.x / this.snakeSize);
        const foodGridY = Math.round(food.y / this.snakeSize);
        
        if (headGridX === foodGridX && headGridY === foodGridY) {
            this.score += 1;
            this.updateScore();
            this.sounds.eat();
            ateFood = true;
            
            // Accélération du jeu à chaque fruit
            this.gameSpeed = Math.max(50, this.gameSpeed - 5);
            clearInterval(this.gameLoop);
            this.startGame();

            // 1. Déclenche l'animation de disparition CSS (plus robuste)
            if (this.foodElements[0]) {
                const foodEl = this.foodElements[0];
                
                requestAnimationFrame(() => {
                    foodEl.classList.add('is-eaten');
                    foodEl.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
                    foodEl.style.transform = 'scale(0) rotate(180deg)';
                });
                
                // 2. Spawn nouveau food APRES l'animation (0.3s)
                setTimeout(() => {
                     this.spawnFood(true); 
                }, 300); 
            }
        }
    }
    
    if (!ateFood) {
        // Remove tail if no food eaten
        this.snake.pop();
    }
    
    // Redraw snake
    this.drawSnake();

        // Eat animation: pulse head + particles
        if (ateFood) {
            const headEl = this.snakeElements[0];
            if (headEl) {
                headEl.classList.add('snake-eat');
                setTimeout(() => headEl.classList.remove('snake-eat'), 400);
            }

            // spawn particles at food position (use eaten food coords if available)
            const foodPos = (typeof food !== 'undefined' && food) ? { x: food.x, y: food.y } : { x: head.x, y: head.y };
            this.spawnEatParticles(foodPos.x, foodPos.y);
        }
    }
    
    updateScore() {
        const scoreValue = document.getElementById('snake-score-value');
        if (scoreValue) {
            scoreValue.textContent = this.score;
        }
    }
    

    gameOver() {
        clearInterval(this.gameLoop);
        this.sounds.gameOver();
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        // Show game over message
        const gameOverEl = document.createElement('div');
        gameOverEl.id = 'snake-game-over';
        gameOverEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 30px 50px;
            border-radius: 5px;
            font-size: 24px;
            z-index: 10000;
            text-align: center;
        `;
        gameOverEl.innerHTML = `
            <div style="margin-bottom: 15px; font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Game Over</div>
            <div style="font-size: 20px; margin-bottom: 10px; color: #e0e7ff;">Score: <span style="color: #8b5cf6; font-weight: bold;">${this.score}</span></div>
            <div style="font-size: 16px; margin-bottom: 20px; color: #a5b4fc;">Best: <span style="color: #8b5cf6; font-weight: bold;">${this.highScore}</span></div>
            <button id="snake-replay-btn" style="
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(139, 92, 246, 0.6)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(139, 92, 246, 0.4)';">Rejouer</button>
        `;
        
        document.body.appendChild(gameOverEl);
        
        // Replay button click handler
        document.getElementById('snake-replay-btn').addEventListener('click', () => {
            gameOverEl.remove();
            this.deactivate();
            this.activate();
        });
    }    showInstructions() {
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 3px;
            font-size: 14px;
            z-index: 10000;
        `;
        instructions.textContent = 'Flèches: déplacer | ESC: quitter';
        
        document.body.appendChild(instructions);
        
        setTimeout(() => {
            instructions.remove();
        }, 3000);
    }
    
    deactivate() {
        this.active = false;
        clearInterval(this.gameLoop);
        
        // Remove all elements
        this.snakeElements.forEach(el => el.remove());
        this.foodElements.forEach(el => el.remove());
        
        const scoreDisplay = document.getElementById('snake-score-display');
        if (scoreDisplay) scoreDisplay.remove();
        
        const gameOverEl = document.getElementById('snake-game-over');
        if (gameOverEl) gameOverEl.remove();
        
        // Show original images back
        this.showOriginalImages();
        
        this.snakeElements = [];
        this.foodElements = [];
        this.foods = [];
        this.snake = [];
        
        document.removeEventListener('keydown', this.keyHandler);
    }

}

// Initialize snake game
const snakeGame = new SnakeGame();
console.log('Type "snake" to play');
