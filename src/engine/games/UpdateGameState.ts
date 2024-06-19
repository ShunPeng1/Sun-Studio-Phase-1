import SceneManager from "../scenes/SceneManager";
import GameState from "./GameState";
import TimeGameTransitionData from "./TimeGameTransitionData";

class UpdateGameState extends GameState {
    private sceneManager: SceneManager;

    constructor() {
        super();
        this.sceneManager = SceneManager.getInstance();
    }

    public enterState(enterTransitionData: TimeGameTransitionData): void {
        // Update game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.update(enterTransitionData.time, enterTransitionData.deltaTime);
            });
        }

        return;
    }
    
}

export default UpdateGameState;