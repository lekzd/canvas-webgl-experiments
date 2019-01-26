import {Layer} from "./Layer";
import {Inject} from "../helpers/InjectDectorator";
import {State} from "../State";

export class BulletsLayer extends Layer {

    @Inject(State) private state: State;

    name = 'bullets';

    prepare(ctx) {

    }

    draw(ctx) {
        ctx.canvas.width = ctx.canvas.width;

        ctx.fillStyle = '#eb42f4';
        this.state.bullets.forEach(bullet => {
            ctx.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
            ctx.fillRect(bullet.x - 1, bullet.y - 2, 2, 8);
        });

        ctx.fillStyle = '#fff95d';
        ctx.fillRect(this.state.heroX - 9, this.state.heroY, 4, 16);
        ctx.fillRect(this.state.heroX + 5, this.state.heroY, 4, 16);
        ctx.fillRect(this.state.heroX - 2, this.state.heroY - 8, 4, 16);
        ctx.fillRect(this.state.heroX - 8, this.state.heroY, 16, 4);


        ctx.fillStyle = '#f42d0d';
        this.state.enemies.forEach(enemy => {
            ctx.fillRect(enemy.x - 12, enemy.y - 16, 8, 16);
            ctx.fillRect(enemy.x - 4, enemy.y - 8, 8, 16);
            ctx.fillRect(enemy.x + 4, enemy.y - 16, 8, 16);
        });
    }
}