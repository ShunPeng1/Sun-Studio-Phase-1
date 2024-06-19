import CanvasManager from '../../canvas/CanvasManager';
import WebGLRenderer from './WebGLRenderer';
import {glMatrix, mat4, quat, vec3} from 'gl-matrix';

class CameraRenderer extends WebGLRenderer {
    private worldMatrix: mat4;
    private viewMatrix: mat4;
    private projMatrix: mat4;

    private htmlCanvas: HTMLCanvasElement;

    constructor() {
        super();
        this.worldMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
    }

    public awake() {
        super.awake();
        
        this.htmlCanvas = CanvasManager.getInstance().getWebglCanvas();
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
        mat4.perspective(this.projMatrix, glMatrix.toRadian(60), this.htmlCanvas.width / this.htmlCanvas.height, 0.1, 1000.0);
    }

    public getRayFromMouse(mouseX: number, mouseY: number): vec3 {
        let nearPoint = vec3.fromValues(mouseX, mouseY, 0);
        let farPoint = vec3.fromValues(mouseX, mouseY, 1);
    
        let inverseProjMatrix = mat4.create();
        let inverseViewMatrix = mat4.create();
    
        mat4.invert(inverseProjMatrix, this.projMatrix);
        mat4.invert(inverseViewMatrix, this.viewMatrix);
    
        vec3.transformMat4(nearPoint, nearPoint, inverseProjMatrix);
        vec3.transformMat4(nearPoint, nearPoint, inverseViewMatrix);
    
        vec3.transformMat4(farPoint, farPoint, inverseProjMatrix);
        vec3.transformMat4(farPoint, farPoint, inverseViewMatrix);
    
        let rayDirection = vec3.create();
        vec3.subtract(rayDirection, farPoint, nearPoint);
        vec3.normalize(rayDirection, rayDirection);
    
        return rayDirection;
    }
}

export default CameraRenderer;