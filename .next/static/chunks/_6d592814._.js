(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/game/InputManager.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "InputManager": (()=>InputManager)
});
class InputManager {
    keys = new Set();
    inputState = {
        player1: {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false
        },
        player2: {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false
        }
    };
    constructor(){
        this.setupEventListeners();
    }
    setupEventListeners() {
        window.addEventListener('keydown', (e)=>{
            this.keys.add(e.code);
            e.preventDefault();
        });
        window.addEventListener('keyup', (e)=>{
            this.keys.delete(e.code);
            e.preventDefault();
        });
    }
    updateInputState() {
        // Player 1 controls (WASD + Space)
        this.inputState.player1.up = this.keys.has('KeyW');
        this.inputState.player1.down = this.keys.has('KeyS');
        this.inputState.player1.left = this.keys.has('KeyA');
        this.inputState.player1.right = this.keys.has('KeyD');
        this.inputState.player1.shoot = this.keys.has('Space');
        // Player 2 controls (Arrow keys + Enter)
        this.inputState.player2.up = this.keys.has('ArrowUp');
        this.inputState.player2.down = this.keys.has('ArrowDown');
        this.inputState.player2.left = this.keys.has('ArrowLeft');
        this.inputState.player2.right = this.keys.has('ArrowRight');
        this.inputState.player2.shoot = this.keys.has('Enter');
        return this.inputState;
    }
    destroy() {
        window.removeEventListener('keydown', ()=>{});
        window.removeEventListener('keyup', ()=>{});
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/game/Renderer.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Renderer": (()=>Renderer)
});
class Renderer {
    canvas;
    ctx;
    width;
    height;
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }
    clear() {
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.width, this.height);
        // Draw starfield background
        this.drawStarfield();
    }
    drawStarfield() {
        const time = Date.now() * 0.001;
        this.ctx.fillStyle = '#ffffff';
        for(let i = 0; i < 100; i++){
            const x = (i * 73 + time * 20) % this.width;
            const y = (i * 37 + time * 10) % this.height;
            const size = i % 3 + 1;
            this.ctx.globalAlpha = 0.3 + i % 5 * 0.1;
            this.ctx.fillRect(x, y, size, size);
        }
        this.ctx.globalAlpha = 1;
    }
    drawPlayer(player, playerNum) {
        this.ctx.save();
        this.ctx.translate(player.position.x, player.position.y);
        this.ctx.rotate(player.rotation);
        // Ship body - facing upward
        this.ctx.fillStyle = playerNum === 1 ? '#00ffff' : '#ff00ff';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -20); // Top point (nose)
        this.ctx.lineTo(-12, 15); // Bottom left
        this.ctx.lineTo(0, 10); // Bottom center
        this.ctx.lineTo(12, 15); // Bottom right
        this.ctx.closePath();
        this.ctx.fill();
        // Engine glow - at the bottom
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = 0.8;
        this.ctx.beginPath();
        this.ctx.arc(0, 10, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        // Health bar
        this.drawHealthBar(player);
    }
    drawHealthBar(player) {
        const barWidth = 40;
        const barHeight = 4;
        const x = player.position.x - barWidth / 2;
        const y = player.position.y - 30;
        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        // Health
        const healthPercent = player.health / player.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }
    drawBullet(bullet) {
        this.ctx.fillStyle = bullet.owner === 'player1' ? '#00ffff' : bullet.owner === 'player2' ? '#ff00ff' : '#ff4444';
        this.ctx.fillRect(bullet.position.x - bullet.width / 2, bullet.position.y - bullet.height / 2, bullet.width, bullet.height);
    }
    drawEnemy(enemy) {
        this.ctx.save();
        this.ctx.translate(enemy.position.x, enemy.position.y);
        this.ctx.rotate(enemy.rotation);
        // Enemy body
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.moveTo(-15, 0);
        this.ctx.lineTo(15, -10);
        this.ctx.lineTo(10, 0);
        this.ctx.lineTo(15, 10);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        // Health bar for enemies
        if (enemy.health < enemy.maxHealth) {
            const barWidth = 30;
            const barHeight = 3;
            const x = enemy.position.x - barWidth / 2;
            const y = enemy.position.y - 20;
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(x, y, barWidth, barHeight);
            const healthPercent = enemy.health / enemy.maxHealth;
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        }
    }
    drawParticle(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.life / particle.maxLife;
        this.ctx.beginPath();
        this.ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    drawPowerUp(powerUp) {
        this.ctx.save();
        this.ctx.translate(powerUp.position.x, powerUp.position.y);
        // Pulsing effect
        const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        this.ctx.globalAlpha = pulse;
        // Power-up shape
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        for(let i = 0; i < 5; i++){
            const angle = i * Math.PI * 2 / 5;
            const x = Math.cos(angle) * 15;
            const y = Math.sin(angle) * 15;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    drawHUD(gameState) {
        // Player 1 info
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '20px monospace';
        this.ctx.fillText(`Player 1: ${gameState.players[0].score}`, 20, 30);
        this.ctx.fillText(`Lives: ${Math.max(0, Math.ceil(gameState.players[0].health / 3))}`, 20, 55);
        // Player 2 info
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillText(`Player 2: ${gameState.players[1].score}`, this.width - 200, 30);
        this.ctx.fillText(`Lives: ${Math.max(0, Math.ceil(gameState.players[1].health / 3))}`, this.width - 200, 55);
        // Wave info
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`Wave: ${gameState.wave}`, this.width / 2 - 40, 30);
    }
    drawMenu() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPACE SHOOTER', this.width / 2, this.height / 2 - 100);
        this.ctx.font = '24px monospace';
        this.ctx.fillText('2-Player Local Multiplayer', this.width / 2, this.height / 2 - 50);
        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillText('Player 1: A/D + Space', this.width / 2, this.height / 2);
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillText('Player 2: Left/Right + Enter', this.width / 2, this.height / 2 + 25);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Press Space to Start', this.width / 2, this.height / 2 + 80);
        this.ctx.textAlign = 'left';
    }
    drawGameOver(winner) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 50);
        this.ctx.font = '24px monospace';
        this.ctx.fillText(winner, this.width / 2, this.height / 2);
        this.ctx.fillText('Press Space to Restart', this.width / 2, this.height / 2 + 50);
        this.ctx.textAlign = 'left';
    }
    drawPause() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        this.ctx.font = '24px monospace';
        this.ctx.fillText('Press P to Resume', this.width / 2, this.height / 2 + 50);
        this.ctx.textAlign = 'left';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/game/Collision.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Collision": (()=>Collision)
});
class Collision {
    static checkCollision(obj1, obj2) {
        const dx = obj1.position.x - obj2.position.x;
        const dy = obj1.position.y - obj2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (obj1.width + obj2.width) / 2;
        return distance < minDistance;
    }
    static checkRectCollision(obj1, obj2) {
        return obj1.position.x - obj1.width / 2 < obj2.position.x + obj2.width / 2 && obj1.position.x + obj1.width / 2 > obj2.position.x - obj2.width / 2 && obj1.position.y - obj1.height / 2 < obj2.position.y + obj2.height / 2 && obj1.position.y + obj1.height / 2 > obj2.position.y - obj2.height / 2;
    }
    static isOutOfBounds(obj, width, height) {
        return obj.position.x < -obj.width || obj.position.x > width + obj.width || obj.position.y < -obj.height || obj.position.y > height + obj.height;
    }
    static clampToBounds(obj, width, height) {
        obj.position.x = Math.max(obj.width / 2, Math.min(width - obj.width / 2, obj.position.x));
        obj.position.y = Math.max(obj.height / 2, Math.min(height - obj.height / 2, obj.position.y));
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/game/Game.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Game": (()=>Game)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$InputManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/game/InputManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Renderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/game/Renderer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Collision$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/game/Collision.ts [app-client] (ecmascript)");
;
;
;
class Game {
    canvas;
    ctx;
    inputManager;
    renderer;
    gameState;
    lastTime = 0;
    animationId = null;
    isRunning = false;
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.inputManager = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$InputManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputManager"]();
        this.renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Renderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Renderer"](canvas);
        this.gameState = this.initializeGameState();
    }
    initializeGameState() {
        return {
            players: [
                {
                    position: {
                        x: 200,
                        y: 550
                    },
                    velocity: {
                        x: 0,
                        y: 0
                    },
                    width: 40,
                    height: 40,
                    rotation: 0,
                    health: 3,
                    maxHealth: 3,
                    score: 0,
                    lastShot: 0,
                    powerUp: null,
                    powerUpEndTime: 0
                },
                {
                    position: {
                        x: 600,
                        y: 550
                    },
                    velocity: {
                        x: 0,
                        y: 0
                    },
                    width: 40,
                    height: 40,
                    rotation: 0,
                    health: 3,
                    maxHealth: 3,
                    score: 0,
                    lastShot: 0,
                    powerUp: null,
                    powerUpEndTime: 0
                }
            ],
            bullets: [],
            enemies: [],
            particles: [],
            powerUps: [],
            gameStatus: 'menu',
            wave: 1,
            lastEnemySpawn: 0
        };
    }
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.gameState.gameStatus = 'playing';
        this.lastTime = performance.now();
        this.gameLoop();
    }
    pause() {
        this.gameState.gameStatus = 'paused';
    }
    resume() {
        this.gameState.gameStatus = 'playing';
    }
    restart() {
        this.gameState = this.initializeGameState();
        this.start();
    }
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    gameLoop = ()=>{
        if (!this.isRunning) return;
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        if (this.gameState.gameStatus === 'playing') {
            this.update(deltaTime);
        }
        this.render();
        this.animationId = requestAnimationFrame(this.gameLoop);
    };
    update(deltaTime) {
        const inputState = this.inputManager.updateInputState();
        this.updatePlayers(inputState, deltaTime);
        this.updateBullets(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateParticles(deltaTime);
        this.updatePowerUps(deltaTime);
        this.spawnEnemies(deltaTime);
        this.checkCollisions();
        this.cleanupObjects();
    }
    updatePlayers(inputState, deltaTime) {
        const speed = 300 * deltaTime;
        // Player 1 - Only horizontal movement
        const player1 = this.gameState.players[0];
        player1.velocity = {
            x: 0,
            y: 0
        };
        // Only allow left and right movement
        if (inputState.player1.left) player1.velocity.x = -speed;
        if (inputState.player1.right) player1.velocity.x = speed;
        player1.position.x += player1.velocity.x;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Collision$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collision"].clampToBounds(player1, this.canvas.width, this.canvas.height);
        // Player 2 - Only horizontal movement
        const player2 = this.gameState.players[1];
        player2.velocity = {
            x: 0,
            y: 0
        };
        // Only allow left and right movement
        if (inputState.player2.left) player2.velocity.x = -speed;
        if (inputState.player2.right) player2.velocity.x = speed;
        player2.position.x += player2.velocity.x;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Collision$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collision"].clampToBounds(player2, this.canvas.width, this.canvas.height);
        // Shooting
        this.handleShooting(inputState);
    }
    handleShooting(inputState) {
        const now = performance.now();
        const shootCooldown = 200; // 200ms between shots
        // Player 1 shooting - bullets shoot upward
        if (inputState.player1.shoot && now - this.gameState.players[0].lastShot > shootCooldown) {
            this.gameState.bullets.push({
                position: {
                    x: this.gameState.players[0].position.x,
                    y: this.gameState.players[0].position.y - 20
                },
                velocity: {
                    x: 0,
                    y: -500
                },
                width: 8,
                height: 16,
                rotation: 0,
                damage: 1,
                owner: 'player1'
            });
            this.gameState.players[0].lastShot = now;
        }
        // Player 2 shooting - bullets shoot upward
        if (inputState.player2.shoot && now - this.gameState.players[1].lastShot > shootCooldown) {
            this.gameState.bullets.push({
                position: {
                    x: this.gameState.players[1].position.x,
                    y: this.gameState.players[1].position.y - 20
                },
                velocity: {
                    x: 0,
                    y: -500
                },
                width: 8,
                height: 16,
                rotation: 0,
                damage: 1,
                owner: 'player2'
            });
            this.gameState.players[1].lastShot = now;
        }
    }
    updateBullets(deltaTime) {
        this.gameState.bullets.forEach((bullet)=>{
            bullet.position.x += bullet.velocity.x * deltaTime;
            bullet.position.y += bullet.velocity.y * deltaTime;
        });
    }
    updateEnemies(deltaTime) {
        this.gameState.enemies.forEach((enemy)=>{
            enemy.position.x += enemy.velocity.x * deltaTime;
            enemy.position.y += enemy.velocity.y * deltaTime;
            // Simple enemy AI - move towards players
            const targetPlayer = this.gameState.players[Math.floor(Math.random() * 2)];
            const dx = targetPlayer.position.x - enemy.position.x;
            const dy = targetPlayer.position.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                enemy.velocity.x = dx / distance * 100;
                enemy.velocity.y = dy / distance * 50;
            }
        });
    }
    updateParticles(deltaTime) {
        this.gameState.particles.forEach((particle)=>{
            particle.position.x += particle.velocity.x * deltaTime;
            particle.position.y += particle.velocity.y * deltaTime;
            particle.life -= deltaTime;
        });
    }
    updatePowerUps(deltaTime) {
        this.gameState.powerUps.forEach((powerUp)=>{
            powerUp.position.y += 50 * deltaTime;
        });
    }
    spawnEnemies(deltaTime) {
        const spawnInterval = Math.max(1000 - this.gameState.wave * 100, 200);
        if (Date.now() - this.gameState.lastEnemySpawn > spawnInterval) {
            const enemyTypes = [
                'basic',
                'fast',
                'heavy'
            ];
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            this.gameState.enemies.push({
                position: {
                    x: Math.random() * this.canvas.width,
                    y: -30
                },
                velocity: {
                    x: 0,
                    y: 50
                },
                width: type === 'heavy' ? 50 : type === 'fast' ? 30 : 40,
                height: type === 'heavy' ? 50 : type === 'fast' ? 30 : 40,
                rotation: 0,
                health: type === 'heavy' ? 3 : type === 'fast' ? 1 : 2,
                maxHealth: type === 'heavy' ? 3 : type === 'fast' ? 1 : 2,
                type,
                lastShot: 0
            });
            this.gameState.lastEnemySpawn = Date.now();
        }
    }
    checkCollisions() {
        // Bullet vs Enemy collisions
        this.gameState.bullets.forEach((bullet, bulletIndex)=>{
            this.gameState.enemies.forEach((enemy, enemyIndex)=>{
                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Collision$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collision"].checkCollision(bullet, enemy)) {
                    enemy.health -= bullet.damage;
                    this.gameState.bullets.splice(bulletIndex, 1);
                    if (enemy.health <= 0) {
                        this.gameState.enemies.splice(enemyIndex, 1);
                        const playerIndex = bullet.owner === 'player1' ? 0 : 1;
                        this.gameState.players[playerIndex].score += 100;
                        // Create explosion particles
                        this.createExplosion(enemy.position.x, enemy.position.y);
                    }
                }
            });
        });
        // Enemy vs Player collisions
        this.gameState.enemies.forEach((enemy, enemyIndex)=>{
            this.gameState.players.forEach((player, playerIndex)=>{
                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Collision$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collision"].checkCollision(enemy, player)) {
                    player.health -= 1;
                    this.gameState.enemies.splice(enemyIndex, 1);
                    if (player.health <= 0) {
                        this.gameState.gameStatus = 'gameOver';
                    }
                }
            });
        });
    }
    createExplosion(x, y) {
        for(let i = 0; i < 8; i++){
            const angle = i / 8 * Math.PI * 2;
            this.gameState.particles.push({
                position: {
                    x,
                    y
                },
                velocity: {
                    x: Math.cos(angle) * 200,
                    y: Math.sin(angle) * 200
                },
                width: 4,
                height: 4,
                rotation: 0,
                life: 0.5,
                maxLife: 0.5,
                color: '#ff6600',
                size: 4
            });
        }
    }
    cleanupObjects() {
        // Remove off-screen bullets
        this.gameState.bullets = this.gameState.bullets.filter((bullet)=>!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Collision$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collision"].isOutOfBounds(bullet, this.canvas.width, this.canvas.height));
        // Remove off-screen enemies
        this.gameState.enemies = this.gameState.enemies.filter((enemy)=>!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Collision$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collision"].isOutOfBounds(enemy, this.canvas.width, this.canvas.height));
        // Remove dead particles
        this.gameState.particles = this.gameState.particles.filter((particle)=>particle.life > 0);
        // Remove off-screen power-ups
        this.gameState.powerUps = this.gameState.powerUps.filter((powerUp)=>powerUp.position.y < this.canvas.height + 50);
    }
    render() {
        this.renderer.clear();
        switch(this.gameState.gameStatus){
            case 'menu':
                this.renderer.drawMenu();
                break;
            case 'playing':
                this.renderer.drawHUD(this.gameState);
                // Draw game objects
                this.gameState.players.forEach((player, index)=>this.renderer.drawPlayer(player, index + 1));
                this.gameState.bullets.forEach((bullet)=>this.renderer.drawBullet(bullet));
                this.gameState.enemies.forEach((enemy)=>this.renderer.drawEnemy(enemy));
                this.gameState.particles.forEach((particle)=>this.renderer.drawParticle(particle));
                this.gameState.powerUps.forEach((powerUp)=>this.renderer.drawPowerUp(powerUp));
                break;
            case 'paused':
                this.renderer.drawPause();
                break;
            case 'gameOver':
                const winner = this.gameState.players[0].score > this.gameState.players[1].score ? 'Player 1 Wins!' : this.gameState.players[1].score > this.gameState.players[0].score ? 'Player 2 Wins!' : 'Tie Game!';
                this.renderer.drawGameOver(winner);
                break;
        }
    }
    destroy() {
        this.stop();
        this.inputManager.destroy();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/space-shooter/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SpaceShooterPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Game$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/game/Game.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function SpaceShooterPage() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpaceShooterPage.useEffect": ()=>{
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                canvas.width = 800;
                canvas.height = 600;
                gameRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$game$2f$Game$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Game"](canvas);
                gameRef.current.start();
            }
            return ({
                "SpaceShooterPage.useEffect": ()=>{
                    if (gameRef.current) {
                        gameRef.current.destroy();
                    }
                }
            })["SpaceShooterPage.useEffect"];
        }
    }["SpaceShooterPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-black flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                    ref: canvasRef,
                    className: "border border-cyan-500 shadow-lg shadow-cyan-500/50",
                    style: {
                        width: '800px',
                        height: '600px',
                        imageRendering: 'pixelated'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/space-shooter/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-4 left-4 text-cyan-400 font-mono text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: "Player 1: A/D + Space"
                        }, void 0, false, {
                            fileName: "[project]/src/app/space-shooter/page.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: "Player 2: Left/Right + Enter"
                        }, void 0, false, {
                            fileName: "[project]/src/app/space-shooter/page.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/space-shooter/page.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/space-shooter/page.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/space-shooter/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(SpaceShooterPage, "jJoUyyvBohws/bcJzViGozVbz0k=");
_c = SpaceShooterPage;
var _c;
__turbopack_context__.k.register(_c, "SpaceShooterPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, self, source, getOwner(), maybeKey, debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    Symbol.for("react.provider");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        "react-stack-bottom-frame": function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React["react-stack-bottom-frame"].bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren, source, self) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}}),
}]);

//# sourceMappingURL=_6d592814._.js.map