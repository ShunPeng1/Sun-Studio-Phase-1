import { vec3 } from "gl-matrix";
import GameObject from "../../engine/gameobjects/GameObject";
import ModelReaderFactory from "../../engine/webgl/factories/ModelReaderFactory";
import MeshType from "../../engine/webgl/shapes/MeshType";
import ImageLoader from "../../engine/webgl/textures/ImageLoader";
import TextureInfo from "../../engine/webgl/textures/TextureInfo";
import BoxCollider from "../../engine/components/physics/BoxCollider";
import BounceUpPlatform from "../platforms/BounceUpPlatform";
import MeshRenderer from "../../engine/components/renderers/PremadeRenderer";
import WoodenPlatform from "../platforms/WoodenPlatform";
import WayPointMovement from "../movement/WayPointMovement";
import PlatformWayPoint from "../platforms/PlatformWayPoint";
import WoodenPlatformAnimator from "../animators/WoodenPlatformAnimator";
import CloudPlatform from "../platforms/CloudPlatform";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import LeftRightControlMovement from "../movement/LeftRightControlMovement";
import InitialForce from "../movement/InitialForce";
import JumpPlatformIgnorance from "../movement/JumpPlatformIgnorance";
import Player from "../player/Player";
import PlatformSpawner from "../platforms/PlatformSpawner";
import PlatformSpawnInfo from "../platforms/PlatformSpawnInfo";
import MaxFollowerMovement from "../movement/MaxFollowerMovement";
import CameraRenderer from "../../engine/components/renderers/CameraRenderer";
import XBoundTeleportation from "../movement/XBoundTeleportation";
import PlatformDestroyer from "../platforms/PlatformDestroyer";
import Shape from "../../engine/webgl/shapes/Shape";
import ScoreTracking from "../scores/ScoreTracking";
import TextRenderer from "../../engine/components/renderers/TextRenderer";
import TextWriter from "../scores/TextWriter";
import ScoreManager from "../ScoreManager";
import DoodleJumpSceneContent from "./DoodleJumpSceneContent";
import PlayerGameOverContact from "../player/PlayerGameOverContact";
import PlatformItemSpawnInfo from "../platform-items/PlatformItemSpawnInfo";
import Spring from "../platform-items/Spring";

class MainGameSceneContent extends DoodleJumpSceneContent{
    
    private SPRING0_URL = `${this.ATLAS_URL}/bonus0.png`;
    private SPRING1_URL = `${this.ATLAS_URL}/bonus01.png`;

