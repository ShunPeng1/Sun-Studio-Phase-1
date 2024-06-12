import Canvas from "./engine/webgl/Canvas";
import WebGLManager from "./engine/webgl/WebGLManager";
import SceneManager from "./engine/scenes/SceneManager";
import Scene from "./engine/scenes/Scene";
import GameObject from "./engine/scenes/GameObject";
import MeshRenderer from "./engine/components/MeshRenderer";
import Movement from "./scripts/Movement";

class Game {
    private canvas: HTMLCanvasElement | null ;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private lastTime : number = 0;
    private deltaTime : number = 0;


    constructor() {
        // Create canvas  
        let canvas = new Canvas('game', 1600, 900);
        this.canvas = canvas.createCanvas();
        
        // Create Managers
        this.webGLManager = new WebGLManager(this.canvas);
        this.sceneManager = new SceneManager();

        // Initialize game scene
        this.initializeGameScene();

        
        this.startGameLoop();
    }
   
    private initializeGameScene() {
        // TOOO: Add your implementation here
        let mainScene = new Scene('main');

        let chickenGameObject = new GameObject('Test Object');
        chickenGameObject.transform.rotation[1] = Math.PI / 2;
        
        chickenGameObject.addComponent(new MeshRenderer(this.webGLManager, 'assets/models/chicken/chicken.json', 'assets/models/chicken/chicken.png',
            true, WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE,
            WebGLRenderingContext.NEAREST, WebGLRenderingContext.NEAREST
        ));

        chickenGameObject.addComponent(new Movement(1));

    
        mainScene.addGameObject(chickenGameObject);
        
        
        this.sceneManager.addScene(mainScene);
        
    }

    private startGameLoop() {
        // Load the main scene
        this.sceneManager.loadSceneByName('main');

        // Start the game loop
        this.lastTime = performance.now()/1000;
        requestAnimationFrame(this.gameLoop);
    }


    private gameLoop = () : void => {
        let time = performance.now()/1000;
        this.deltaTime = time - this.lastTime;
        this.lastTime = time;
        

        this.update(time, this.deltaTime);
        this.render(time, this.deltaTime);
        
        requestAnimationFrame(this.gameLoop);
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

        this.webGLManager.render(time, deltaTime);

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
