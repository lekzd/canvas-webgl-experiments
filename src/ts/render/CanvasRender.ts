import {Inject} from "../helpers/InjectDectorator";
import {State} from "../State";
import {WebGlCtx} from "../views/WeglCtx";
import {Layer} from "../views/Layer";

export class CanvasRender {
    @Inject(WebGlCtx) private gl: WebGLRenderingContext;
    @Inject(State) private state: State;

    private layers: Layer[] = [];

    add(layer: Layer) {
        this.layers.push(layer);
    }

    prepare() {
        this.layers.forEach(layer => {
           layer.prepare(layer.ctx);
        });

        // this.gl.canvas.addEventListener('click', (e) => {
        //     this.state.x = e.layerX;
        //     this.state.y = Math.abs(this.gl.canvas.height - e.layerY);
        //     this.state.impulse = 0;
        //     clearInterval(impulseInterval);
        //     clearTimeout(endTimeout);
        //
        //     this.offscreenCtx.fillStyle = 'orange';
        //     this.offscreenCtx.fillRect(e.layerX - 5, e.layerY - 5, 10, 10);
        //
        //     impulseInterval = setInterval(() => {
        //         this.state.impulse++;
        //     }, 20);
        //
        //     endTimeout = setTimeout(() => {
        //         this.state.impulse = 0;
        //         clearInterval(impulseInterval);
        //     }, 500);
        // });
    }

    draw() {
        this.layers.forEach(layer => {
            layer.draw(layer.ctx);
        });
    }
}