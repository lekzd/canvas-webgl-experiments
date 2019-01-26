import {Layer} from "./Layer";
import {Inject} from "../helpers/InjectDectorator";
import {State} from "../State";

export class UiLayer extends Layer {

    @Inject(State) private state: State;

    name = 'ui';

    prepare(ctx) {
        ctx.font = "30px Arial";
        ctx.fillStyle = '#ffffff';
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillText(this.state.points, 50, 50);
    }
}