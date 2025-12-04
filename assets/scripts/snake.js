// Snake Game - Activated by typing "snake"
class SnakeGame {
    constructor() {
        this.active = false;
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.foods = [];
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.gameSpeed = 100;
        this.gameLoop = null;
        this.snakeSize = 40;
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
        // Hide challenge card images but keep their space
        const images = document.querySelectorAll('.card-icon img');
        images.forEach(img => {
            img.dataset.originalDisplay = img.style.display || '';
            img.style.visibility = 'hidden';
        });
    }
    
    showOriginalImages() {
        const images = document.querySelectorAll('.card-icon img');
        images.forEach(img => {
            img.style.visibility = 'visible';
        });
    }
    
    createScoreDisplay() {
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'snake-score-display';
        scoreDisplay.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 15px 30px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            z-index: 9998;
            box-shadow: 0 5px 20px rgba(99, 102, 241, 0.5);
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        `;
        scoreDisplay.innerHTML = `
            <div>🐍 Score: <span id="snake-score-value">0</span></div>
            <div style="font-size: 16px; margin-top: 8px; opacity: 0.9;">🏆 Best: ${this.highScore}</div>
        `;
        document.body.appendChild(scoreDisplay);
    }
    
    initSnake() {
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        
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
        const gridY = Math.floor(Math.random() * (gridRows - 2)) + 3; // Start below navbar
        
        const food = {
            x: gridX * this.snakeSize,
            y: gridY * this.snakeSize,
            image: this.foodImages[Math.floor(Math.random() * this.foodImages.length)]
        };
        
        this.foods[0] = food;
        
        // Remove old food if exists
        if (this.foodElements[0]) {
            this.foodElements[0].remove();
        }
        
        // Create DOM element for food (same size as snake)
        const foodEl = document.createElement('img');
        foodEl.src = food.image;
        foodEl.className = 'snake-food';
        foodEl.style.cssText = `
            position: fixed;
            left: ${food.x - this.snakeSize / 2}px;
            top: ${food.y - this.snakeSize / 2}px;
            width: ${this.snakeSize}px;
            height: ${this.snakeSize}px;
            border-radius: 50%;
            z-index: 9997;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 15px rgba(255, 215, 0, 0.2);
            animation: foodGlow 2s ease-in-out infinite;
            pointer-events: none;
            border: 2px solid rgba(255, 215, 0, 0.7);
        `;
        
        document.body.appendChild(foodEl);
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
            
            segmentEl.style.cssText = `
                position: fixed;
                left: ${segment.x - size / 2}px;
                top: ${segment.y - size / 2}px;
                width: ${size}px;
                height: ${size}px;
                background: #8b5cf6;
                border-radius: 0;
                z-index: ${9999 - index};
                box-shadow: ${isHead 
                    ? '0 0 20px rgba(99, 102, 241, 0.8), inset 3px 3px 6px rgba(255, 255, 255, 0.3), inset -3px -3px 6px rgba(0, 0, 0, 0.3)' 
                    : `0 0 10px rgba(99, 102, 241, ${alpha * 0.5}), inset 2px 2px 4px rgba(255, 255, 255, ${alpha * 0.2}), inset -2px -2px 4px rgba(0, 0, 0, ${alpha * 0.2})`};
                pointer-events: none;
                border: 2px solid rgba(139, 92, 246, ${isHead ? 0.9 : alpha * 0.7});
            `;
            
            // Add eyes and tongue to head
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
        
        // Change direction (prevent 180-degree turns)
        if (key === 'ArrowUp' && this.direction.y === 0) {
            this.nextDirection = { x: 0, y: -1 };
        } else if (key === 'ArrowDown' && this.direction.y === 0) {
            this.nextDirection = { x: 0, y: 1 };
        } else if (key === 'ArrowLeft' && this.direction.x === 0) {
            this.nextDirection = { x: -1, y: 0 };
        } else if (key === 'ArrowRight' && this.direction.x === 0) {
            this.nextDirection = { x: 1, y: 0 };
        }
    }
    
    startGame() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, this.gameSpeed);
    }
    
    update() {
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Calculate new head position
        const head = { ...this.snake[0] };
        const speed = this.snakeSize;
        head.x += this.direction.x * speed;
        head.y += this.direction.y * speed;
        
        // Wrap around screen edges
        if (head.x < 0) head.x = window.innerWidth;
        if (head.x > window.innerWidth) head.x = 0;
        if (head.y < 80) head.y = window.innerHeight;
        if (head.y > window.innerHeight) head.y = 80;
        
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
            const distance = Math.sqrt(
                Math.pow(head.x - food.x, 2) + 
                Math.pow(head.y - food.y, 2)
            );
            
            if (distance < this.snakeSize / 2) {
                this.score += 1;
                this.updateScore();
                this.sounds.eat();
                
                // Spawn new food
                this.spawnFood();
                ateFood = true;
            }
        }
        
        if (!ateFood) {
            // Remove tail if no food eaten
            this.snake.pop();
        }
        
        // Redraw snake
        this.drawSnake();
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
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 40px 60px;
            border-radius: 20px;
            font-size: 32px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(99, 102, 241, 0.6);
            text-align: center;
        `;
        gameOverEl.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">Game Over!</div>
            <div style="font-size: 28px; margin-bottom: 15px;">Score: ${this.score}</div>
            <div style="font-size: 20px; margin-bottom: 25px; opacity: 0.9;">🏆 Best: ${this.highScore}</div>
            <button id="snake-replay-btn" style="
                background: white;
                color: #6366f1;
                border: none;
                padding: 12px 30px;
                border-radius: 10px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            ">🔄 Rejouer</button>
        `;
        
        document.body.appendChild(gameOverEl);
        
        // Add hover effect to button
        const replayBtn = document.getElementById('snake-replay-btn');
        replayBtn.addEventListener('mouseenter', () => {
            replayBtn.style.transform = 'scale(1.05)';
            replayBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
        });
        replayBtn.addEventListener('mouseleave', () => {
            replayBtn.style.transform = 'scale(1)';
            replayBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
        
        // Replay button click handler
        replayBtn.addEventListener('click', () => {
            gameOverEl.remove();
            this.deactivate();
            this.activate();
        });
    }
    
    showInstructions() {
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(99, 102, 241, 0.95);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 5px 20px rgba(99, 102, 241, 0.5);
            animation: fadeOut 3s forwards;
        `;
        instructions.textContent = '🎮 Utilisez les flèches pour diriger le serpent! Appuyez sur ESC pour quitter.';
        
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
console.log('🐍 Snake game ready! Type "snake" to play!');
