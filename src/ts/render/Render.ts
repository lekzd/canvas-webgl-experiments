import {Inject} from "../helpers/InjectDectorator";
import {WebglRender} from "./WebglRender";
import {CanvasRender} from "./CanvasRender";
import {setMainRenderFunction} from "../helpers/requestRenderFrame";
import {Layer} from "../views/Layer";

export class Render {
    @Inject(WebglRender) private webglRender: WebglRender;
    @Inject(CanvasRender) private canvasRender: CanvasRender;

    init(layers: Layer[]) {

        layers.forEach(layer => {
            this.canvasRender.add(layer);
            this.webglRender.add(layer);
        });

        this.canvasRender.prepare();
        this.webglRender.prepare();

        setMainRenderFunction(() => {
            this.canvasRender.draw();
            this.webglRender.draw();
        });
    }
}