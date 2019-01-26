import {OffscreenCtx} from "../views/OffscreenCtx";
import {Inject} from "../helpers/InjectDectorator";
import {State} from "../State";
import {WebGlCtx} from "../views/WeglCtx";
import {BulletsCtx} from "../views/BulletsCtx";

export class CanvasRender {
    @Inject(OffscreenCtx) private offscreenCtx: CanvasRenderingContext2D;
    @Inject(BulletsCtx) private bulletsCtx: CanvasRenderingContext2D;
    @Inject(WebGlCtx) private gl: WebGLRenderingContext;
    @Inject(State) private state: State;

    private backgroundCtx = this.makeCtx(500, 500);

    prepare() {
        let impulseInterval = null;
        let endTimeout = null;

        Object.assign(this.offscreenCtx.canvas, {
            width: 500,
            height: 500
        });

        Object.assign(this.bulletsCtx.canvas, {
            width: 500,
            height: 500
        });

        function clamp(num, min, max) {
            return num <= min ? min : num >= max ? max : num;
        }

        for (let i = 0; i < 100; i++) {
            let x = Math.floor(Math.random() * 50);
            let y = Math.floor(Math.random() * 50);
            let size = Math.floor(Math.random() * 8) + 2;
            const color = 15 * size;

            this.backgroundCtx.fillStyle = `rgb(${color}, ${color}, ${color})`;

            this.backgroundCtx.fillRect(clamp(x * 10, 10, 490), clamp(y * 10, 10, 490), size, size);
        }

        this.gl.canvas.addEventListener('click', (e) => {
            this.state.x = e.layerX;
            this.state.y = Math.abs(this.gl.canvas.height - e.layerY);
            this.state.impulse = 0;
            clearInterval(impulseInterval);
            clearTimeout(endTimeout);

            this.offscreenCtx.fillStyle = 'orange';
            this.offscreenCtx.fillRect(e.layerX - 5, e.layerY - 5, 10, 10);

            impulseInterval = setInterval(() => {
                this.state.impulse++;
            }, 20);

            endTimeout = setTimeout(() => {
                this.state.impulse = 0;
                clearInterval(impulseInterval);
            }, 500);
        });

        this.offscreenCtx.drawImage(this.backgroundCtx.canvas, 0, 0);
    }

    draw() {
        // this.offscreenCtx.canvas.width = 500;
        // const firstTop = this.state.top % 500;
        //
        // this.offscreenCtx.drawImage(this.backgroundCtx.canvas, 0, firstTop - 490);
        // this.offscreenCtx.drawImage(this.backgroundCtx.canvas, 0, firstTop);

        // this.offscreenCtx.fillStyle = 'orange';
        //
        // this.offscreenCtx.fillRect(this.state.heroX - 5, this.state.heroY - 10, 10, 20);

        this.bulletsCtx.canvas.width = this.bulletsCtx.canvas.width;

        this.bulletsCtx.fillStyle = '#eb42f4';
        this.state.bullets.forEach(bullet => {
            this.bulletsCtx.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
        });
    }

    private makeCtx(width: number, height: number): CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        return canvas.getContext('2d');
    }
}