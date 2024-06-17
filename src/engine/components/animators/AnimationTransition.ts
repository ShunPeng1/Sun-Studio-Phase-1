import IState from "../../state_machines/IState";
import IStatePredicate from "../../state_machines/IStatePredicate";
import IStateTransition from "../../state_machines/IStateTransition";
import AnimationPredicate from "./AnimationPredicate";
import AnimationState from "./AnimationState";

class AnimationTransition implements IStateTransition {
    public toState: AnimationState;
    public condition: AnimationPredicate;


    constructor(toState: AnimationState, condition: AnimationPredicate) {
        this.toState = toState;
        this.condition = condition;
    }
    
}

export default AnimationTransition;