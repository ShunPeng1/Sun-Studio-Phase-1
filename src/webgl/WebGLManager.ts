import {BaseShader} from './BaseShader';
import VertexShader from './VertexShader';
import FragmentShader from './FragmentShader';
import Canvas from './Canvas';
import * as GLM from 'gl-matrix'

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
        var boxVertices = 
        [ // X, Y, Z           R, G, B
            // Top
            -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
            1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
            1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
    
            // Left
            -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
            -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
            -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,
    
            // Right
            1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
            1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
            1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
            1.0, 1.0, -1.0,   0.25, 0.25, 0.75,
    
            // Front
            1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
            1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
    
            // Back
            1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
            1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
    
            // Bottom
            -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
            -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
            1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
            1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

        // Create index buffer
        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);    
        var boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,
    
            // Left
            5, 4, 6,
            6, 4, 7,
    
            // Right
            8, 9, 10,
            8, 10, 11,
    
            // Front
            13, 12, 14,
            15, 14, 12,
    
            // Back
            16, 17, 18,
            16, 18, 19,
    
            // Bottom
            21, 20, 22,
            22, 20, 23
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

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
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false, // Normalization
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        // Create color attribute
        let colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');

        // Enable color attribute
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            colorAttributeLocation, 
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false, // Normalization
            0, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        // Set matrices
        let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

        let worldMatrix = GLM.mat4.create();
        let viewMatrix = GLM.mat4.create();
        let projMatrix = GLM.mat4.create();

        this.worldMatrix = worldMatrix;
        this.viewMatrix = viewMatrix;
        this.projMatrix = projMatrix;
        
        GLM.mat4.identity(worldMatrix);
        GLM.mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
        GLM.mat4.perspective(projMatrix, GLM.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    
        gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

        

    }

    public render(time: number, deltaTime: number): void {
        var gl = this.gl;

        var angle = deltaTime / 1000 * Math.PI;

        let identityMatrix = GLM.mat4.create();
        GLM.mat4.rotate(this.worldMatrix, identityMatrix , angle, [0, 1, 0]);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'mWorld'), false, this.worldMatrix);

        // Clear screen
        gl.clearColor(0.58, 0.45, 0.65, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw
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