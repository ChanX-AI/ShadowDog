export class Layer {

    constructor(img, canvas, speed) {
        this.img = img;
        this.canvas = canvas;
        this.speed = speed;
        this.x = 0;
        this.y = 0;
    }

    draw(context) {
        context.drawImage(
            this.img,
            0,
            0,
            this.img.width,
            this.img.height,
            this.x,
            this.y,
            this.canvas.width,
            this.canvas.height
        );
        context.drawImage(
            this.img,
            0,
            0,
            this.img.width,
            this.img.height,
            this.x + this.canvas.width,
            this.y,
            this.canvas.width,
            this.canvas.height
        );
    }

    update(gameSpeed) {
        if (this.x + this.canvas.width <= 0) this.x = 0;
        this.x -= gameSpeed * this.speed;
    }
}
