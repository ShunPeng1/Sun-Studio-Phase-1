import IStateTransitionData from "./IStateTransitionData";



interface IState {
    enterState(enterTransitionData: IStateTransitionData | null): void;
    exitState(exitTransitionData: IStateTransitionData | null): void;
}

export default IState;