
export abstract class Layer {

    ctx: CanvasRenderingContext2D;

    abstract name: string;

    constructor() {
        this.ctx = this.makeCtx(500, 500);

        document.querySelector('#debug').appendChild(this.ctx.canvas);
    }

    get shaderTextureName(): string {
        return `u_${this.name}`;
    }

    abstract prepare(ctx: CanvasRenderingContext2D);
    abstract draw(ctx: CanvasRenderingContext2D);

    protected makeCtx(width: number, height: number): CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        return canvas.getContext('2d');
    }
}