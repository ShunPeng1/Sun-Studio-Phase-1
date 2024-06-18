import Component from "../../engine/components/Component";
import AnimationPredicate from "../../engine/components/animators/AnimationPredicate";
import AnimationState from "../../engine/components/animators/AnimationState";
import AnimationTransition from "../../engine/components/animators/AnimationTransition";
import Animator from "../../engine/components/animators/Animator";
import TextureAnimationClip from "../../engine/components/animators/TextureAnimationClip";
import WebGLRenderer from "../../engine/components/renderers/WebGLRenderer";
import StateMachine from "../../engine/state_machines/StateMachine";
import WoodenPlatform from "../platforms/WoodenPlatform";

class WoodenPlatformAnimator extends Animator {
    private renderer : WebGLRenderer;
    
    public idleState : AnimationState;
    public breakingState : AnimationState;
    constructor() {
        super();
    
    }

    public awake(): void {
        this.renderer = this.gameObject.getComponent<WebGLRenderer>(WebGLRenderer)!;
        super.awake();
    }

    
    protected createStateMachine(): StateMachine {
        let stateMachine = new StateMachine.Builder().build();


        // Define the states
        this.idleState = new WoodenIdleState(this.renderer);
        
        this.breakingState = new WoodenBreakingState(this.renderer);
        stateMachine.addOrOverwriteState(this.breakingState, new Set())
        
        

        let idleTransition = new AnimationTransition(this.breakingState, new AnimationPredicate(() => {
            return this.gameObject.getComponent<WoodenPlatform>(WoodenPlatform)?.isBroken || false;
        }));
        stateMachine.addOrOverwriteState(this.idleState, new Set([idleTransition]));



        stateMachine.setInitialState(this.idleState, true);

        return stateMachine;
    }


    public clone(): Component {
        return new WoodenPlatformAnimator();
    }

}

class WoodenIdleState extends AnimationState {
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip( [0], 5, false);
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        clip.setAnimationState(this);
    }
}

class WoodenBreakingState extends AnimationState {
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip([0,1,2,3],10, false);
        clip.setRenderer(renderer);
        super(clip, 1, true, false, false, false);
        clip.setAnimationState(this);
    }
}

export default WoodenPlatformAnimator;