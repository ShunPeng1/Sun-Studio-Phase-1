import Component from "../../engine/components/Component";
import AnimationPredicate from "../../engine/components/animators/AnimationPredicate";
import AnimationState from "../../engine/components/animators/AnimationState";
import AnimationTransition from "../../engine/components/animators/AnimationTransition";
import Animator from "../../engine/components/animators/Animator";
import TextureAnimationClip from "../../engine/components/animators/TextureAnimationClip";
import WebGLRenderer from "../../engine/components/renderers/WebGLRenderer";
import StateMachine from "../../engine/state_machines/StateMachine";


class StarAnimator extends Animator {
    private renderer : WebGLRenderer;
    
    public spinState : AnimationState;
    
    constructor() {
        super();
    
    }

    public awake(): void {
        this.renderer = this.gameObject.getComponent<WebGLRenderer>(WebGLRenderer)!;
    }

    
    protected createStateMachine(): StateMachine {
        let stateMachine = new StateMachine.Builder().build();


        // Define the states
        this.spinState = new StarSpinState(this.renderer);
        
        stateMachine.addOrOverwriteState(this.spinState, new Set())
        

        stateMachine.setInitialState(this.spinState, true);

        return stateMachine;
    }


    public clone(): Component {
        return new StarAnimator();
    }

}

class StarSpinState extends AnimationState {
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip( [0,1,2], 10, true,  "Star Spin");
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        clip.setAnimationState(this);
    }
}



export default StarAnimator;