    download(): Promise<any>[]{
        
        let imageLoadPromises = [];
        
        let imageLoader = this.imageLoader;

        // Load all images here
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.PLATFORM0_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.PLATFORM1_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls([
            this.PLATFORM2_URL,
            this.PLATFORM_SHEET_02_URL,
            this.PLATFORM_SHEET_03_URL,
            this.PLATFORM_SHEET_04_URL,
        ]));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.PLATFORM3_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.PLAYER_TILE_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.BACKGROUND_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.TOP_URL));

        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.SPRING0_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.SPRING1_URL));
        return imageLoadPromises;
    }

    create(): GameObject[] {
        let sceneGameObjects : GameObject[] = [];


        // Add Player
        let playerGameObject = this.createPlayer();
        
        sceneGameObjects.push(playerGameObject);

        vec3.set(playerGameObject.transform.position, 0, -20, 1);
        vec3.set(playerGameObject.transform.rotation, 0, 0, 0);
        vec3.set(playerGameObject.transform.scale, 4, 4, 1);
        playerGameObject.addComponent(new LeftRightControlMovement(45));
        playerGameObject.addComponent(new InitialForce([0, 5000, 0]))
        playerGameObject.addComponent(new JumpPlatformIgnorance());
        
        // Create Camera
        let camera = this.createCamera();
        
        camera.addComponent(new XBoundTeleportation(playerGameObject, 0, 25));
        camera.addComponent(new MaxFollowerMovement(playerGameObject, false, true, false));
        sceneGameObjects.push(camera);

        // Add Background
        let paperBackground = this.createBackground();
        paperBackground.transform.setParent(camera.transform);

        // Add UI
        let scorePanel = this.createScorePanel();
        scorePanel.transform.setParent(camera.transform);

        // Platform
        let greenPlatform = new GameObject("Green Platform");

        vec3.set(greenPlatform.transform.scale, 4, 2, 1);
        greenPlatform.addComponent(new BoxCollider(false, 0, 1, 2, 1));
        greenPlatform.addComponent(new BounceUpPlatform(4000));
        
        let greenPlatfromImageElements = this.imageLoader.getImageElements(this.PLATFORM0_URL);
        greenPlatform.addComponent(new MeshRenderer(this.quad, greenPlatfromImageElements, this.vectorArtTextureInfo));
        
            
        // Moving Platform
        let bluePlatform = new GameObject("Blue Platform");

        vec3.set(bluePlatform.transform.position, 0, 5, 1);
        vec3.set(bluePlatform.transform.scale, 4, 2, 1);
        bluePlatform.addComponent(new BoxCollider(false, 0, 1, 2, 1));
        bluePlatform.addComponent(new BounceUpPlatform(4000));

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

        let bluePlatfromImageElements = this.imageLoader.getImageElements(this.PLATFORM1_URL);
        bluePlatform.addComponent(new MeshRenderer(this.quad, bluePlatfromImageElements, this.vectorArtTextureInfo));
        

        // Brown Platform
        let brownPlatform = new GameObject("Brown Platform");

        vec3.set(brownPlatform.transform.scale, 4, 4, 1);
        brownPlatform.addComponent(new BoxCollider(true, 0, 1, 2, 1));
        brownPlatform.addComponent(new WoodenPlatform(40,1));

        let brownPlatfromImageElements = this.imageLoader.getImageElements(
            [
                this.PLATFORM2_URL,
                this.PLATFORM_SHEET_02_URL,
                this.PLATFORM_SHEET_03_URL,
                this.PLATFORM_SHEET_04_URL,
            ]
        );
        
        brownPlatform.addComponent(new MeshRenderer(this.quad, brownPlatfromImageElements, this.vectorArtTextureInfo));
        brownPlatform.addComponent(new WoodenPlatformAnimator())
    
        
        
        
        // White Platform
        let whitePlatform = new GameObject("White Platform");
        
        vec3.set(whitePlatform.transform.scale, 4, 2, 1);
        whitePlatform.addComponent(new BoxCollider(false, 0, 1, 2, 1));
        whitePlatform.addComponent(new BounceUpPlatform(4000));
        whitePlatform.addComponent(new CloudPlatform());
 
        let whitePlatformImageElements = this.imageLoader.getImageElements(this.PLATFORM3_URL);
        whitePlatform.addComponent(new MeshRenderer(this.quad, whitePlatformImageElements, this.vectorArtTextureInfo)); 
        
        // Add Spring
        let spring = new GameObject("Spring");

        vec3.set(spring.transform.scale, 1, 2, 1);
        spring.addComponent(new Spring())
        spring.addComponent(new BoxCollider(true, 0, 1, 1, 1));
        spring.addComponent(new BounceUpPlatform(8000));

        let springImageElements = this.imageLoader.getImageElements([this.SPRING0_URL, this.SPRING1_URL]);
        spring.addComponent(new MeshRenderer(this.quad, springImageElements, this.vectorArtTextureInfo));


        // Add Spawner
        let spawner = new GameObject('Spawner');
        sceneGameObjects.push(spawner);

        spawner.addComponent(new PlatformSpawner([
            new PlatformSpawnInfo(greenPlatform, 10, false, true),
            new PlatformSpawnInfo(brownPlatform, 3, true, false),
            new PlatformSpawnInfo(bluePlatform, 3, false, true),
            new PlatformSpawnInfo(whitePlatform, 1, false, false)
        ], 60, [-20,20], [4,14], [
            new PlatformItemSpawnInfo(spring, 100,[-0.8,0.8], 0.8)
        ], 0));
        spawner.addComponent(new MaxFollowerMovement(playerGameObject, false, true, false));
        spawner.transform.position[1] = -30;
        

        // Add Destroyer
        let destroyer = new GameObject('Destroyer');
        sceneGameObjects.push(destroyer);

        let destroyerFollwerMovement = new MaxFollowerMovement(playerGameObject, false, true, false);
        destroyer.addComponent(new BoxCollider(true, 0,-140, 1000, 200));
        destroyer.addComponent(new PlatformDestroyer());
        destroyer.addComponent(destroyerFollwerMovement);
        destroyer.addComponent(new ScoreTracking(destroyerFollwerMovement, 18));
        destroyer.addComponent(new PlayerGameOverContact());
        
        return sceneGameObjects;
    }

}

export default MainGameSceneContent;