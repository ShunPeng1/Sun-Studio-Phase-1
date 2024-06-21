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
import StartGameState from "./StartGameState";
import LateUpdateGameState from "./LateUpdateGameState";

class ShunGameEngine {
    // Scene
    private gameSceneCollection: IGameSceneCollection;

    // Time variables
    private lastTime : number = 0;
    
    // Managers
    private canvasManager: CanvasManager;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private physicsManager: PhysicsManager;
    private inputManager: InputManager;

    // State Machine
    private stateMachine: BaseStateMachine;
    private initialGameState: InitialGameState;
    private startGameState: StartGameState;
    private fixedUpdateGameState: FixedUpdateGameState;
    private updateGameState: UpdateGameState;
    private lateUpdateGameState: LateUpdateGameState;
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
        this.startGameState = new StartGameState();
        this.fixedUpdateGameState = new FixedUpdateGameState();
        this.updateGameState = new UpdateGameState();
        this.lateUpdateGameState = new LateUpdateGameState();
        this.renderGameState = new RenderGameState();

        this.stateMachine.addOrOverwriteState(this.initialGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.startGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.fixedUpdateGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.updateGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.renderGameState, new Set());
        this.stateMachine.addOrOverwriteState(this.lateUpdateGameState, new Set());

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
        this.sceneManager.nextFrame();

        let time = performance.now()/1000;
        
        let deltaTime = time - this.lastTime;
        // if (deltaTime <= 1/60) {
        //     requestAnimationFrame(this.gameLoop);
        //     return
        // }
        this.lastTime = time;
        
        this.stateMachine.setToState(this.startGameState, new TimeGameTransitionData(time, deltaTime));
        this.stateMachine.setToState(this.fixedUpdateGameState, new TimeGameTransitionData(time, deltaTime));
        this.stateMachine.setToState(this.updateGameState, new TimeGameTransitionData(time, deltaTime));
        this.stateMachine.setToState(this.lateUpdateGameState, new TimeGameTransitionData(time, deltaTime));
        this.stateMachine.setToState(this.renderGameState, new TimeGameTransitionData(time, deltaTime));
        requestAnimationFrame(this.gameLoop);
    }

}


export default ShunGameEngine;