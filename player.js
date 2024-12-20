import {Stand} from './states.js';


export class Player {

    constructor(game) {
        this.game = game;
        this.spriteWidth = 575;
        this.spriteHeight = 523;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.2 * this.game.canvas.height;
        this.width = this.height / this.aspectRatio;
        this.x = 15;
        this.y = this.groundLevel();
        this.velY = 0;
        this.gravity = 0.02;
        this.maxEnergy = 200;
        this.currEnergy = this.maxEnergy;
        this.interval = 2 * this.game.deltaTime;
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 0;
        this.state = new Stand(this);
        this.isJumping = false;
        this.isFalling = false;
        this.isRolling = false;
        this.jumpDist = 0.5 * window.innerHeight;
        this.boundX = this.x + 0.25 * this.width;
        this.boundY = this.y + 0.25 * this.height;
        this.boundWidth = 0.6 * this.width;
        this.boundHeight = 0.75 * this.height;
        this.img = document.getElementById('player');
    }

    draw() {
        if (this.game.input.debug) this.game.ctx.strokeRect(this.boundX, this.boundY, this.boundWidth, this.boundHeight);
        this.game.ctx.drawImage(
            this.img,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update(deltaTime) {
        if (this.timer >= this.interval) {
            this.timer = 0;
            this.frameX === this.maxFrames ? this.frameX = 0 : this.frameX++;
        } else this.timer += deltaTime;
        this.state.manageStates();
        this.y += this.velY * deltaTime;
        if (this.isRolling) {
            this.boundX = this.x + 0.25 * this.width;
            this.boundY = this.y + 0.42 * this.height;
            this.boundWidth = this.width / 2;
            this.boundHeight = this.height / 2;
        }
        else {
            this.boundX = this.x + 0.25 * this.width;
            this.boundY = this.y + 0.25 * this.height;
            this.boundWidth = 0.6 * this.width;
            this.boundHeight = 0.75 * this.height;
        }
        if (this.isJumping) this.handleJump();
        if (this.isFalling) this.handleFall();
    }

    handleJump() {
        if (this.y > this.groundLevel() - this.jumpDist)
            this.velY -= this.gravity;
        else {
            this.velY = 0;
            this.isJumping = false;
            this.isFalling = true;
        }
    }

    handleFall() {
        if (this.y <= this.groundLevel()) {
            this.velY += this.gravity;
        }
        else {
            this.velY = 0;
            this.y = this.groundLevel();
            this.isFalling = false;
        }
    }

    onGround() {
        return this.y === this.groundLevel();
    }

    groundLevel() {
        if (this.game.currentBG === this.game.forestBG)
            return this.game.canvas.height - this.height - this.game.canvas.height * 0.05;
        else
            return this.game.canvas.height - this.height - this.game.canvas.height * 0.160;
    }
}
