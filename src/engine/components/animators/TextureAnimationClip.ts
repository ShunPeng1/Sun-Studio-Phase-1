import Component from "../Component";
import WebGLRenderer from "../renderers/WebGLRenderer";
import AnimationState from "./AnimationState";
import IAnimationClip from "./IAnimationClip";


class TextureAnimationClip implements IAnimationClip{
    private animationState: AnimationState;
    private renderer: WebGLRenderer;
    private sequenceIndexes : number[];
    private frameRate: number;

    private isLoop: boolean;
    private isStop: boolean = false;

    private currentFrame : number = 0;
    private elapsedTime: number = 0;

    
    constructor(sequenceIndexes : number[], frameRate: number, isLoop : boolean = true){
        this.sequenceIndexes = sequenceIndexes;
        this.frameRate = frameRate;
        this.isLoop = isLoop;
    }
    
    public setRenderer(renderer : WebGLRenderer) {
        this.renderer = renderer;
    }

    public setAnimationState(animationState: AnimationState) {
        this.animationState = animationState;
        this.animationState.subscribeOnEnter(this.play.bind(this));
    }

    public play(): void {
        this.currentFrame = 0;
        this.elapsedTime = 0;
        this.renderer.useTexture(this.sequenceIndexes[this.currentFrame]);
    }

    public run(deltaTime: number): void {
        if (!this.isLoop && this.currentFrame == this.sequenceIndexes.length - 1) {
            this.stop();
            return;
        }

        this.elapsedTime += deltaTime;
        while (this.elapsedTime >= 1 / this.frameRate) {
            this.elapsedTime -= 1 / this.frameRate;
            this.currentFrame++;
            if (this.currentFrame >= this.sequenceIndexes.length) {
                this.currentFrame = 0;
            }
        }
        this.renderer.useTexture(this.sequenceIndexes[this.currentFrame]);
    }


    public stop(): void {
        if (this.isStop) {
            return;
        }
        
        this.isStop = true;
        this.animationState.exitState(null);
    }
}

export default TextureAnimationClip;