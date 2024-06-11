import BaseShader from './Shader/BaseShader';
import VertexShader from './Shader/VertexShader';
import FragmentShader from './Shader/FragmentShader';

import Box from './Shapes/Box';

import Canvas from './Canvas';
import * as GLM from 'gl-matrix'

class WebGLManager {
    private gl: WebGLRenderingContext;
    private canvas: HTMLCanvasElement;
    private program: WebGLProgram;

    private worldMatrix: GLM.mat4;
    private viewMatrix: GLM.mat4;
    private projMatrix: GLM.mat4;

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

        // Create a box
        let box = new Box(gl, program, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]);
        
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