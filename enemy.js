export class Enemy {

    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.timer = 0;
        this.interval = 5;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.3 * window.innerHeight;
        this.width = this.height / this.aspectRatio;
    }

    draw() {
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
        if (this.game.input.debug) this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update(deltaTime) {
        if (this.timer > this.interval) {
            this.timer = 0;
            this.frameX === this.maxFrames ? this.frameX = 0 : this.frameX++;
        } else this.timer += deltaTime;
        this.x -= this.velX + this.game.gameSpeed;
        this.boundX = this.x;
        this.boundY = this.y;
        this.boundWidth = this.width;
        this.bounsHeight = this.height;

        if (this.x < -this.game.canvas.width) this.flagToRemove = true;
    }
}
