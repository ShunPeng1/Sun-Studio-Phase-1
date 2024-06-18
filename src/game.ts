import Canvas from "./engine/webgl/Canvas";
import WebGLManager from "./engine/webgl/WebGLManager";
import SceneManager from "./engine/scenes/SceneManager";
import PhysicsManager from "./engine/physics/PhysicManager";
import Scene from "./engine/scenes/Scene";
import GameObject from "./engine/gameobjects/GameObject";
import MeshRenderer from "./engine/components/renderers/MeshRenderer";
import Movement from "./doodle-jump/deprecate/Movement";
import TextureInfo from "./engine/webgl/textures/TextureInfo";
import ModelReaderFactory from "./engine/webgl/factories/ModelReaderFactory";
import ReaderResult from "./engine/webgl/readers/ReaderResult";
import ShapeFactory from "./engine/webgl/factories/ShapeFactory";
import { vec3 } from "gl-matrix";
import PrimativeRenderer from "./engine/components/renderers/PremadeRenderer";
import ShapeType from "./engine/webgl/shapes/ShapeType";
import InputManager from "./inputs/InputManager";
import LeftRightControlMovement from "./doodle-jump/movement/LeftRightControlMovement";
import Collider from "./engine/components/physics/Collider";
import BoxCollider from "./engine/components/physics/BoxCollider";
import Rigidbody from "./engine/components/physics/Rigidbody";
import Bounce from "./doodle-jump/platforms/BounceUpPlatform";
import XBoundTeleportation from "./doodle-jump/movement/XBoundTeleportation";
import PlatformSpawner from "./doodle-jump/platforms/PlatformSpawner";
import PlatformSpawnInfo from "./doodle-jump/platforms/PlatformSpawnInfo";
import MaxFollowerMovement from "./doodle-jump/movement/FollowerMovement";
import CameraRenderer from "./engine/components/renderers/CameraRenderer";
import JumpPlatformIgnorance from "./doodle-jump/movement/JumpPlatformIgnorance";
import Platform from "./doodle-jump/platforms/Platform";
import PlatformDestroyer from "./doodle-jump/platforms/PlatformDestroyer";
import InitialForce from "./doodle-jump/movement/InitialForce";
import WoodenPlatform from "./doodle-jump/platforms/WoodenPlatform";
import WayPointMovement from "./doodle-jump/movement/WayPointMovement";
import PlatformWayPoint from "./doodle-jump/platforms/PlatformWayPoint";
import Player from "./doodle-jump/player/Player";
import CloudPlatform from "./doodle-jump/platforms/CloudPlatform";
import ImageLoader from "./engine/webgl/textures/ImageLoader";
import WoodenPlatformAnimator from "./doodle-jump/animators/WoodenPlatformAnimator";
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
