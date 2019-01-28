import {Layer} from "./Layer";
import {Inject} from "../helpers/InjectDectorator";
import {State} from "../State";

export class BulletsLayer extends Layer {

    @Inject(State) private state: State;

    name = 'bullets';

    private startCtx: CanvasRenderingContext2D;

    prepare(ctx) {
        this.startCtx = this.makeCtx(26, 26);

        this.drawStar(13, 13, 5, 13, 3, this.startCtx);
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

        this.state.enemies.forEach(enemy => {
            ctx.drawImage(this.startCtx.canvas, enemy.x - 13, enemy.y - 13);
        });
    }

    private drawStar(cx,cy,spikes,outerRadius,innerRadius, ctx){
        let rot = Math.PI / 2*3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx,cy - outerRadius);

        for(let i = 0; i < spikes; i++){
            x = cx + Math.cos(rot) * outerRadius;
            y= cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#f42d0d';
        ctx.stroke();
        ctx.fillStyle = '#f42d0d';
        ctx.fill();
    }
}