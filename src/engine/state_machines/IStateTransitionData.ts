import IState from "./IState";
import IStateTransition from "./IStateTransition";

interface IStateTransitionData {
    fromState: IState;
    transition: IStateTransition;

    castTo<T extends IStateTransitionData>(): T;
}

export default IStateTransitionData;