import SceneManager from "../scenes/SceneManager";
import GameState from "./GameState";
import TimeGameTransitionData from "./TimeGameTransitionData";
import CanvasManager from "../canvas/CanvasManager";
import WebGLManager from "../webgl/WebGLManager";

class RenderGameState extends GameState {
    private sceneManager: SceneManager;
    private canvasManager: CanvasManager;
    private webGLManager: WebGLManager;

    constructor() {
        super();
        this.sceneManager = SceneManager.getInstance();
        this.canvasManager = CanvasManager.getInstance();
        this.webGLManager = WebGLManager.getInstance();
    }

    public enterState(enterTransitionData: TimeGameTransitionData): void {
        this.render(enterTransitionData.time, enterTransitionData.deltaTime);
    }

    private render(time: number, deltaTime: number): void {
        // Clear the screen
        this.canvasManager.clearRect();
        this.webGLManager.clearScreen();

        // Render game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getCurrentFrameGameObjects();

        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.render(time, deltaTime);
            });
        }

        return;
    }
}

export default RenderGameState;