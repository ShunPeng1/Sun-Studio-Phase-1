import Component from "../Component";
import WebGLRenderer from "../renderers/WebGLRenderer";
import AnimationState from "./AnimationState";
import IAnimationClip from "./IAnimationClip";


class TextureAnimationClip implements IAnimationClip{
    private animationState: AnimationState;
    private renderer: WebGLRenderer;

    private clipName: string;

    private sequenceIndexes : number[];
    private frameRate: number;

    private isLoop: boolean;
    private isStop: boolean = false;

    private currentFrame : number = 0;
    private elapsedTime: number = 0;

    private currentTime: number = 0;
    private maxDuration: number = 0;
    
    constructor(sequenceIndexes : number[], frameRate: number, isLoop : boolean = true,clipName :string = "",  maxDuration : number = Infinity){
        this.sequenceIndexes = sequenceIndexes;
        this.frameRate = frameRate;
        this.clipName = clipName;
        this.isLoop = isLoop;
        this.maxDuration = maxDuration;
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
        this.isStop = false;
        this.currentTime = 0;
        this.renderer.useTexture(this.sequenceIndexes[this.currentFrame]);
    }

    public run(deltaTime: number): void {
        if (this.isStop) {
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

        if (!this.isLoop && this.currentFrame == this.sequenceIndexes.length - 1 ) {
            this.stop();
        }
        
        this.currentTime += deltaTime;
        if (this.currentTime >= this.maxDuration) {
            this.stop();
        }
    }


    public stop(): void {
        if (this.isStop) {
            return;
        }
        
        this.isStop = true;
    }

    public getIsStop(): boolean {
        return this.isStop;
    }

    public getEstimatedDuration(): number {
        return this.sequenceIndexes.length / this.frameRate;
    }
}

export default TextureAnimationClip;