import PhysicManager from "../physics/PhysicManager";
import SceneManager from "../scenes/SceneManager";
import GameState from "./GameState";
import TimeGameTransitionData from "./TimeGameTransitionData";

class FixedUpdateGameState extends GameState {
    private sceneManager: SceneManager;
    private physicsManager: PhysicManager;

    private fixedDeltaTime : number;

    private fixedLastTime : number = 0;

    constructor(fixedDeltaTime : number = 1/60) {
        super();
        this.sceneManager = SceneManager.getInstance();
        this.physicsManager = PhysicManager.getInstance();

        this.fixedDeltaTime = fixedDeltaTime;
    }

    public enterState(enterTransitionData: TimeGameTransitionData): void {
        // Update game objects

        let deltaFixedTime = enterTransitionData.time - this.fixedLastTime;
        
        while (this.fixedDeltaTime <= deltaFixedTime) {
            this.fixedLastTime += this.fixedDeltaTime;
            
            this.fixedUpdate(this.fixedLastTime, this.fixedDeltaTime);

            deltaFixedTime -= this.fixedDeltaTime;
        }
        
        return;
    }

    private fixedUpdate(time: number, deltaTime: number): void {
        // Update game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getCurrentFrameGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.fixedUpdate(time, deltaTime);
            });
        }

        this.physicsManager.checkCollisions();

        return;
    }


}

export default FixedUpdateGameState;