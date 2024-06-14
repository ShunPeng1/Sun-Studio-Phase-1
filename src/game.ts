import Canvas from "./engine/webgl/Canvas";
import WebGLManager from "./engine/webgl/WebGLManager";
import SceneManager from "./engine/scenes/SceneManager";
import PhysicsManager from "./engine/physics/PhysicManager";
import Scene from "./engine/scenes/Scene";
import GameObject from "./engine/scenes/GameObject";
import MeshRenderer from "./engine/components/MeshRenderer";
import Movement from "./scripts/deprecate/Movement";
import TextureInfo from "./engine/webgl/textures/TextureInfo";
import ModelReaderFactory from "./engine/webgl/factories/ModelReaderFactory";
import ReaderResult from "./engine/webgl/readers/ReaderResult";
import ShapeFactory from "./engine/webgl/factories/ShapeFactory";
import { vec3 } from "gl-matrix";
import PrimativeRenderer from "./engine/components/PremadeRenderer";
import ShapeType from "./engine/webgl/shapes/ShapeType";
import InputManager from "./inputs/InputManager";
import LeftRightMovement from "./scripts/movement/LeftRightMovement";
import Collider from "./engine/components/Collider";
import BoxCollider from "./engine/components/BoxCollider";
import Rigidbody from "./engine/components/Rigidbody";
import BouncePlatform from "./scripts/platforms/BouncePlatform";
import XBoundTeleportation from "./scripts/movement/XBoundTeleportation";
import PlatformSpawner from "./scripts/platforms/PlatformSpawner";
import PlatformSpawnInfo from "./scripts/platforms/PlatformSpawnInfo";
import MaxFollowerMovement from "./scripts/movement/FollowerMovement";
import CameraRenderer from "./engine/components/CameraRenderer";
import JumpColliderIgnorance from "./scripts/JumpColliderIgnorance";

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
        
        
        
            



        // Platform
        let platform = new GameObject("Platform");
        vec3.set(platform.transform.position, 0, -20, 0);
        vec3.set(platform.transform.rotation, 0, 0, 0);
        vec3.set(platform.transform.scale, 4, 2, 1);
        platform.addComponent(new PrimativeRenderer(this.webGLManager, quad, 'assets/images/doodle/atlas/platform0.png', pixelatedTextureInfo));
        platform.addComponent(new BoxCollider(0, 1, 2, 1));
        platform.addComponent(new BouncePlatform(4000));
        
        
        mainScene.addGameObject(platform);
        
        // Add Player
        let playerGameObject = new GameObject("Player");
        vec3.set(playerGameObject.transform.position, 0, 2, 1);
        vec3.set(playerGameObject.transform.rotation, 0, 0, 0);
        vec3.set(playerGameObject.transform.scale, 4, 4, 1);
        playerGameObject.addComponent(new PrimativeRenderer(this.webGLManager, quad, 'assets/images/doodle/player/tile000.png', pixelatedTextureInfo));
        playerGameObject.addComponent(new BoxCollider(0, 0, 1, 1));
        playerGameObject.addComponent(new Rigidbody(1.1, 110))
        playerGameObject.addComponent(new LeftRightMovement(50));
        playerGameObject.addComponent(new JumpColliderIgnorance());
        mainScene.addGameObject(playerGameObject);
        
        

        
        // Add Camera
        let camera = new GameObject('Camera');
        vec3.set(camera.transform.position, 0, 0, 55);
        vec3.set(camera.transform.rotation, 0, 0, 0);
        vec3.set(camera.transform.scale, 1, 1, 1);
        
        camera.addComponent(new CameraRenderer(this.webGLManager, this.canvas));
        camera.addComponent(new XBoundTeleportation(playerGameObject, 0, 25));
        camera.addComponent(new MaxFollowerMovement(playerGameObject, false, true, false));
        
        mainScene.addGameObject(camera);

        
        // Add Background
        let paperBackground = new GameObject('Background 1');
        vec3.set(paperBackground.transform.position, 0, 40, -65);
        vec3.set(paperBackground.transform.rotation, 0, 0, 0);
        vec3.set(paperBackground.transform.scale, 30, 80, 1);

        paperBackground.addComponent(new PrimativeRenderer(this.webGLManager, quad, 'assets/images/doodle/atlas2/background.png', pixelatedTextureInfo));
        
        mainScene.addGameObject(paperBackground)
        paperBackground.transform.setParent(camera.transform);

        // Add Spawner
        let spawner = new GameObject('Spawner');
        spawner.addComponent(new PlatformSpawner([
            new PlatformSpawnInfo(platform, 1)
        ], 80, [-20,20], [9,15]));
        spawner.addComponent(new MaxFollowerMovement(playerGameObject, false, true, false));
        
        spawner.transform.position[1] = -20;
        
        mainScene.addGameObject(spawner);
        

        
        this.sceneManager.addScene(mainScene);
        
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
