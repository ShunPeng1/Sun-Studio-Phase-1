import IState from "../../state_machines/IState";
import IStateTransitionData from "../../state_machines/IStateTransitionData";
import IAnimationClip from "./IAnimationClip";

class AnimationState implements IState {
    private onEnterListeners: Array<(data: IStateTransitionData | null) => void> = [];
    private onExitListeners: Array<(data: IStateTransitionData | null) => void> = [];

    private animationClip: IAnimationClip;
    private speed : number = 1;
    private isAutoPlay : boolean = true;
    private isLoop : boolean = true;
    private canEndBeforeLastIndex : boolean = false;
    private canTransitOnEnd : boolean = false;
    
    constructor(animationClip: IAnimationClip, speed : number = 1, isAutoPlay : boolean = true, isLoop : boolean = true, canEndBeforeLastIndex : boolean = false, canTransitOnEnd : boolean = false){
        this.animationClip = animationClip;
        this.speed = speed;
        this.isAutoPlay = isAutoPlay;
        this.isLoop = isLoop;
        this.canEndBeforeLastIndex = canEndBeforeLastIndex;
        this.canTransitOnEnd = canTransitOnEnd;
    }

    public update(deltaTime: number): void {
        this.animationClip.run(deltaTime * this.speed);
    }

    public subscribeOnEnter(listener: (data: IStateTransitionData | null) => void): void {
        this.onEnterListeners.push(listener);
    }

    public unsubscribeOnEnter(listener: (data: IStateTransitionData | null) => void): void {
        const index = this.onEnterListeners.indexOf(listener);
        if (index > -1) {
            this.onEnterListeners.splice(index, 1);
        }
    }

    public subscribeOnExit(listener: (data: IStateTransitionData | null) => void): void {
        this.onExitListeners.push(listener);
    }

    public unsubscribeOnExit(listener: (data: IStateTransitionData | null) => void): void {
        const index = this.onExitListeners.indexOf(listener);
        if (index > -1) {
            this.onExitListeners.splice(index, 1);
        }
    }

    enterState(enterTransitionData: IStateTransitionData | null): void {
        this.onEnterListeners.forEach(listener => listener(enterTransitionData));
    
    }
    exitState(exitTransitionData: IStateTransitionData | null): void {
        this.onExitListeners.forEach(listener => listener(exitTransitionData));
    }

}

export default AnimationState;