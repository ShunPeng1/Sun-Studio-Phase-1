import WoodenPlatform from "../../../scripts/platforms/WoodenPlatform";
import IStateTransition from "../../state_machines/IStateTransition";
import StateMachine from "../../state_machines/StateMachine";
import Component from "../Component";

abstract class Animator extends Component {
    private stateMachine : StateMachine 
    constructor(){
        super();

        this.stateMachine = new StateMachine.Builder()
            .build();
    }

    public awake(): void {
        this.stateMachine = this.createStateMachine();
    }

    protected abstract createStateMachine(): StateMachine;
    
    
    public update(deltaTime : number): void {
        let test = this.gameObject.getComponent<WoodenPlatform>(WoodenPlatform)!.isBroken;
        console.log(test);
        this.stateMachine.update(deltaTime);
    }


}

export default Animator;