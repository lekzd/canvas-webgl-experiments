import {Layer} from "./Layer";
import {Inject} from "../helpers/InjectDectorator";
import {State} from "../State";

export class EffectsLayer extends Layer {

    @Inject(State) private state: State;

    name = 'effects';

    prepare(ctx) {

    }

    draw(ctx) {
        ctx.canvas.width = ctx.canvas.width;

        ctx.lineWidth = 10;

        this.state.effects.forEach(({x, y, size}) => {
            ctx.strokeStyle = `rgba(255, 255, 255, ${5 / size})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);

            ctx.stroke();
        });
    }
}