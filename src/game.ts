import Canvas from "./engine/webgl/Canvas";
import WebGLManager from "./engine/webgl/WebGLManager";
import SceneManager from "./engine/scenes/SceneManager";
import Scene from "./engine/scenes/Scene";
import GameObject from "./engine/scenes/GameObject";
import MeshRenderer from "./engine/components/MeshRenderer";
import Movement from "./scripts/Movement";
import TextureInfo from "./engine/webgl/textures/TextureInfo";
import ModelReaderFactory from "./engine/webgl/factories/ModelReaderFactory";
import ReaderResult from "./engine/webgl/readers/ReaderResult";
import ShapeFactory from "./engine/webgl/factories/ShapeFactory";
import { vec3 } from "gl-matrix";
import PrimativeRenderer from "./engine/components/PremadeRenderer";
import ShapeType from "./engine/webgl/shapes/ShapeType";

class Game {
    private canvas: HTMLCanvasElement | null ;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private lastTime : number = 0;
    private deltaTime : number = 0;


    constructor() {
        // Create canvas  
        let canvas = new Canvas('game', 600, 800);
        this.canvas = canvas.createCanvas();
        
        // Create Managers
        this.webGLManager = new WebGLManager(this.canvas);
        this.sceneManager = new SceneManager();

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

        this.startGameLoop();
    }
   
    private async initializeGameScene() {
        // TOOO: Add your implementation here
        let mainScene = new Scene('main');

        let pixelatedTextureInfo = new TextureInfo(true, WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE,
            WebGLRenderingContext.NEAREST, WebGLRenderingContext.NEAREST);

        // Create factory
        let objectFactory = new ModelReaderFactory();
        let shapeFactory = new ShapeFactory(this.webGLManager);
        
        // Create the chicken game object
        let result = await objectFactory.createModel('assets/models/chicken/chicken.json');

        let chickenGameObject = new GameObject('Chicken Player');
        chickenGameObject.transform.rotation[1] = Math.PI / 2;

        chickenGameObject.addComponent(new MeshRenderer(this.webGLManager, result.meshes[0], 
            'assets/models/chicken/chicken.png', pixelatedTextureInfo));

        mainScene.addGameObject(chickenGameObject);


        // Add Background
        let skyBackgroundGameObject = new GameObject('Sky Background');
        vec3.set(skyBackgroundGameObject.transform.position, -50, 0, -10);
        vec3.set(skyBackgroundGameObject.transform.scale, 10, 10, 10);

        let skyquad = shapeFactory.createShape(ShapeType.Quad);

        skyBackgroundGameObject.addComponent(new PrimativeRenderer(this.webGLManager, skyquad,
            'assets/images/super mountain/sky.png', pixelatedTextureInfo));

        mainScene.addGameObject(skyBackgroundGameObject);

        let mountainBackgroundGameObject = new GameObject(' Mountain Background');
        vec3.set(mountainBackgroundGameObject.transform.position, 50, 0, -10);
        vec3.set(mountainBackgroundGameObject.transform.scale, 10, 10, 10);

        let mountainQuad = shapeFactory.createShape(ShapeType.Quad);

        mountainBackgroundGameObject.addComponent(new PrimativeRenderer(this.webGLManager, mountainQuad,
            'assets/images/super mountain/mountains.png', pixelatedTextureInfo));

        mainScene.addGameObject(mountainBackgroundGameObject);


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
