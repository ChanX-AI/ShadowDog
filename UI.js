export class UI {

    constructor(game) {
        this.game = game;
        this.frameX = 0;
        this.frameY = 6;
        this.maxFrames = 6;
        this.spriteWidth = 575;
        this.spriteHeight = 523;
        this.timer = 0;
        this.interval = 30;
        this.lifeImg = document.getElementById('lives');
    }

    drawScore() {
        this.game.ctx.fillText('Score : ' + this.game.score, 10, 30);
    }

    drawEnergy() {
        let totalWidth = this.game.player.maxEnergy;
        let energyBar = Math.max(this.game.player.currEnergy, 0);
        let height = 10;
        let x = this.game.canvas.width - totalWidth - 10;
        let y = 20;
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(x, y, energyBar, height);
        this.game.ctx.fillStyle = 'black';
        this.game.ctx.strokeRect(x, y, totalWidth, height);
        this.game.ctx.drawImage(
            document.getElementById('player'),
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            x - 50,
            -10,
            this.spriteWidth / 10,
            this.spriteHeight / 10
        );
    }

    drawLives(lives) {
        for (let i = 0; i < lives; i++) {
            this.game.ctx.drawImage(
                this.lifeImg,
                0,
                0,
                this.lifeImg.width,
                this.lifeImg.height,
                10 + i * this.lifeImg.width * 0.5,
                50,
                this.lifeImg.width * 0.5,
                this.lifeImg.height * 0.5,
            );
        }
    }

    update(deltaTime) {
        if (this.timer > this.interval) {
            this.timer = 0;
            this.frameX === this.maxFrames ? this.frameX = 0 : this.frameX++;
        } else this.timer += deltaTime;
    }
}