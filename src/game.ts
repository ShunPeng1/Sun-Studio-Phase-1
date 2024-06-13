import Canvas from "./engine/webgl/Canvas";
import WebGLManager from "./engine/webgl/WebGLManager";
import SceneManager from "./engine/scenes/SceneManager";
import PhysicsManager from "./engine/physics/PhysicManager";
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
import ParalaxMovement from "./scripts/ParalaxMovement";
import InputManager from "./inputs/InputManager";
import LeftRightMovement from "./scripts/LeftRightMovement";
import CubeSpawner from "./scripts/CubeSpawner";
import CubeBehavior from "./scripts/CubeBehavior";
import Collider from "./engine/components/Collider";
import BoxCollider from "./engine/components/BoxCollider";

class Game {
    private canvas: HTMLCanvasElement | null ;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private lastTime : number = 0;
    private deltaTime : number = 0;
    private physicsManager: PhysicsManager;


    constructor() {
        // Create canvas  
        let canvas = new Canvas('game', 600, 800);
        this.canvas = canvas.createCanvas();
        
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

        this.startGameLoop();
    }
   
    private async initializeGameScene() {
        // TOOO: Add your implementation here
        let mainScene = new Scene('main');

        let pixelatedTextureInfo = new TextureInfo(true, WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE,
            WebGLRenderingContext.LINEAR, WebGLRenderingContext.LINEAR);


        // Create factory
        let objectFactory = new ModelReaderFactory();
        let shapeFactory = new ShapeFactory(this.webGLManager);
        
        // Create quad
        let quad = shapeFactory.createShape(ShapeType.Quad);
        

        // Add Background
        let skyBackgroundGameObject = new GameObject('Sky Background');
        vec3.set(skyBackgroundGameObject.transform.position, 0, 0, -11);
        vec3.set(skyBackgroundGameObject.transform.rotation, 0, 0, Math.PI/2);
        vec3.set(skyBackgroundGameObject.transform.scale, 40, 40, 1);


        skyBackgroundGameObject.addComponent(new PrimativeRenderer(this.webGLManager, quad, 'assets/images/super mountain/sky.png', pixelatedTextureInfo));
        
        mainScene.addGameObject(skyBackgroundGameObject);

        // Add Mountain Background Paralax
        let mountainBackgroundGameObject1 = new GameObject('Mountain Background 1');
        vec3.set(mountainBackgroundGameObject1.transform.position, 0, 0, -10);
        vec3.set(mountainBackgroundGameObject1.transform.rotation, 0, 0, Math.PI/2);
        vec3.set(mountainBackgroundGameObject1.transform.scale, 40, 40, 1);

        mountainBackgroundGameObject1.addComponent(new PrimativeRenderer(this.webGLManager, quad, 'assets/images/super mountain/mountains.png', pixelatedTextureInfo));
        
        mainScene.addGameObject(mountainBackgroundGameObject1);

        let mountainBackgroundGameObject2 = new GameObject('Mountain Background 2');
        vec3.set(mountainBackgroundGameObject2.transform.position, 80, 0, -10);
        vec3.set(mountainBackgroundGameObject2.transform.rotation, 0, 0, Math.PI/2);
        vec3.set(mountainBackgroundGameObject2.transform.scale, 40, 40, 1);

        mountainBackgroundGameObject2.addComponent(new PrimativeRenderer(this.webGLManager, quad, 'assets/images/super mountain/mountains.png', pixelatedTextureInfo));
        
        mainScene.addGameObject(mountainBackgroundGameObject2);

        let mountainParentParalax = new GameObject('Mountain Paralax');
        mountainParentParalax.addComponent(new ParalaxMovement(mountainBackgroundGameObject2, mountainBackgroundGameObject1, -15, 80, 79 ));
        mainScene.addGameObject(mountainParentParalax);

        mountainBackgroundGameObject1.transform.setParent(mountainParentParalax.transform);
        mountainBackgroundGameObject2.transform.setParent(mountainParentParalax.transform);
        
        
        
        // Add Player
        let manGameObject = new GameObject("Player");
        vec3.set(manGameObject.transform.position, 0, 2, 1);
        vec3.set(manGameObject.transform.rotation, 0, 0, Math.PI/2);
        vec3.set(manGameObject.transform.scale, 4, 4, 1);
        manGameObject.addComponent(new PrimativeRenderer(this.webGLManager, quad, 'assets/images/doodle/player/tile000.png', pixelatedTextureInfo));
        
        manGameObject.addComponent(new LeftRightMovement(100));
        mainScene.addGameObject(manGameObject);


        

        
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

        this.physicsManager.checkCollisions();

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
