import CanvasManager from "../canvas/CanvasManager";
import WebGLManager from "../webgl/WebGLManager";
import SceneManager from "../scenes/SceneManager";
import PhysicsManager from "../physics/PhysicManager";
import Scene from "../scenes/Scene";
import InputManager from "../inputs/InputManager";
import BaseStateMachine from "../state_machines/StateMachine";
import UpdateGameState from "./UpdateGameState";
import FixedUpdateGameState from "./FixedUpdateGameState";
import RenderGameState from "./RenderGameState";
import TimeGameTransitionData from "./TimeGameTransitionData";
import IGameSceneCollection from "../scenes/IGameSceneCollection";
import InitialGameState from "./InitialGameState";

class ShunGameEngine {
    // Scene
    private gameSceneCollection: IGameSceneCollection;

    // Time variables
    private lastTime : number = 0;
    private deltaTime : number = 0;
    
    // Managers
    private canvasManager: CanvasManager;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private physicsManager: PhysicsManager;
    private inputManager: InputManager;

    // State Machine
    private stateMachine: BaseStateMachine;
    private initialGameState: InitialGameState;
    private fixedUpdateGameState: FixedUpdateGameState;
    private updateGameState: UpdateGameState;
    private renderGameState: RenderGameState;


    constructor(gameSceneCollection: IGameSceneCollection, width: number, height: number) {
        this.gameSceneCollection = gameSceneCollection;
        
        // Create canvas  
        this.canvasManager = CanvasManager.createInstance(width, height);
        
        // Create Managers
        this.webGLManager = WebGLManager.getInstance();
        this.sceneManager = SceneManager.getInstance();
        this.physicsManager = PhysicsManager.getInstance();
        this.inputManager = InputManager.getInstance();

        // Create State Machine
        this.stateMachine = new BaseStateMachine.Builder().build();
        this.initialGameState = new InitialGameState();
        this.fixedUpdateGameState = new FixedUpdateGameState();
        this.updateGameState = new UpdateGameState();
        this.renderGameState = new RenderGameState();

        this.stateMachine.addOrOverwriteState(this.initialGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.fixedUpdateGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.updateGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.renderGameState, new Set());

        this.stateMachine.setInitialState(this.initialGameState, true);

        this.initialize();
        
    }

    public async initialize() {
        // Initialize game scene
        try {
            await this.initializeGameScene();
            // existing code...
        } catch (error) {
            console.error('Error initializing game scene:', error);
        }

    }
   
    private async initializeGameScene() {
        
        let scenes = this.gameSceneCollection.createScenes();
        scenes.forEach(scene => {
            this.sceneManager.addScene(scene);
        });
        
        // wait for all images to load

        await this.sceneManager.downloadScenesContent();

        // Set the first scene
        this.sceneManager.setNextScene(this.gameSceneCollection.setStartScene());

        this.startGameLoop();
    }

    private startGameLoop() {
        // Start the game loop
        this.lastTime = performance.now()/1000;
        requestAnimationFrame(this.gameLoop);
    }


    private gameLoop = () : void => {
        this.sceneManager.loadNextScene();

        let time = performance.now()/1000;
        
        this.deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.stateMachine.SetToState(new FixedUpdateGameState(), new TimeGameTransitionData(time, this.deltaTime));
        this.stateMachine.SetToState(new UpdateGameState(), new TimeGameTransitionData(time, this.deltaTime));
        this.stateMachine.SetToState(new RenderGameState(), new TimeGameTransitionData(time, this.deltaTime));
        
        requestAnimationFrame(this.gameLoop);
    }

}


export default ShunGameEngine;