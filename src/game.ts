import Canvas from "./engine/webgl/Canvas";
import WebGLManager from "./engine/webgl/WebGLManager";
import SceneManager from "./engine/scenes/SceneManager";
import PhysicsManager from "./engine/physics/PhysicManager";
import Scene from "./engine/scenes/Scene";
import MainGameSceneContent from "./doodle-jump/scenes/MainGameSceneContent";

class Game {
    private canvas: HTMLCanvasElement;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private lastTime : number = 0;
    private deltaTime : number = 0;
    private fixedDeltaTime : number = 1/60;
    private fixedLastTime : number = 0;

    private physicsManager: PhysicsManager;


    constructor() {
        // Create canvas  
        let canvas = new Canvas('game', 600, 800);
        this.canvas = canvas.createCanvas()!;
        
        // Create Managers
        this.webGLManager = new WebGLManager(this.canvas);
        this.sceneManager = new SceneManager();
        this.physicsManager = PhysicsManager.getInstance();

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
        // TOOO: Add your scene here
        let mainScene = new Scene('main', new MainGameSceneContent(this.webGLManager, this.canvas));

        
        this.sceneManager.addScene(mainScene);
        // wait for all images to load

        await this.sceneManager.createScenesContent();

        console.log("Scene created");

        this.startGameLoop();
    }

    private startGameLoop() {
        // Load the main scene
        this.sceneManager.loadSceneByName('main');

        // Start the game loop
        this.lastTime = performance.now()/1000;
        this.fixedLastTime = this.lastTime;
        requestAnimationFrame(this.gameLoop);
    }


    private gameLoop = () : void => {
        let time = performance.now()/1000;
        
        let deltaFixedTime = time - this.fixedLastTime;
        while (this.fixedDeltaTime <= deltaFixedTime) {
            this.fixedLastTime += this.fixedDeltaTime;
            this.fixedUpdate(this.fixedLastTime, this.fixedDeltaTime);
            deltaFixedTime -= this.fixedDeltaTime;
        }

        
        this.deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.update(time, this.deltaTime);
        this.render(time, this.deltaTime);
        
        requestAnimationFrame(this.gameLoop);
    }

    private fixedUpdate(fixedLastTime: number, fixedDeltaTime : number) : void {
        // Update game objects

        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.fixedUpdate(fixedLastTime, fixedDeltaTime);
            });
        }

        this.physicsManager.checkCollisions();

        return;
    }


    private update(time: number, deltaTime : number) : void {
        // Update game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.update(time, deltaTime);
            });
        }


        return;
    }

    private render(time: number, deltaTime : number) : void {
        // Clear the screen
        this.webGLManager.clearScreen();

        // Render game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.render(time, deltaTime);
            });
        }

        return;
        
    }

}

new Game()
