import {BaseShader} from './BaseShader';
import VertexShader from './VertexShader';
import FragmentShader from './FragmentShader';
import Canvas from './Canvas';


class WebGLManager {
    private gl: WebGLRenderingContext;
    private canvas: HTMLCanvasElement;
    private program: WebGLProgram;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') as WebGLRenderingContext;

        if (!this.gl) {
            console.log('WebGL not supported, falling back on experimental-webgl');
            this.gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext;
        }

        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        // Get WebGL context
        let gl = this.gl;

        // Set clear color
        gl.clearColor(150 / 256, 115 / 256, 166 / 256, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Create shaders
        let vertexShader = new VertexShader(gl);
        let fragmentShader = new FragmentShader(gl);
        let vertexShaderCompiled = this.createShader(vertexShader);
        let fragmentShaderCompiled = this.createShader(fragmentShader);

        // Create program
        if (!vertexShaderCompiled || !fragmentShaderCompiled) {
            console.error('Error creating shaders');
        }

        let program = this.createProgram(vertexShader, fragmentShader);
        if (program) {
            gl.useProgram(program);
        }
        else {
            console.error('Error creating program');
            return;
        }

        // Validate program
        this.validateProgram(program);
        this.program = program;

        // Create buffer
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let positions = [
            0, 0,
            0, 0.5,
            0.7, 0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Create color buffer
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        let colors = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // Create position attribute
        let positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');

        // Enable position attribute
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
            positionAttributeLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false, // Normalization
            2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        // Create color attribute
        let colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');

        // Enable color attribute
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        // Draw
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

    }

    public getGL(): WebGLRenderingContext {
        return this.gl;
    }

    public createShader(shader: BaseShader): WebGLShader | null {
        var webGlShader = shader.webGlShader;
        this.gl.shaderSource(webGlShader, shader.getSource());
        this.gl.compileShader(webGlShader);

        if (!this.gl.getShaderParameter(webGlShader, this.gl.COMPILE_STATUS)) {
            console.error('ERROR compiling shader!', this.gl.getShaderInfoLog(webGlShader));
            return null;
        }
        return webGlShader;
    }

    private createProgram(vertexShader: VertexShader, fragmentShader: FragmentShader): WebGLProgram | null {
        var program = this.gl.createProgram();

        if (!program) {
            console.error('Error creating program');
            return null;
        }

        this.gl.attachShader(program, vertexShader.webGlShader);
        this.gl.attachShader(program, fragmentShader.webGlShader);
        this.gl.linkProgram(program);
        var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);

        if (success) {
            return program;
        }

        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);

        return null;
    }

    private validateProgram(program: WebGLProgram): void {
        this.gl.validateProgram(program);
        var success = this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS);

        if (!success) {
            console.error('ERROR validating program!', this.gl.getProgramInfoLog(program));
        }
    }

}

export default WebGLManager;