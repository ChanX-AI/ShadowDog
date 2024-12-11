export class Explosion {

    constructor(enemy) {
        this.enemy = enemy;
        this.img = document.getElementById('explosion');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrames = 6;
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.timer = 0;
        this.interval = 60;
        this.sound = new Audio();
        this.sound.src = './sounds/explosion.mp3';
        this.sound.volume = 0.3;
        this.flagToRemove = false;
    }

    draw(context) {
        context.drawImage(
            this.img,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.enemy.x,
            this.enemy.y,
            this.width,
            this.height
        );
    }

    update(deltaTime) {
        if (this.frameX === 0) this.sound.play();
        if (this.timer > this.interval) {
            this.frameX === this.maxFrames ? this.flagToRemove = true : this.frameX++;
        } else this.timer += deltaTime;
    }

}

export class Energy {

    constructor(game) {
        this.game = game;
        this.img = document.getElementById('white_dog');
        this.energyImg = document.getElementById('energy');
        this.spriteWidth = 200;
        this.spriteHeight = 182;
        this.frameX = 0;
        this.frameY = 10;
        this.maxFrames = 6;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.energyWidth = this.energyImg.width;
        this.energyHeight = this.energyImg.height;
        this.x = this.game.canvas.width;
        this.y = this.game.player.groundLevel() / 2;
        this.boundX = this.x + 60;
        this.boundY = this.y + 40;
        this.boundWidth = this.width / 2;
        this.boundHeight = this.height / 1.8;
        this.timer = 0;
        this.interval = 20;
        this.velX = 3;
        this.flagToRemove = false;
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
        if (this.game.input.debug) this.game.ctx.strokeRect(this.boundX, this.boundY, this.boundWidth, this.boundHeight);
    }

    update(deltaTime) {
        if (this.timer > this.interval) {
            this.timer = 0;
            this.frameX === this.maxFrames ? this.frameX = 0 : this.frameX++;
        } else this.timer += deltaTime;
        this.x -= this.game.gameSpeed + this.velX;
        this.boundX = this.x + 60;
        this.boundY = this.y + 40;
        this.boundWidth = this.width / 2;
        this.boundHeight = this.height / 1.8;
        if (this.x < -this.width) this.flagToRemove = true;
    }
}
