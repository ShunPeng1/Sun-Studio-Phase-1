import IState from "../state_machines/IState";
import IStateTransition from "../state_machines/IStateTransition";
import IStateTransitionData from "../state_machines/IStateTransitionData";

class TimeGameTransitionData implements IStateTransitionData{
    public fromState: IState;
    public transition: IStateTransition;


    public time: number;
    public deltaTime: number;

    constructor(time: number, deltaTime: number) {
        this.time = time;
        this.deltaTime = deltaTime;
    }

    castTo<T extends IStateTransitionData>(): T {
        return this as unknown as T;
    }

}

export default TimeGameTransitionData;