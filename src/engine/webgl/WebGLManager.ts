import BaseShader from './shaders/BaseShader';
import VertexShader from './shaders/VertexShader';
import FragmentShader from './shaders/FragmentShader';


import Shape from './shapes/Shape';

import * as GLM from 'gl-matrix'

import Canvas from '../canvas/Canvas';
import CanvasManager from '../canvas/CanvasManager';


class WebGLManager {
    private static instance: WebGLManager;
    
    private gl: WebGLRenderingContext;
    private webglCanvas: HTMLCanvasElement;

    private program: WebGLProgram;

    private worldMatrix: GLM.mat4;
    private viewMatrix: GLM.mat4;
    private projMatrix: GLM.mat4;

    private constructor() {
        this.webglCanvas = CanvasManager.getInstance().getWebglCanvas();
        this.gl = CanvasManager.getInstance().getWebglCanvasRenderingContext();

       
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

        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);

        // Enable blending
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        
        
    }

    public static getInstance(): WebGLManager {
        if (!WebGLManager.instance) {
            WebGLManager.instance = new WebGLManager();
        }
        return WebGLManager.instance;
    }


    public clearScreen() {
        let gl = this.gl;
        // Clear screen
        gl.clearColor(0.58, 0.45, 0.65, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public getGL(): WebGLRenderingContext {
        return this.gl;
    }

    public getProgram(): WebGLProgram {
        return this.program;
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