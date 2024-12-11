import {Stand} from './states.js';


export class Player {

    constructor(game) {
        this.game = game;
        this.spriteWidth = 575;
        this.spriteHeight = 523;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.width = 150;
        this.height = this.width * this.aspectRatio;
        this.x = 15;
        this.y = this.groundLevel();
        this.velY = 0;
        this.gravity = 0.5;
        this.maxEnergy = 200;
        this.currEnergy = this.maxEnergy;
        this.interval = 20;
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 0;
        this.state = new Stand(this);
        this.isJumping = false;
        this.isFalling = false;
        this.isRolling = false;
        this.jumpDist = 250;
        this.boundX = this.x + 40;
        this.boundY = this.y + 20;
        this.boundWidth = this.width - 60;
        this.boundHeight = this.height - 20;
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
        this.y += this.velY;
        if (this.isRolling) {
            this.boundX = this.x + 40;
            this.boundY = this.y + 70;
            this.boundWidth = this.width / 2;
            this.boundHeight = this.height - 80;
        }
        else {
            this.boundX = this.x + 40;
            this.boundY = this.y + 20;
            this.boundWidth = this.width - 60;
            this.boundHeight = this.height - 20;
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
            return this.game.canvas.height - this.height - 25;
        else
            return this.game.canvas.height - this.height - 105;
    }
}
