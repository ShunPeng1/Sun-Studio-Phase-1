import { mat4, vec2, vec3 } from "gl-matrix";
import Component from "./Component";

class Transform extends Component{
    

    public readonly position: vec3;
    public readonly rotation: vec3;
    public readonly scale: vec3;

    private parent: Transform | null = null;
    private readonly children: Transform[] = [];

    constructor() {
        super();
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

        // If this transform has a parent, multiply the worldMatrix by the parent's worldMatrix
        let parent = this.parent;

        while (parent) {
            worldMatrix = mat4.multiply(mat4.create(), parent.getWorldMatrix(), worldMatrix);
            parent = parent.getParent();
        }
        
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

    public getWorldPosition(): vec3 {
        let worldPosition = vec3.clone(this.position);

        let parent = this.parent;
        while (parent) {
            vec3.add(worldPosition, worldPosition, parent.position);
            parent = parent.parent;
        }

        return worldPosition;
    }
    
    public getWorldRotation(): vec3 {
        let worldRotation = vec3.clone(this.rotation);
    
        let parent = this.parent;
        while (parent) {
            vec3.add(worldRotation, worldRotation, parent.rotation);
            parent = parent.parent;
        }
    
        return worldRotation;
    }

    public getWorldScale(): vec3 {
        let worldScale = vec3.clone(this.scale);

        let parent = this.parent;
        while (parent) {
            vec3.multiply(worldScale, worldScale, parent.scale);
            parent = parent.parent;
        }

        return worldScale;
    }

    public setWorldPosition(x: number, y: number, z: number) {
        if (this.parent) {
            let parentWorldPosition = this.parent.getWorldPosition();
            vec3.set(this.position, x - parentWorldPosition[0], y - parentWorldPosition[1], z - parentWorldPosition[2]);
        } else {
            vec3.set(this.position, x, y, z);
        }
    }
    
    public setWorldRotation(x: number, y: number, z: number) {
        if (this.parent) {
            let parentWorldRotation = this.parent.getWorldRotation();
            vec3.set(this.rotation, x - parentWorldRotation[0], y - parentWorldRotation[1], z - parentWorldRotation[2]);
        } else {
            vec3.set(this.rotation, x, y, z);
        }
    }
    
    public setWorldScale(x: number, y: number, z: number) {
        if (this.parent) {
            let parentWorldScale = this.parent.getWorldScale();
            vec3.set(this.scale, x / parentWorldScale[0], y / parentWorldScale[1], z / parentWorldScale[2]);
        } else {
            vec3.set(this.scale, x, y, z);
        }
    }
    public getXYScale(): vec2{
        return vec2.fromValues(this.scale[0], this.scale[1]);
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
        
        if (parent) {
            this.parent = parent;

            parent.addChild(this);
            if (this.gameObject.getScene() !== parent.gameObject.getScene()){
                this.gameObject.setScene(parent.gameObject.getScene());
            }
        }
        else{
            if (this.gameObject.getScene() === null && this.parent && this.parent.gameObject.getScene() !== null){
                this.gameObject.setScene(this.parent.gameObject.getScene());                
            }
            
            this.parent?.removeChild(this);
        }

    }

    public toString(): string {
        return `Position: ${this.position}, Rotation: ${this.rotation}, Scale: ${this.scale}`;
    }
    
}

export default Transform;