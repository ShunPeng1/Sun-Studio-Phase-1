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
        // TOOO: Add your implementation here
        let mainScene = new Scene('main');

        let pixelatedTextureInfo = new TextureInfo(true, WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE,
            WebGLRenderingContext.LINEAR, WebGLRenderingContext.LINEAR);


        // Create factory
        let objectFactory = new ModelReaderFactory();
        let shapeFactory = new ShapeFactory(this.webGLManager);
        
        // Create quad
        let quad = shapeFactory.createShape(ShapeType.Quad);
        
        
        // Load images
        let imageLoader = new ImageLoader();
        let imageLoadPromises = [];

        // Platform
        let greenPlatform = new GameObject("Green Platform");
        vec3.set(greenPlatform.transform.scale, 4, 2, 1);
        greenPlatform.addComponent(new BoxCollider(false, 0, 1, 2, 1));
        greenPlatform.addComponent(new Bounce(4000));
        greenPlatform.setScene(mainScene);
        imageLoadPromises.push(imageLoader.loadImageFromUrls('assets/images/doodle/atlas/platform0.png', (imageElements)=>{
            greenPlatform.addComponent(new PrimativeRenderer(this.webGLManager, quad, imageElements, pixelatedTextureInfo));
        }));
            
        // Moving Platform
        let bluePlatform = new GameObject("Blue Platform");
        vec3.set(bluePlatform.transform.position, 0, 5, 1);
        vec3.set(bluePlatform.transform.scale, 4, 2, 1);
        bluePlatform.addComponent(new BoxCollider(false, 0, 1, 2, 1));
        bluePlatform.addComponent(new Bounce(4000));
        bluePlatform.setScene(mainScene); // Add to scene before waypoints

        // Waypoints
        let wayPoints = [
            new GameObject("Waypoint 0").transform,
            new GameObject("Waypoint 1").transform
        ];
        wayPoints[0].gameObject.addComponent(new PlatformWayPoint([ -18, 0, 1]));
        wayPoints[1].gameObject.addComponent(new PlatformWayPoint([ 18, 0 ,1]));
        wayPoints[0].setParent(bluePlatform.transform);
        wayPoints[1].setParent(bluePlatform.transform);

        bluePlatform.addComponent(new WayPointMovement(0.4, false));

        imageLoader.loadImageFromUrls('assets/images/doodle/atlas/platform1.png',(imageElements)=>{   
            bluePlatform.addComponent(new PrimativeRenderer(this.webGLManager, quad, imageElements, pixelatedTextureInfo));
        });

        // Brown Platform
        let brownPlatform = new GameObject("Brown Platform");
        vec3.set(brownPlatform.transform.scale, 4, 4, 1);
        brownPlatform.addComponent(new BoxCollider(true, 0, 1, 2, 1));
        brownPlatform.addComponent(new WoodenPlatform(40,1));
        brownPlatform.setScene(mainScene);

        
        imageLoader.loadImageFromUrls([
            'assets/images/doodle/atlas/platform2.png',
            'assets/images/doodle/atlas/platformSheet_02.png',
            'assets/images/doodle/atlas/platformSheet_03.png',
            'assets/images/doodle/atlas/platformSheet_04.png',
        ],(imageElements)=>{   
        
            brownPlatform.addComponent(new PrimativeRenderer(this.webGLManager, quad, imageElements, pixelatedTextureInfo));
            brownPlatform.addComponent(new WoodenPlatformAnimator())
        });
        
       /*
        imageLoader.loadImageFromUrls('assets/images/doodle/atlas/platform2.png',
            (imageElements)=>{   
        
            brownPlatform.addComponent(new PrimativeRenderer(this.webGLManager, quad, imageElements, pixelatedTextureInfo));
            brownPlatform.addComponent(new WoodenPlatformAnimator())
        });
         */
        
        
        // White Platform
        let whitePlatform = new GameObject("White Platform");
        vec3.set(whitePlatform.transform.scale, 4, 2, 1);
        whitePlatform.addComponent(new BoxCollider(false, 0, 1, 2, 1));
        whitePlatform.addComponent(new Bounce(4000));
        whitePlatform.addComponent(new CloudPlatform());
        whitePlatform.setScene(mainScene);
    
        imageLoader.loadImageFromUrls('assets/images/doodle/atlas/platform3.png',(imageElements)=>{   
            whitePlatform.addComponent(new PrimativeRenderer(this.webGLManager, quad, imageElements, pixelatedTextureInfo));
        });


        // Add Player
        let playerGameObject = new GameObject("Player");
        vec3.set(playerGameObject.transform.position, 0, -20, 1);
        vec3.set(playerGameObject.transform.rotation, 0, 0, 0);
        vec3.set(playerGameObject.transform.scale, 4, 4, 1);
        playerGameObject.addComponent(new BoxCollider(false, 0, -0.5, 1, 0.25));
        playerGameObject.addComponent(new Rigidbody(1.1, 110))
        playerGameObject.addComponent(new LeftRightControlMovement(50));
        playerGameObject.addComponent(new InitialForce([0, 5000, 0]))
        playerGameObject.addComponent(new JumpPlatformIgnorance());

        // Add Player Parts
        let playerHead = new GameObject("Player Head");
        let playerBack = new GameObject("Player Back");
        playerGameObject.addComponent(new Player(playerHead.transform, playerBack.transform));
        mainScene.addGameObject(playerGameObject);
        
        imageLoader.loadImageFromUrls('assets/images/doodle/player/tile000.png',(imageElements)=>{
            
            playerGameObject.addComponent(new PrimativeRenderer(this.webGLManager, quad, imageElements, pixelatedTextureInfo));
            
        });

        
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
        paperBackground.transform.setParent(camera.transform);
            
        imageLoader.loadImageFromUrls('assets/images/doodle/atlas2/background.png',(imageElements)=>{
            
            paperBackground.addComponent(new PrimativeRenderer(this.webGLManager, quad, imageElements, pixelatedTextureInfo));
            console.log("Loaded Background")
        });

        // Add Spawner
        let spawner = new GameObject('Spawner');
        spawner.addComponent(new PlatformSpawner([
            new PlatformSpawnInfo(greenPlatform, 1),
            new PlatformSpawnInfo(brownPlatform, 30, true),
            new PlatformSpawnInfo(bluePlatform, 3),
            new PlatformSpawnInfo(whitePlatform, 1)
        ], 60, [-20,20], [4,14]));
        spawner.addComponent(new MaxFollowerMovement(playerGameObject, false, true, false));
        spawner.transform.position[1] = -30;
        mainScene.addGameObject(spawner);


        // Add Destroyer
        let destroyer = new GameObject('Destroyer');
        destroyer.addComponent(new BoxCollider(true, 0,-140, 1000,200));
        destroyer.addComponent(new PlatformDestroyer());
        destroyer.addComponent(new MaxFollowerMovement(playerGameObject, false, true, false));
        mainScene.addGameObject(destroyer);



        
        this.sceneManager.addScene(mainScene);
        console.log("Scene Loaded");

        // wait for all images to load
        await Promise.all(imageLoadPromises);

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
