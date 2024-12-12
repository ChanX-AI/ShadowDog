import { Enemy } from "./enemy.js"; 

export class Bat extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('bat');
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 5;
        this.x = this.game.canvas.width;
        this.y = Math.random() * (this.game.canvas.height - 6 * this.height) + 3 * this.height;
        this.velX = 2;
        this.flagToRemove = false;
    }
}

export class Ghost extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('ghost');
        this.spriteWidth = 260;
        this.spriteHeight = 209;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 5;
        this.x = this.game.canvas.width;
        this.y = 2 * this.height;
        this.flagToRemove = false;
        this.velX = 0;
        this.amplitude = Math.random() * 5 + 4;
        this.angle = 0;
        this.deltaAngle = 0.05;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.y += this.amplitude * Math.sin(this.angle);
        this.angle += this.deltaAngle;
    }
}

export class Worm extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('worm');
        this.spriteWidth = 229;
        this.spriteHeight = 171;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 5;
        this.x = this.game.canvas.width;
        this.y = this.game.player.groundLevel() + this.game.player.height - this.height;
        this.flagToRemove = false;
        this.velX = 2;
    }
}

export class Spinner extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('spinner');
        this.spriteWidth = 213;
        this.spriteHeight = 212;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 8;
        this.x = this.game.canvas.width;
        this.y = 2 * this.height;
        this.flagToRemove = false;
        this.velX = 2;
        this.amplitude = Math.random() * 4 + 3;
        this.angle = 0;
        this.deltaAngle = 0.05;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.x += this.amplitude * Math.cos(this.angle);
        this.y += this.amplitude * Math.sin(this.angle);
        this.angle += this.deltaAngle;
    }
}

export class Bat2 extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('bat2');
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 5;
        this.x = this.game.canvas.width;
        this.y = 2 * this.height;
        this.flagToRemove = false;
        this.velX = 2;
        this.amplitude = Math.random() * 5 + 4;
        this.angle = 0;
        this.deltaAngle = 0.05;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.y += this.amplitude * Math.sin(this.angle);
        this.angle += this.deltaAngle;
    }
}

export class Raven extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('raven');
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 5;
        this.x = this.game.canvas.width;
        this.y = Math.random() * (this.game.canvas.height - 6 * this.height) + 3 * this.height;
        this.flagToRemove = false;
        this.velX = 2;
    }
}

export class Zombie extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('zombie');
        this.spriteWidth = 292;
        this.spriteHeight = 410;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.22 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 7;
        this.x = this.game.canvas.width;
        this.y = this.game.player.groundLevel() + this.game.player.height - this.height;
        this.flagToRemove = false;
        this.velX = 2;
    }
}

export class Spider extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('spider');
        this.spriteWidth = 310;
        this.spriteHeight = 175;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 5;
        this.x = Math.random() * (this.game.player.x + this.game.player.width - this.game.canvas.width / 2) + 
                 this.game.canvas.width / 2;
        this.y = -this.height;
        this.flagToRemove = false;
        this.velX = 0;
        this.velY = Math.random() * 4 + 4;
        this.maxHeight = this.game.player.groundLevel() + this.game.player.width;
    }

    draw() {
        super.draw();
        this.game.ctx.beginPath();
        this.game.ctx.moveTo(this.x + this.width / 2, 0);
        this.game.ctx.lineTo(this.x + this.width / 2, this.y);
        this.game.ctx.strokeStyle = 'white';
        this.game.ctx.stroke();
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.y + this.height > this.maxHeight) this.velY = -this.velY;
        if (this.y + this.height < 0) this.flagToRemove = true;
        this.y += this.velY;
    }
}

export class Spider2 extends Enemy {

    constructor(game) {
        super();
        this.game = game;
        this.img = document.getElementById('spider2');
        this.spriteWidth = 120;
        this.spriteHeight = 144;
        this.aspectRatio = this.spriteWidth / this.spriteHeight;
        this.height = 0.13 * this.game.canvas.height;
        this.width = this.height * this.aspectRatio;
        this.maxFrames = 5;
        this.x = Math.random() * (this.game.player.x + this.game.player.width - this.game.canvas.width / 2) + 
                 this.game.canvas.width / 2;
        this.y = -this.height;
        this.flagToRemove = false;
        this.velX = 0;
        this.velY = Math.random() * 6 + 4;
        this.maxHeight = Math.random() * this.game.player.width + this.game.player.groundLevel();
    }

    draw() {
        super.draw();
        this.game.ctx.beginPath();
        this.game.ctx.moveTo(this.x + this.width / 2, 0);
        this.game.ctx.lineTo(this.x + this.width / 2, this.y);
        this.game.ctx.strokeStyle = 'white';
        this.game.ctx.stroke();
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.y + this.height > this.maxHeight) this.velY = -this.velY;
        if (this.y + this.height < 0) this.flagToRemove = true;
        this.y += this.velY;
    }
}
