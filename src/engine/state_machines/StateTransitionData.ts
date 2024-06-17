import IState from "./IState";
import IStateTransition from "./IStateTransition";
import IStateTransitionData from "./IStateTransitionData";

class StateTransitionData implements IStateTransitionData{
    fromState: IState;
    transition: IStateTransition;
    castTo<T extends IStateTransitionData>(): T {
        throw new Error("Method not implemented.");
    }

}

export default StateTransitionData;