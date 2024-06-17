import Component from "../Component";
import AnimationState from "./AnimationState";


interface IAnimationClip{
    
    play(): void;

    run(deltaTime: number): void;

    stop(): void ;
}



export default IAnimationClip;