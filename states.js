const start_info = document.getElementById('start-info');
const resume_info = document.getElementById('resume-info');

export class Stand {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 0;
        this.player.maxFrames = 6;
        start_info.style.display = 'block';
        this.player.game.gameSpeed = 0;
        this.player.isRolling = false;
    }

    manageStates() {
        if (this.player.game.input.key === 'ENTER'  || this.player.game.input.touch) {
            this.player.game.input.touch = false;
            this.player.state = new Run(this.player);
        }
    }
}

export class Sit {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 5;
        this.player.maxFrames = 4;
        this.player.game.input.key = '';
        this.player.game.gameSpeed = 0;
        this.player.isRolling = false;
    }

    manageStates() {
        if (this.player.game.input.key === 'SPACE')
            this.player.state = new Run(this.player);
    }
}

export class Run {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 3;
        this.player.maxFrames = 8;
        this.player.game.input.key = '';
        start_info.style.display = 'none';
        resume_info.style.display = 'none';
        this.player.game.gameSpeed = 5;
        this.player.game.gameRunning = true;
        this.player.isRolling = false;
    }

    manageStates() {
        if (this.player.game.input.key === 'DOWN')
            this.player.state = new Sit(this.player);
        if (this.player.game.input.key === 'SPACE')
            this.player.state = new Jump(this.player);
        if (this.player.game.input.key === 'ENTER' && this.player.currEnergy > 0)
            this.player.state = new Roll(this.player);
    }
}

export class Jump {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 1;
        this.player.maxFrames = 6;
        this.player.game.input.key = '';
        this.player.game.gameSpeed = 8;
        this.player.isJumping = true;
        this.player.isRolling = false;
    }

    manageStates() {
        if (!this.player.isJumping) this.player.state = new Fall(this.player);
        if (this.player.game.input.key === 'ENTER' && this.player.currEnergy > 0) {
            this.player.state = new Roll(this.player);
        }
    }
}

export class Fall {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 2;
        this.player.maxFrames = 6;
        this.player.game.gameSpeed = 8;
        this.player.isFalling = true;
        this.player.game.input.key = '';
        this.player.isRolling = false;
    }

    manageStates() {
        if (!this.player.isFalling) this.player.state = new Run(this.player);
        if (this.player.game.input.key === 'ENTER' && this.player.currEnergy > 0)
             this.player.state = new Roll(this.player);
    }
}

export class Roll {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 6;
        this.player.maxFrames = 6;
        this.player.game.gameSpeed = 8;
        this.rollTimer = 0;
        this.rollInterval = 80;
        this.player.game.input.key = '';
        this.player.isRolling = true;
    }

    manageStates() {
        if (this.player.currEnergy <= 0 || this.player.game.input.releasedEnter) {
            if (this.player.isJumping) this.player.state = new Jump(this.player);
            if (this.player.isFalling) this.player.state = new Fall(this.player);
            if (!this.player.isJumping && !this.player.isFalling) this.player.state = new Run(this.player);
        } else this.player.currEnergy -= 0.35;

        if (this.player.game.input.key === 'SPACE') {
            this.player.game.input.key = '';
            this.player.isJumping = true;
        }
    }
}

export class Hit {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 9;
        this.player.maxFrames = 3;
        this.player.game.input.key = '';
        this.player.game.gameRunning = true;
        this.player.isRolling = false;
    }

    manageStates() {
        if (this.player.frameX === this.player.maxFrames) {
            if (this.player.onGround() && this.player.game.gameSpeed !== 0) this.player.state = new Run(this.player);
            if (this.player.onGround() && this.player.game.gameSpeed === 0) this.player.state = new Sit(this.player);
            if (this.player.isJumping) this.player.state = new Jump(this.player);
            if (this.player.isFalling) this.player.state = new Fall(this.player);
        }
    }
}

export class Dizzy {

    constructor(player) {
        this.player = player;
        this.player.frameX = 0;
        this.player.frameY = 4;
        this.player.maxFrames = 10;
    }

    manageStates() {
    }
}
