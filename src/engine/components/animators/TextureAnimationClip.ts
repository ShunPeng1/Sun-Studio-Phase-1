import Component from "../Component";
import Renderer from "../renderers/Renderer";
import IAnimationClip from "./IAnimationClip";


class TextureAnimationClip implements IAnimationClip{
    private static nextId = 1;
    private id: number;
    private renderer: Renderer;
    private sequenceIndexes : number[];

    private currentFrame : number = 0;

    
    constructor(sequenceIndexes : number[]){
        this.sequenceIndexes = sequenceIndexes;
        this.id = TextureAnimationClip.nextId++;
        
    }
    
    public setRenderer(renderer : Renderer) {
        this.renderer = renderer;
    }

    public play(): void {
        this.currentFrame = 0;
        this.renderer.useTexture(this.sequenceIndexes[this.currentFrame]);
    }

    public run(deltaTime: number): void {
        this.currentFrame++;
        if (this.currentFrame >= this.sequenceIndexes.length) {
            this.currentFrame = 0;
        }
        this.renderer.useTexture(this.sequenceIndexes[this.currentFrame]);
    }

    public stop(): void {
        this.currentFrame = 0;
        this.renderer.useTexture(this.sequenceIndexes[this.currentFrame]);
    }
    
}

export default TextureAnimationClip;