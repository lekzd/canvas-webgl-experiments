import './webglUtils';
import {setMainRenderFunction} from "./helpers/requestRenderFrame";
import {Inject} from "./helpers/InjectDectorator";
import {WebglRender} from "./render/WebglRender";
import {CanvasRender} from "./render/CanvasRender";
import {State} from "./State";
import {Io} from "./Io";

declare global {
    interface Window {
        webglUtils: any;
    }
}

class App {
    @Inject(WebglRender) private webglRender: WebglRender;
    @Inject(CanvasRender) private canvasRender: CanvasRender;
    @Inject(State) private state: State;
    @Inject(Io) private io: Io;

    constructor() {
        this.canvasRender.prepare();
        this.webglRender.prepare();

        setMainRenderFunction(() => {
            this.canvasRender.draw();
            this.webglRender.draw();
        });

        const velocity = 15;

        setInterval(() => {
           this.state.top = (this.state.top + 5) % 500;

           if (this.io.has('KeyW')) {
               this.state.heroY -= velocity;
           }

           if (this.io.has('KeyS')) {
               this.state.heroY += velocity;
           }

           if (this.io.has('KeyA')) {
               this.state.heroX -= velocity;
           }

           if (this.io.has('KeyD')) {
               this.state.heroX += velocity;
           }

           if (this.io.has('Space')) {
               const bullet = {
                   x: this.state.heroX,
                   y: this.state.heroY - 20
               };

               this.state.bullets.add(bullet);

               setTimeout(() => {
                   this.state.bullets.delete(bullet);
               }, 2000);
           }

           this.state.bullets.forEach(bullet => bullet.y -= 10 * Math.floor(Math.random() * 10));

        }, 50);
    }
}

new App;