import IState from "./IState";
import IStatePredicate from "./IStatePredicate";

interface IStateTransition {
    readonly toState: IState;
    readonly condition: IStatePredicate;
}

export default IStateTransition;