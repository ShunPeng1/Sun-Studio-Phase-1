import Component from "../../engine/components/Component";
import AnimationPredicate from "../../engine/components/animators/AnimationPredicate";
import AnimationState from "../../engine/components/animators/AnimationState";
import AnimationTransition from "../../engine/components/animators/AnimationTransition";
import Animator from "../../engine/components/animators/Animator";
import TextureAnimationClip from "../../engine/components/animators/TextureAnimationClip";
import WebGLRenderer from "../../engine/components/renderers/WebGLRenderer";
import StateMachine from "../../engine/state_machines/StateMachine";


class JetpackWearableAnimator extends Animator {
    private renderer : WebGLRenderer;
    
    private accelerateState : JetpackWearableAccelerateState;
    private decelerateState : JetpackWearableDecelerateState;
    private runningState : JetpackWearableRunningState;
    private endState : JetpackWearableEndState;

    private travelingTime : number;
    
    constructor(travelingTime :number) {
        super();
        this.travelingTime = travelingTime;
    }

    public awake(): void {
        this.renderer = this.gameObject.getComponent<WebGLRenderer>(WebGLRenderer)!;
    }

    protected onEnable(): void {
        if (!this.stateMachine)
            return;

        console.log("on enable");
        this.stateMachine.setToState(this.accelerateState);
    }
    
    protected createStateMachine(): StateMachine {
        let stateMachine = new StateMachine.Builder().build();

        // Define the states
        this.accelerateState = new JetpackWearableAccelerateState(this.renderer);
        this.decelerateState = new JetpackWearableDecelerateState(this.renderer);
        this.endState = new JetpackWearableEndState(this.renderer);

        let runningTime = this.travelingTime - this.accelerateState.clip.getEstimatedDuration() - this.decelerateState.clip.getEstimatedDuration();
        
        console.log("running time: " + runningTime, this.travelingTime, this.accelerateState.clip.getEstimatedDuration(), this.decelerateState.clip.getEstimatedDuration());
        
        this.runningState = new JetpackWearableRunningState(this.renderer, runningTime);

        
        stateMachine.addOrOverwriteState(this.accelerateState, new Set([new AnimationTransition(this.runningState, new AnimationPredicate(() => {
            return this.accelerateState.clip.getIsStop();
        }))]));
        
        stateMachine.addOrOverwriteState(this.runningState, new Set([new AnimationTransition(this.decelerateState, new AnimationPredicate(() => {
            return this.runningState.clip.getIsStop();
        }))]));

        stateMachine.addOrOverwriteState(this.decelerateState, new Set([new AnimationTransition(this.endState, new AnimationPredicate(() => {
            return this.decelerateState.clip.getIsStop();
        }))]));

        stateMachine.addOrOverwriteState(this.endState, new Set());

        stateMachine.setInitialState(this.accelerateState, true);

        return stateMachine;
    }


    public clone(): Component {
        return new JetpackWearableAnimator(this.travelingTime);
    }

}

class JetpackWearableAccelerateState extends AnimationState {
    public clip : TextureAnimationClip;

    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip( [0,1,2], 6, false, "Jetpack Accelerate");
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}

class JetpackWearableDecelerateState extends AnimationState {
    public clip : TextureAnimationClip;

    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip( [6,7,8], 6, false, "Jetpack Decelerate");
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}

class JetpackWearableRunningState extends AnimationState {
    public clip : TextureAnimationClip;
    constructor(renderer : WebGLRenderer, duration: number) {
        let clip = new TextureAnimationClip( [3,4,5], 6, true, "Jetpack Running", duration);
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}

class JetpackWearableEndState extends AnimationState {
    public clip : TextureAnimationClip;
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip( [9], 6, true, "Jetpack End");
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}

export default JetpackWearableAnimator;