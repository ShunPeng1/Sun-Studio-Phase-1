import WebGLManager from '../../webgl/WebGLManager';
import WebglRenderer from './Renderer';
import {glMatrix, mat4, quat, vec3} from 'gl-matrix';

class CameraRenderer extends WebglRenderer {
    private worldMatrix: mat4;
    private viewMatrix: mat4;
    private projMatrix: mat4;

    private canvas: HTMLCanvasElement;


    constructor(webgl: WebGLManager, canvas: HTMLCanvasElement) {
        super(webgl);
        this.worldMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();

        this.canvas = canvas;

    }

    public awake() {
        let gl = this.webgl.getGL();
        let program = this.webgl.getProgram();

        let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

        this.updateMatrices();
        
        gl.uniformMatrix4fv(matWorldUniformLocation, false, this.worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, false, this.viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, false, this.projMatrix);
    }

    

    public render(time: number, deltaTime: number) {
        let gl = this.webgl.getGL();
        let program = this.webgl.getProgram();

        let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
        
        this.updateMatrices();

        gl.uniformMatrix4fv(matWorldUniformLocation, false, this.worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, false, this.viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, false, this.projMatrix);

        
    }

    private updateMatrices() {
        let gl = this.webgl.getGL();

        // Convert Euler angles (x, y, z) to quaternion
        let rotationQuat = quat.create();
        quat.fromEuler(rotationQuat, this.transform.rotation[0], this.transform.rotation[1], this.transform.rotation[2]);

        // Create rotation matrix from quaternion
        let rotationMatrix = mat4.create();
        mat4.fromQuat(rotationMatrix, rotationQuat);

        let forward = vec3.transformMat4(vec3.create(), vec3.fromValues(0, 0, -1), rotationMatrix);
        let target = vec3.add(vec3.create(), this.transform.position, forward);

        mat4.identity(this.worldMatrix);
        mat4.lookAt(this.viewMatrix, this.transform.position, target, [0, 1, 0]);
        mat4.perspective(this.projMatrix, glMatrix.toRadian(60), this.canvas.width / this.canvas.height, 0.1, 1000.0);
    }
}

export default CameraRenderer;