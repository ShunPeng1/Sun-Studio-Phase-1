// Remove the duplicate class declaration


import Component from "../../engine/components/Component";
import AnimationPredicate from "../../engine/components/animators/AnimationPredicate";
import AnimationState from "../../engine/components/animators/AnimationState";
import AnimationTransition from "../../engine/components/animators/AnimationTransition";
import Animator from "../../engine/components/animators/Animator";
import TextureAnimationClip from "../../engine/components/animators/TextureAnimationClip";
import Collider from "../../engine/components/physics/Collider";
import WebGLRenderer from "../../engine/components/renderers/WebGLRenderer";
import StateMachine from "../../engine/state_machines/StateMachine";
import BounceUpPlatform from "../platforms/BounceUpPlatform";


class SpringAnimator extends Animator {
    private renderer : WebGLRenderer;
    private bounceUpPlatform : BounceUpPlatform;
    
    public idleState : AnimationState;
    public bounceState : AnimationState;

    private bounceListener: (other: Collider) => void;


    public awake(): void {
        this.renderer = this.gameObject.getComponent<WebGLRenderer>(WebGLRenderer)!;
        this.bounceUpPlatform = this.gameObject.getComponent<BounceUpPlatform>(BounceUpPlatform)!;

        this.bounceListener = this.setToBounceState.bind(this);
        
        this.bounceUpPlatform.onBounce(this.bounceListener);
    }

    public update(time: number, deltaTime: number): void {
        super.update(time, deltaTime);
    }

    private setToBounceState() {
        this.stateMachine.setToState(this.bounceState);
        
    }
    
    protected createStateMachine(): StateMachine {
        let stateMachine = new StateMachine.Builder().build();


        // Define the states
        this.idleState = new SpringIdleState(this.renderer);
        
        this.bounceState = new SpringBounceState(this.renderer);
        stateMachine.addOrOverwriteState(this.bounceState, new Set())
    
        stateMachine.addOrOverwriteState(this.idleState, new Set());

        stateMachine.setInitialState(this.idleState, true);

        return stateMachine;
    }



    public clone(): Component {
        return new SpringAnimator();
    }

}

class SpringIdleState extends AnimationState {
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip( [0], 1, false);
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        clip.setAnimationState(this);
    }
}

class SpringBounceState extends AnimationState {
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip([1], 1, false);
        clip.setRenderer(renderer);
        super(clip, 1, true, false, false, false);
        clip.setAnimationState(this);
    }
}

export default SpringAnimator;