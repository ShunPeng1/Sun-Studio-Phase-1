import IState from "../state_machines/IState";
import IStateTransitionData from "../state_machines/IStateTransitionData";

abstract class GameState implements IState {

    
    public abstract enterState(enterTransitionData: IStateTransitionData | null): void;


    public exitState(exitTransitionData: IStateTransitionData | null): void {
        
    }
    public update(deltaTime: number, transitionData: IStateTransitionData | null): void{
        
    }
}

export default GameState;