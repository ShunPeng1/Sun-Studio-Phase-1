import SceneManager from "../scenes/SceneManager";
import GameState from "./GameState";
import TimeGameTransitionData from "./TimeGameTransitionData";

class StartGameState extends GameState {
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
                gameObject.start();
            });
        }

        return;
    }
    
}

export default StartGameState;