// Import necessary modules
import { Player } from "./player.js";
import { Input } from "./input.js";
import { Layer } from "./background.js";
import { Bat, Ghost, Worm, Spinner, Bat2, Raven, Zombie, Spider, Spider2 } from "./enemies.js";
import { UI } from "./UI.js";
import { Explosion, Energy } from "./particles.js";

class Game {
    constructor(canvas, context, bgImages) {
        this.gameRunning = false;
        this.canvas = canvas;
        this.ctx = context;
        this.ctx.font = '30px Creepster';
        this.forestBG = bgImages.forest;
        this.cityBG = bgImages.city;
        this.currentBG = this.cityBG;
        this.gameSpeed = 0;
        this.score = 0;
        this.player = new Player(this);
        this.input = new Input();
        this.UI = new UI(this);
        this.enemyTypes = ['worm', 'raven', 'bat', 'ghost', 'bat2', 'spider', 'zombie', 'spider2', 'spinner'];
        this.enemyProbs = [0.5, 0.4, 0.08, 0.02, 0, 0, 0, 0, 0];
        this.enemies = [];
        this.collisions = [];
        this.energies = [];
        this.energyTimer = 0;
        this.energyInterval = 1000;
        this.enemyTimer = 0;
        this.enemyInterval = 5000;

        // **Precompute player collision mask**
        this.tempCanvas = document.createElement('canvas');
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.tempCanvas.width = this.player.width;
        this.tempCanvas.height = this.player.height;
        this.player.mask = generateCollisionMask(this.player.image, this.tempCtx, this.player.width, this.player.height);
    }

    render(deltaTime) {
        // Draw background layers
        this.currentBG.forEach(bgImg => {
            bgImg.draw(this.ctx);
            bgImg.update(this.gameSpeed);
        });

        // Handle enemies
        this.#handleEnemies(deltaTime);

        // Handle player energy
        this.#handlePlayerEnergy(deltaTime);

        // Draw collisions
        this.collisions.forEach(collision => {
            collision.draw(this.ctx);
            collision.update(deltaTime);
        });
        this.collisions = this.collisions.filter(collision => !collision.flagToRemove);

        // Draw player
        this.player.draw();
        this.player.update(deltaTime);

        // Draw UI
        this.UI.drawScore();
        this.UI.drawEnergy();
    }

    #handleEnemies(deltaTime) {
        if (this.gameRunning) {
            if (this.enemyTimer > this.enemyInterval) {
                this.enemyTimer = 0;
                this.#selectEnemy();
                this.enemyInterval = Math.random() * 3000 + 3000;
            } else this.enemyTimer += deltaTime;
        }

        this.enemies.forEach(enemy => {
            // **Precompute enemy collision mask if not already computed**
            if (!enemy.mask) {
                this.tempCanvas.width = enemy.width;
                this.tempCanvas.height = enemy.height;
                enemy.mask = generateCollisionMask(enemy.image, this.tempCtx, enemy.width, enemy.height);
            }

            enemy.draw();
            enemy.update(deltaTime);

            if (detectCollision(this.player, enemy)) {
                enemy.flagToRemove = true;
                this.collisions.push(new Explosion(enemy));
            }
        });

        this.enemies = this.enemies.filter(enemy => !enemy.flagToRemove);
    }

    #selectEnemy() {
        const random = Math.random();
        let cumProb = 0;
        for (let i = 0; i < this.enemyProbs.length; i++) {
            cumProb += this.enemyProbs[i];
            if (random <= cumProb) {
                this.#pushEnemy(this.enemyTypes[i]);
                return;
            }
        }
    }

    #pushEnemy(type) {
        switch (type) {
            case 'worm':
                this.enemies.push(new Worm(this));
                break;
            case 'raven':
                this.enemies.push(new Raven(this));
                break;
            case 'bat':
                this.enemies.push(new Bat(this));
                break;
            case 'ghost':
                this.enemies.push(new Ghost(this));
                break;
            case 'bat2':
                this.enemies.push(new Bat2(this));
                break;
            case 'spider':
                this.enemies.push(new Spider(this));
                break;
            case 'zombie':
                this.enemies.push(new Zombie(this));
                break;
            case 'spider2':
                this.enemies.push(new Spider2(this));
                break;
            case 'spinner':
                this.enemies.push(new Spinner(this));
                break;
        }
    }

    #handlePlayerEnergy(deltaTime) {
        if (this.gameRunning) {
            if (this.energyTimer > this.enemyInterval) {
                this.energyTimer = 0;
                this.energies.push(new Energy(this));
            } else this.energyTimer += deltaTime;

            this.energies.forEach(energy => {
                energy.draw();
                energy.update(deltaTime);
            });

            this.energies = this.energies.filter(energy => !energy.flagToRemove);
        }
    }
}

// **Helper Function to Generate Collision Mask**
function generateCollisionMask(image, ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const mask = new Uint8Array(width * height);

    for (let i = 0; i < imageData.length; i += 4) {
        const alpha = imageData[i + 3]; // Alpha channel
        mask[i / 4] = alpha > 0 ? 1 : 0; // Solid pixels
    }

    return mask;
}

// **Optimized Collision Detection**
function detectCollision(player, enemy) {
    // Bounding box check first
    if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {

        // Calculate overlap area
        const overlapX = Math.max(player.x, enemy.x);
        const overlapY = Math.max(player.y, enemy.y);
        const overlapWidth = Math.min(player.x + player.width, enemy.x + enemy.width) - overlapX;
        const overlapHeight = Math.min(player.y + player.height, enemy.y + enemy.height) - overlapY;

        // Mask-based collision detection
        return maskCollision(player.mask, enemy.mask, player.x, player.y, enemy.x, enemy.y, overlapWidth, overlapHeight);
    }

    return false;
}

function maskCollision(mask1, mask2, x1, y1, x2, y2, width, height) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const mask1Index = (y + (y1 - x1)) * width + (x + (x1 - x2));
            const mask2Index = y * width + x;

            if (mask1[mask1Index] === 1 && mask2[mask2Index] === 1) {
                return true; // Collision detected
            }
        }
    }
    return false;
}
