import { mat4, vec3 } from "gl-matrix";

class Transform {

    public readonly position: vec3;
    public readonly rotation: vec3;
    public readonly scale: vec3;

    private parent: Transform | null = null;
    private readonly children: Transform[] = [];

    constructor() {
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);
    }

    public translate(x: number, y: number, z: number) {
        vec3.add(this.position, this.position, vec3.fromValues(x, y, z));
    }

    public rotate(x: number, y: number, z: number) {
        vec3.add(this.rotation, this.rotation, vec3.fromValues(x, y, z));
    }

    public scaleBy(x: number, y: number, z: number) {
        vec3.multiply(this.scale, this.scale, vec3.fromValues(x, y, z));
    }

    public getWorldMatrix(): mat4 {
        let worldMatrix = mat4.create();
        mat4.translate(worldMatrix, worldMatrix, this.position);
        mat4.rotateX(worldMatrix, worldMatrix, this.rotation[0]);
        mat4.rotateY(worldMatrix, worldMatrix, this.rotation[1]);
        mat4.rotateZ(worldMatrix, worldMatrix, this.rotation[2]);
        mat4.scale(worldMatrix, worldMatrix, this.scale);
        return worldMatrix;
    }

    public getWorldMatrixForShader(): Float32Array {
        let worldMatrix = this.getWorldMatrix();
        let worldMatrixForShader = new Float32Array(16);
        for (let i = 0; i < 16; i++) {
            worldMatrixForShader[i] = worldMatrix[i];
        }
        return worldMatrixForShader;
    }

    public getTranslationForShader(): Float32Array {
        return new Float32Array(this.position);
    }

    public getRotationForShader(): Float32Array {
        return new Float32Array(this.rotation);
    }

    public getScaleForShader(): Float32Array {
        return new Float32Array(this.scale);
    }

    public getTranslation(): vec3 {
        return this.position;
    }

    public getRotation(): vec3 {
        return this.rotation;
    }

    public getScale(): vec3 {
        return this.scale;
    }

    public setTranslation(x: number, y: number, z: number) {
        vec3.set(this.position, x, y, z);
    }

    public setRotation(x: number, y: number, z: number) {
        vec3.set(this.rotation, x, y, z);
    }

    public setScale(x: number, y: number, z: number) {
        vec3.set(this.scale, x, y, z);
    }

    public setTranslationFromVec3(position: vec3) {
        vec3.copy(this.position, position);
    }

    public setRotationFromVec3(rotation: vec3) {
        vec3.copy(this.rotation, rotation);
    }

    public setScaleFromVec3(scale: vec3) {
        vec3.copy(this.scale, scale);
    }

    public setTransformFromTransform(transform: Transform) {
        this.setTranslationFromVec3(transform.getTranslation());
        this.setRotationFromVec3(transform.getRotation());
        this.setScaleFromVec3(transform.getScale());
    }

    public clone(): Transform {
        let transform = new Transform();
        transform.setTransformFromTransform(this);
        return transform;
    }

    public addChild(child: Transform) {
        this.children.push(child);
    }

    public removeChild(child: Transform) {
        let index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    public getChild(index: number): Transform {
        return this.children[index];
    }

    public getChildren(): Transform[] {
        return this.children;
    }

    public getChildCount(): number {
        return this.children.length;
    }

    public getParent(): Transform | null {
        return this.parent;
    }

    public setParent(parent: Transform | null) {
        this.parent = parent;

        if (parent) {
            parent.addChild(this);
        }

    }

    public toString(): string {
        return `Position: ${this.position}, Rotation: ${this.rotation}, Scale: ${this.scale}`;
    }
    
}

export default Transform;