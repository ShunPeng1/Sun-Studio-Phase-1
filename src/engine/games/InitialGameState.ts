import IStateTransitionData from "../state_machines/IStateTransitionData";
import GameState from "./GameState";

class InitialGameState extends GameState {
    public enterState(enterTransitionData: IStateTransitionData | null): void {
        
    }


    constructor() {
        super();
        
    }
} 

export default InitialGameState;