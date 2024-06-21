import SceneManager from "../scenes/SceneManager";
import GameState from "./GameState";
import TimeGameTransitionData from "./TimeGameTransitionData";

class LateUpdateGameState extends GameState {
    private sceneManager: SceneManager;

    constructor() {
        super();
        this.sceneManager = SceneManager.getInstance();
    }

    public enterState(enterTransitionData: TimeGameTransitionData): void {
        // Update game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getCurrentFrameGameObjects();
        
        if (currentSceneGameObjects) {

            currentSceneGameObjects.forEach(gameObject => {
                gameObject.lateUpdate(enterTransitionData.time, enterTransitionData.deltaTime);
            });
        }

        return;
    }
    
}

export default LateUpdateGameState;