/*
    * Shadow Dog Game
                        --ChanX

     Rules :
        In PC :
            * Press Space to Jump
            * Press Enter to Attack/Roll
        In Mobile :
            * Rotate your device (Recommended)
            * Touch left half of screen to Jump
            * Touch right half of screen to Attack/Roll
        
        Game Properties :
            * Score increases as game progresses
            * Colliding with enemy in any state other than Roll results in loss of life
            * Colliding with enemy in Roll state increases score
            * Rolling state results in loss of energy which can be seen at top right of screen
            * Player can't Roll if energy is less than zero
            * Player can fill his energy by collecting energy coins which appears like player Roll and white in color
 */



import { Player } from "./player.js";
import { Input } from "./input.js";
import { Layer } from "./background.js";
import { Bat, Ghost, Worm, Spinner, Bat2, Raven, Zombie, Spider, Spider2 } from "./enemies.js";
import { UI } from "./UI.js";
import { Explosion, Energy } from "./particles.js";
import { Run, Hit, Dizzy } from "./states.js";


class Game {

    constructor(canvas, context, bgImages, bgms) {
        this.gameRunning = false;
        this.canvas = canvas;
        this.ctx = context;
        this.forestBG = bgImages.forest;
        this.cityBG = bgImages.city;
        this.currentBG = this.cityBG;
        this.BGShiftFlag = false;
        this.bgms = bgms;
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
        this.energyInterval = 30000;
        this.enemyTimer = 0;
        this.enemyInterval = 5000;
        this.enemyIntervalMin = 3000;
        this.enemyIntervalMax = 6000;
        this.energyIntervalMax = 50000;
        this.energyIntervalMin = 30000;
        this.gameFrames = 0;
        this.lives = 5;
        this.gameOver = false;
        this.rechargeBGM = new Audio('./sounds/recharge.wav');
        this.LTS = [60, 150, 230, 320, 400, 500]; // Level Threshhold Scores
        this.restartBtn = document.getElementById('restart-btn');
        window.addEventListener('fullscreenchange', e => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.player.height = 0.2 * this.canvas.height;
            this.player.width = this.player.height / this.player.aspectRatio;
            this.player.jumpDist = 0.5 * window.innerHeight;
            this.player.y = this.player.groundLevel();
        });
        window.addEventListener('resize', e => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.player.height = 0.2 * this.canvas.height;
            this.player.width = this.player.height / this.player.aspectRatio;
            this.player.jumpDist = 0.5 * window.innerHeight;
            this.player.y = this.player.groundLevel();
        });
    }

    render(deltaTime) {

        this.deltaTime = deltaTime;
        if (this.deltaTime != 0) {
            this.player.interval = 2 * this.deltaTime;
        }

        this.currentBG.forEach(bgImg => {
            bgImg.draw(ctx);
            bgImg.update(this.gameSpeed);
        });
        
        this.#handleEnemies(deltaTime);

        this.#handlePlayerEnergy(deltaTime);

        this.#manageEnemiesProbs();

        this.collisions.forEach(collision => {
            collision.draw(this.ctx);
            collision.update(deltaTime);
        });
        this.collisions = this.collisions.filter(collision => !collision.flagToRemove);

        this.player.draw();
        this.player.update(deltaTime);

        this.UI.drawScore();
        this.UI.drawEnergy();
        this.UI.update(deltaTime);
        this.UI.drawLives(this.lives);

        if (this.gameRunning) {
            this.gameFrames++;
            this.bgms.forEach(bgm => {
                bgm.play();
            });
            if (this.gameFrames % 60 === 0) this.score += 1;
            if (this.lives <= 0) {
                this.gameOver = true;
                this.player.state = new Dizzy(this.player);
                this.gameRunning = false;
                this.gameSpeed = 0;
                this.enemies = [];
                this.energies = [];
                this.collisions = [];
                this.gameFrames = 0;
                this.restartBtn.style.display = 'block';
                this.restartBtn.addEventListener('click', e => {
                    this.lives = 5;
                    this.score = 0;
                    this.currentBG = this.cityBG;
                    this.player.currEnergy = this.player.maxEnergy;
                    this.restartBtn.style.display = 'none';
                    this.gameOver = false;
                    this.enemyIntervalMin = 3000;
                    this.enemyIntervalMax = 6000;
                    this.enemyProbs = [0.5, 0.4, 0.08, 0.02, 0, 0, 0, 0, 0];
                    this.player.state = new Run(this.player);
                });
            }
        }
        if (this.gameOver) this.UI.drawGameOver();
    }

    #handleEnemies(deltaTime) {
        if (this.gameRunning) {
            if (this.enemyTimer > this.enemyInterval) {
                this.enemyTimer = 0;
                this.#selectEnemy();
                this.enemyInterval = Math.random() * (this.enemyIntervalMax - this.enemyIntervalMin) + this.enemyIntervalMin;
            } else this.enemyTimer += deltaTime;
        }
        this.enemies.forEach(enemy => {
            enemy.draw();
            enemy.update(deltaTime);
            if (detectCollision(this.player, enemy)) {
                enemy.flagToRemove = true;
                this.collisions.push(new Explosion(enemy));
                if (this.player.isRolling) this.score += 10;
                else {
                    this.player.state = new Hit(this.player);
                    this.lives--;
                }
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
            if (this.energyTimer > this.energyInterval) {
                this.energyTimer = 0;
                this.energies.push(new Energy(this));
                this.energyInterval = Math.random() * (this.energyIntervalMax - this.energyIntervalMin) + this.energyIntervalMin;
            } else this.energyTimer += deltaTime;
            this.energies.forEach(energy => {
                energy.draw();
                energy.update(deltaTime);
                if (detectCollision(this.player, energy)) {
                    this.player.currEnergy = this.player.maxEnergy;
                    energy.flagToRemove = true;
                    this.rechargeBGM.play();
                }
            });
            this.energies = this.energies.filter(energy => !energy.flagToRemove);
        }
    }

    #shiftBG() {
        this.BGShiftFlag = true;
        this.currentBG = this.forestBG;
        this.player.y = this.player.groundLevel();
    }

    #manageEnemiesProbs() {
        if (inBetween(this.LTS[0], this.LTS[1], this.score)) {
            this.enemyProbs = [0.0, 0.1, 0.5, 0.4, 0, 0, 0, 0, 0];
        }
        else if (inBetween(this.LTS[1], this.LTS[2], this.score)) {
            this.enemyIntervalMin = 2000;
            this.enemyIntervalMax = 5000;
            this.enemyProbs = [0.1, 0.0, 0.0, 0.3, 0.6, 0, 0, 0, 0];
        }
        else if (inBetween(this.LTS[2], this.LTS[3], this.score)) {
            this.enemyIntervalMin = 1700;
            this.enemyIntervalMax = 3800;
            this.enemyProbs = [0.0, 0.0, 0.0, 0.0, 0.35, 0.55, 0.1, 0, 0];
        }
        else if (inBetween(this.LTS[3], this.LTS[4], this.score)) {
            if (!this.BGShiftFlag) this.#shiftBG();
            this.enemyProbs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.3, 0.3];
        }
        else if (inBetween(this.LTS[4], this.LTS[5], this.score)) {
            this.enemyIntervalMin = 1200;
            this.enemyIntervalMax = 3400;
            this.energyIntervalMin = 8000;
            this.energyIntervalMax = 20000;
            this.enemyProbs = [0.1, 0.0, 0.0, 0.0, 0.2, 0.1, 0.1, 0.1, 0.4];
        }
        else if (this.score > this.LTS[5]) {
            this.enemyIntervalMin = 800;
            this.enemyIntervalMax = 1200;
            this.enemyProbs = [0.1, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1];
        }
    }

}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastTime = 0;
let game;

