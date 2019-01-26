import {Inject} from "../helpers/InjectDectorator";
import {WebGlCtx} from "../views/WeglCtx";
import {State} from "../State";
import {OffscreenCtx} from "../views/OffscreenCtx";
import {BulletsCtx} from "../views/BulletsCtx";

import * as vertexShader from "../../glsl/vertex.vert";
import * as fragmentShader from "../../glsl/fragment.frag";

type IGlTexture = {
    location: WebGLUniformLocation;
    canvas: HTMLCanvasElement;
    texture: WebGLTexture;
}

export class WebglRender {

    @Inject(OffscreenCtx) private offscreenCtx: CanvasRenderingContext2D;
    @Inject(BulletsCtx) private bulletsCtx: CanvasRenderingContext2D;
    @Inject(WebGlCtx) private gl: WebGLRenderingContext;
    @Inject(State) private state: State;

    private program: WebGLProgram;
    private positionBuffer: WebGLBuffer;
    private texcoordBuffer: WebGLBuffer;
    private textures = new Set<IGlTexture>();

    prepare() {
        this.program = window.webglUtils.createProgramFromSources(this.gl, [vertexShader, fragmentShader]);// Tell it to use our program (pair of shaders)
        this.gl.useProgram(this.program);

        // Create a buffer to put three 2d clip space points in
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.bindArrayBuffer("a_position", this.positionBuffer);
        this.setRectangle(0, 0, this.offscreenCtx.canvas.width, this.offscreenCtx.canvas.height);

        // provide texture coordinates for the rectangle.
        this.texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
        this.bindArrayBuffer("a_texCoord", this.texcoordBuffer);
        this.setRectangle(0, 0, 1, 1);

        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Create a texture.
        this.addTexture('u_image', this.offscreenCtx.canvas);
        this.addTexture('u_bulletsImage', this.bulletsCtx.canvas);

        // set the resolution
        this.setVecValue('u_resolution', 2, this.gl.canvas.width, this.gl.canvas.height);
        // set the size of the image
        this.setVecValue('u_textureSize', 2, this.offscreenCtx.canvas.width, this.offscreenCtx.canvas.height);

        [...this.textures].forEach(({location, texture, canvas}, index) => {
            this.gl.uniform1i(location, index);
        });
    }

    draw() {
        if (!this.gl) {
            return;
        }

        this.setVecValue('u_mousePos', 3, this.state.x, this.state.y, this.state.impulse);
        this.setVecValue('u_backgroundTop', 1, this.state.top);

        [...this.textures].forEach(({location, texture, canvas}, index) => {
            this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas);
        });

        this.drawRectangle();
    }

    private setVecValue(name: string, size: number, ...value: number[]) {
        const method = ['uniform1f', 'uniform2f', 'uniform3f', 'uniform4f'][size - 1];

        const location = this.gl.getUniformLocation(this.program, name);

        this.gl[method](location, ...value);
    }

    private setRectangle(x: number, y: number, width: number, height: number) {
        const x1 = x;
        const x2 = x + width;
        const y1 = y;
        const y2 = y + height;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), this.gl.STATIC_DRAW);
    }

    private drawRectangle() {
        // Draw the rectangle.
        const primitiveType = this.gl.TRIANGLES;
        const offset = 0;
        const count = 6;

        this.gl.drawArrays(primitiveType, offset, count);
    }

    private bindArrayBuffer(attribute: string, buffer: WebGLBuffer) {
        const attributeLocation = this.gl.getAttribLocation(this.program, attribute);
        // Turn on the teccord attribute
        this.gl.enableVertexAttribArray(attributeLocation);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        const size = 2;          // 2 components per iteration
        const type = this.gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer

        this.gl.vertexAttribPointer(attributeLocation, size, type, normalize, stride, offset)
    }

    private addTexture(name: string, canvas: HTMLCanvasElement) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        // this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas);

        this.textures.add({
            location: this.gl.getUniformLocation(this.program, name),
            canvas,
            texture
        })
    }
}