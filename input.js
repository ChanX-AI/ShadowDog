export class Input {
    constructor() {
        this.key = '';
        this.debug = false;
        this.space = false;
        this.roll = false;
        this.releasedEnter = false;
        window.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown') {
                this.key = 'DOWN';
            }
            if (e.key === 'ArrowUp') {
                this.key = 'UP';
            }
            if (e.key === ' ' && !this.space) {
                this.key = 'SPACE';
                this.space = true;
            }
            if (e.key === 'Enter') {
                this.releasedEnter = false;
                this.key = 'ENTER';
            }
            if (e.key === 'Shift') {
                this.key = 'SHIFT';
            }

            if (e.key === 'r' && !this.roll) {
                this.key = 'R';
                this.roll = true;
            }

            if (e.key === 'd') {
                this.debug = !this.debug;
            }
        });
        window.addEventListener('keyup', e => {
            if (e.key === ' ') {
                this.space = false;
            }
            if (e.key === 'Enter') {
                this.releasedEnter = true;
            }
            if (e.key === 'r') {
                this.roll = false;
            }
        });
    }
}