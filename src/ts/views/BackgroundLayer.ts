import {Layer} from "./Layer";
import {clamp} from "../helpers/clamp";

export class BackgroundLayer extends Layer {

    name = 'background';

    prepare(ctx) {

        for (let i = 0; i < 100; i++) {
            let x = Math.floor(Math.random() * 50);
            let y = Math.floor(Math.random() * 50);
            let size = Math.floor(Math.random() * 8) + 2;
            const color = 15 * size;

            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;

            ctx.fillRect(clamp(x * 10, 10, 490), clamp(y * 10, 10, 490), size, size);
        }

    }

    draw(ctx) {

    }
}