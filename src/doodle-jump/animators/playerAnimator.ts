import Component from "../../engine/components/Component";
import AnimationPredicate from "../../engine/components/animators/AnimationPredicate";
import AnimationState from "../../engine/components/animators/AnimationState";
import AnimationTransition from "../../engine/components/animators/AnimationTransition";
import Animator from "../../engine/components/animators/Animator";
import TextureAnimationClip from "../../engine/components/animators/TextureAnimationClip";
import WebGLRenderer from "../../engine/components/renderers/WebGLRenderer";
import StateMachine from "../../engine/state_machines/StateMachine";
import PlayerFeet from "../player/PlayerFeet";
import PlayerTrunk from "../player/PlayerTrunk";

class PlayerAnimator extends Animator {
    private renderer : WebGLRenderer;
    
    public idleState : PlayerIdleState;
    public jumpState : PlayerJumpState;
    public shootState : PlayerShootState;
    public shootJumpState : PlayerShootJumpState;

    private playerFeet: PlayerFeet;
    private playerTrunk: PlayerTrunk;
    
    constructor() {
        super();
    
    }

    public awake(): void {
        this.renderer = this.gameObject.getComponent<WebGLRenderer>(WebGLRenderer)!;
        this.playerFeet = this.gameObject.getComponent<PlayerFeet>(PlayerFeet)!;
        this.playerTrunk = this.gameObject.getComponent<PlayerTrunk>(PlayerTrunk)!;
    }

    
    protected createStateMachine(): StateMachine {
        let stateMachine = new StateMachine.Builder().build();


        // Define the states
        this.idleState = new PlayerIdleState(this.renderer);
        this.jumpState = new PlayerJumpState(this.renderer);
        this.shootState = new PlayerShootState(this.renderer);
        this.shootJumpState = new PlayerShootJumpState(this.renderer);

        stateMachine.addOrOverwriteState(this.idleState, new Set([
            new AnimationTransition(this.jumpState, new AnimationPredicate(() => {
                return this.playerFeet.getIsJumping();
            })),
            new AnimationTransition(this.shootState, new AnimationPredicate(() => {
                return this.playerTrunk.getIsShooting();
            })),
        ]));

        stateMachine.addOrOverwriteState(this.jumpState, new Set([
            new AnimationTransition(this.idleState, new AnimationPredicate(() => {
                return !this.playerFeet.getIsJumping();
            })),
            new AnimationTransition(this.shootJumpState, new AnimationPredicate(() => {
                return this.playerTrunk.getIsShooting();
            })),
        ]));

        stateMachine.addOrOverwriteState(this.shootState, new Set([
            new AnimationTransition(this.idleState, new AnimationPredicate(() => {
                return !this.playerTrunk.getIsShooting();
            })),
            new AnimationTransition(this.shootJumpState, new AnimationPredicate(() => {
                return this.playerFeet.getIsJumping();
            })),
        ]));

        stateMachine.addOrOverwriteState(this.shootJumpState, new Set([
            new AnimationTransition(this.idleState, new AnimationPredicate(() => {
                return !this.playerTrunk.getIsShooting();
            })),
            new AnimationTransition(this.shootState, new AnimationPredicate(() => {
                return !this.playerFeet.getIsJumping();
            })),
        ]));
        
        stateMachine.setInitialState(this.idleState, true);

        return stateMachine;
    }


    public clone(): Component {
        return new PlayerAnimator();
    }

}

class PlayerIdleState extends AnimationState {
    public clip : TextureAnimationClip;

    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip( [0], 5, false, "Player Idle");
        clip.setRenderer(renderer);
        super(clip, 1, true, true, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}

class PlayerJumpState extends AnimationState {
    public clip : TextureAnimationClip;
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip([1],10, false, "Player Jump");
        clip.setRenderer(renderer);
        super(clip, 1, true, false, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}

class PlayerShootState extends AnimationState {
    public clip : TextureAnimationClip;
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip([2],10, false, "Player Shoot");
        clip.setRenderer(renderer);
        super(clip, 1, true, false, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}

class PlayerShootJumpState extends AnimationState {
    public clip : TextureAnimationClip;
    constructor(renderer : WebGLRenderer) {
        let clip = new TextureAnimationClip([3],10, false, "Player Shoot Jump");
        clip.setRenderer(renderer);
        super(clip, 1, true, false, false, false);
        this.clip = clip;
        clip.setAnimationState(this);
    }
}



export default PlayerAnimator;