window.addEventListener('load', function(){

    const forestLayer1 = document.getElementById('forest-layer-1');
    const forestLayer2 = document.getElementById('forest-layer-2');
    const forestLayer3 = document.getElementById('forest-layer-3');
    const forestLayer4 = document.getElementById('forest-layer-4');
    const forestLayer5 = document.getElementById('forest-layer-5');

    const cityLayer1 = document.getElementById('city-layer-1');
    const cityLayer2 = document.getElementById('city-layer-2');
    const cityLayer3 = document.getElementById('city-layer-3');
    const cityLayer4 = document.getElementById('city-layer-4');
    const cityLayer5 = document.getElementById('city-layer-5');

    const forestImg1= new Layer(forestLayer1, canvas, 0.2);
    const forestImg2 = new Layer(forestLayer2, canvas, 0.4);
    const forestImg3 = new Layer(forestLayer3, canvas, 0.6);
    const forestImg4 = new Layer(forestLayer4, canvas, 0.8);
    const forestImg5 = new Layer(forestLayer5, canvas, 1);

    const cityImg1= new Layer(cityLayer1, canvas, 0.2);
    const cityImg2 = new Layer(cityLayer2, canvas, 0.4);
    const cityImg3 = new Layer(cityLayer3, canvas, 0.6);
    const cityImg4 = new Layer(cityLayer4, canvas, 0.8);
    const cityImg5 = new Layer(cityLayer5, canvas, 1);

    const forestBG = [forestImg1, forestImg2, forestImg3, forestImg4, forestImg5];
    const cityBG = [cityImg1, cityImg2, cityImg3, cityImg4, cityImg5];

    const bgm1 = new Audio('./sounds/bgm1.mp3');
    const bgm2 = new Audio('./sounds/bgm2.mp3');
    const bgm3 = new Audio('./sounds/bgm3.mp3');
    const bgm4 = new Audio('./sounds/bgm4.mp3');

    const bgms = [bgm1, bgm2, bgm3, bgm3, bgm4];
    bgms.forEach(bgm => {
        bgm.loop = true;
        //bgm.play();
    });

    const bgImages = {
        forest: forestBG,
        city: cityBG
    };

    game = new Game(canvas, ctx, bgImages, bgms);
    requestAnimationFrame(animate);
    function animate(currTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = currTime - lastTime;
        lastTime = currTime;
        game.render(deltaTime);
        requestAnimationFrame(animate);
    }
});



function detectCollision(objectA, objectB) {
    let x1 = objectA.boundX;
    let y1 = objectA.boundY;
    let w1 = objectA.boundWidth;
    let h1 = objectA.boundHeight;
    let x2 = objectB.boundX ?? objectB.x;
    let y2 = objectB.boundY ?? objectB.y;
    let w2 = objectB.boundWidth ?? objectB.width;
    let h2 = objectB.boundHeight ?? objectB.height;

    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2
}

function inBetween(min, max, value) {
    return value > min && value < max;
}

function fullScreen(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        const elem = document.documentElement; // or use a specific element like `canvas`
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } 
        else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(); // Safari
        } 
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen(); // IE/Edge
        }
        window.removeEventListener('keydown', fullScreen);
        window.removeEventListener('click', fullScreen);
        startBtn.style.display = 'none';
    }
}
window.addEventListener('keydown', fullScreen);
startBtn.addEventListener('click', fullScreen);
