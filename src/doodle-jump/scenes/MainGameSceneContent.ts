import { vec2, vec3 } from "gl-matrix";
import GameObject from "../../engine/gameobjects/GameObject";
import ModelReaderFactory from "../../engine/webgl/factories/ModelReaderFactory";
import MeshType from "../../engine/webgl/shapes/MeshType";
import ImageLoader from "../../engine/webgl/textures/ImageLoader";
import TextureInfo from "../../engine/webgl/textures/TextureInfo";
import BoxCollider from "../../engine/components/physics/BoxCollider";
import BounceUpPlatform from "../platforms/BounceUpPlatform";
import MeshRenderer from "../../engine/components/renderers/MeshRenderer";
import WoodenPlatform from "../platforms/WoodenPlatform";
import WayPointMovement from "../way-points/WayPointMovement";
import WayPoint from "../way-points/WayPoint";
import WoodenPlatformAnimator from "../animators/WoodenPlatformAnimator";
import CloudPlatform from "../platforms/CloudPlatform";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import InitialForce from "../movement/InitialForce";
import JumpPlatformIgnorance from "../player/JumpPlatformIgnorance";
import PlayerEquipment from "../player/PlayerEquipment";
import EnvironmentSpawner from "../spawners/EnvironmentSpawner";
import PlatformSpawnInfo from "../spawners/PlatformSpawnInfo";
import MaxFollowerMovement from "../movement/MaxFollowerMovement";
import CameraRenderer from "../../engine/components/renderers/CameraRenderer";
import XBoundTeleportation from "../movement/XBoundTeleportation";
import EnvironmentDestroyer from "../spawners/EnvironmentDestroyer";
import Shape from "../../engine/webgl/shapes/Shape";
import ScoreTracking from "../scores/ScoreTracking";
import TextRenderer from "../../engine/components/renderers/TextRenderer";
import TextWriter from "../scores/TextWriter";
import ScoreManager from "../ScoreManager";
import DoodleJumpSceneContent from "./DoodleJumpSceneContent";
import PlayerGameOverContact from "../player/PlayerGameOverContact";
import Spring from "../platform-items/Spring";
import JetpackCollectible from "../platform-items/JetpackCollectible";
import HatCollectible from "../platform-items/HatCollectible";
import SpringAnimator from "../animators/SpringAnimator";
import PlayerShoot from "../player/PlayerShoot";
import Monster from "../obstacles/Monster";
import PlayerMovementController from "../player/PlayerMovementController";
import DoodleJumpSceneCollection from "./DoodleJumpSceneCollection";
import BatAnimator from "../animators/BatAnimator";
import PlatformItemSpawnInfo from "../spawners/PlatformItemSpawnInfo";
import SpawnSet from "../spawners/SpawnSet";
import ObstacleSpawnInfo from "../spawners/ObstacleSpawnInfo";

class MainGameSceneContent extends DoodleJumpSceneContent{
    
    private SPRING0_URL = `${this.ATLAS_URL}/bonus0.png`;
    private SPRING1_URL = `${this.ATLAS_URL}/bonus01.png`;

    private JETPACK_URL = `${this.ATLAS_URL}/bonus2.png`;
    private HAT_URL = `${this.ATLAS_URL}/bonus3.png`;


    // Monster
    private PURPLE_MONSTER_URL = `${this.ATLAS_URL}/obstacle7.png`;
    private RED_MONSTER_URL = `${this.ATLAS_URL}/obstacle8.png`;
    private BLUE_MONSTER_URL = `${this.ATLAS_URL}/obstacle9.png`;


    private BAT_MONSTER0_URL = `${this.ATLAS_URL}/obstacle10.png`;
    private BAT_MONSTER1_URL = `${this.ATLAS_URL}/but1.png`;
    private BAT_MONSTER2_URL = `${this.ATLAS_URL}/but2.png`;
    private BAT_MONSTER3_URL = `${this.ATLAS_URL}/but3.png`;
    private BAT_MONSTER4_URL = `${this.ATLAS_URL}/but4.png`;

    private GREEN_MONSTER0_URL = `${this.ATLAS_URL}/obstacle11.png`;
    private GREEN_MONSTER1_URL = `${this.ATLAS_URL}/green0.png`;
    private GREEN_MONSTER2_URL = `${this.ATLAS_URL}/green1.png`;
    private GREEN_MONSTER3_URL = `${this.ATLAS_URL}/green2.png`;
    private GREEN_MONSTER4_URL = `${this.ATLAS_URL}/green3.png`;

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

        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.BACKGROUND_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.TOP_URL));

        
        imageLoadPromises.push(...this.downloadPlayerImages());
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.TRUNK_URL));

        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.SPRING0_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.SPRING1_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.JETPACK_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.HAT_URL));

        imageLoadPromises.push(imageLoader.loadImageFromUrls([this.HAT_WEARABLE1_URL, this.HAT_WEARABLE2_URL, this.HAT_WEARABLE3_URL]));
        imageLoadPromises.push(imageLoader.loadImageFromUrls([this.JETPACK_WEARABLE0_URL, this.JETPACK_WEARABLE1_URL, this.JETPACK_WEARABLE2_URL, this.JETPACK_WEARABLE3_URL, this.JETPACK_WEARABLE4_URL, this.JETPACK_WEARABLE5_URL, this.JETPACK_WEARABLE6_URL, this.JETPACK_WEARABLE7_URL, this.JETPACK_WEARABLE8_URL, this.JETPACK_WEARABLE9_URL]));
        imageLoadPromises.push(imageLoader.loadImageFromUrls([this.STAR0_URL, this.STAR1_URL, this.STAR2_URL]));
        imageLoadPromises.push(imageLoader.loadImageFromUrls([this.BULLET_URL]));

        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.PURPLE_MONSTER_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.RED_MONSTER_URL));
        imageLoadPromises.push(imageLoader.loadImageFromUrls(this.BLUE_MONSTER_URL));

        imageLoadPromises.push(imageLoader.loadImageFromUrls([this.BAT_MONSTER0_URL, this.BAT_MONSTER1_URL, this.BAT_MONSTER2_URL, this.BAT_MONSTER3_URL, this.BAT_MONSTER4_URL]));
        imageLoadPromises.push(imageLoader.loadImageFromUrls([this.GREEN_MONSTER0_URL, this.GREEN_MONSTER1_URL, this.GREEN_MONSTER2_URL, this.GREEN_MONSTER3_URL, this.GREEN_MONSTER4_URL]));

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
        playerGameObject.addComponent(new PlayerMovementController(48, 10000));
        playerGameObject.addComponent(new InitialForce([0, 5000, 0]))
        playerGameObject.addComponent(new JumpPlatformIgnorance());
        playerGameObject.addComponent(new PlayerShoot())
        
        // Create Camera
        let camera = this.createCamera();
        
        camera.addComponent(new XBoundTeleportation(playerGameObject, 0, 27));
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
        greenPlatform.addComponent(new BoxCollider(true, 0, 3.5, 2, 0.25, DoodleJumpSceneCollection.PLATFORM_LAYER));
        greenPlatform.addComponent(new BounceUpPlatform(5000));
        
        let greenPlatfromImageElements = this.imageLoader.getImageElements(this.PLATFORM0_URL);
        greenPlatform.addComponent(new MeshRenderer(this.quad, greenPlatfromImageElements, this.vectorArtTextureInfo));
        
            
        // Moving Platform
        let bluePlatform = new GameObject("Blue Platform");

        vec3.set(bluePlatform.transform.position, 0, 5, 1);
        vec3.set(bluePlatform.transform.scale, 4, 2, 1);
        bluePlatform.addComponent(new BoxCollider(true, 0, 3.5, 2, 0.25, DoodleJumpSceneCollection.PLATFORM_LAYER));
        bluePlatform.addComponent(new BounceUpPlatform(5000));

        // Waypoints
        let wayPoints = [
            new GameObject("Waypoint 0").transform,
            new GameObject("Waypoint 1").transform
        ];
        wayPoints[0].gameObject.addComponent(new WayPoint([ -20, 0, 1], true, false, false));
        wayPoints[1].gameObject.addComponent(new WayPoint([ 20, 0 ,1], true, false, false));
        wayPoints[0].setParent(bluePlatform.transform);
        wayPoints[1].setParent(bluePlatform.transform);

        bluePlatform.addComponent(new WayPointMovement(0.4, false));

        let bluePlatfromImageElements = this.imageLoader.getImageElements(this.PLATFORM1_URL);
        bluePlatform.addComponent(new MeshRenderer(this.quad, bluePlatfromImageElements, this.vectorArtTextureInfo));
        

        // Brown Platform
        let brownPlatform = new GameObject("Brown Platform");

        vec3.set(brownPlatform.transform.scale, 4, 4, 1);
        brownPlatform.addComponent(new BoxCollider(true, 0, 2, 2, 1, DoodleJumpSceneCollection.PLATFORM_LAYER));
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
        whitePlatform.addComponent(new BoxCollider(true, 0, 3.5, 2, 0.25, DoodleJumpSceneCollection.PLATFORM_LAYER));
        whitePlatform.addComponent(new BounceUpPlatform(5000));
        whitePlatform.addComponent(new CloudPlatform());
 
        let whitePlatformImageElements = this.imageLoader.getImageElements(this.PLATFORM3_URL);
        whitePlatform.addComponent(new MeshRenderer(this.quad, whitePlatformImageElements, this.vectorArtTextureInfo)); 
        
        // Add Spring
        let spring = new GameObject("Spring");
        vec3.set(spring.transform.position, -3, 0, 1);
        vec3.set(spring.transform.scale, 1.5, 2, 1);
        spring.addComponent(new Spring())
        spring.addComponent(new BoxCollider(true, 0, 3, 2.5, 2, DoodleJumpSceneCollection.PLATFORM_LAYER));
        spring.addComponent(new BounceUpPlatform(10000));

        let springImageElements = this.imageLoader.getImageElements([this.SPRING0_URL, this.SPRING1_URL]);
        spring.addComponent(new MeshRenderer(this.quad, springImageElements, this.vectorArtTextureInfo));
        spring.addComponent(new SpringAnimator());



        // Add Jetpack
        let jetpack = new GameObject("Jetpack");
        vec3.set(jetpack.transform.scale, 2, 4, 1);
        jetpack.addComponent(new BoxCollider(true, 0, 1, 2, 1, DoodleJumpSceneCollection.ITEM_LAYER));
        jetpack.addComponent(new JetpackCollectible(5,3,4000));

        let jetpackImageElements = this.imageLoader.getImageElements(this.JETPACK_URL);
        jetpack.addComponent(new MeshRenderer(this.quad, jetpackImageElements, this.vectorArtTextureInfo));


        // Add Hat 
        let hat = new GameObject("Hat");
        vec3.set(hat.transform.scale, 2, 4, 1);
        hat.addComponent(new BoxCollider(true, 0, 1, 2, 1, DoodleJumpSceneCollection.ITEM_LAYER));
        hat.addComponent(new HatCollectible(4,3,2000));

        let hatImageElements = this.imageLoader.getImageElements(this.HAT_URL);
        hat.addComponent(new MeshRenderer(this.quad, hatImageElements, this.vectorArtTextureInfo));


        // Add Purple Monster
        let purpleMonster = new GameObject("Purple Monster");
        vec3.set(purpleMonster.transform.position, -18, 10, 1);
        vec3.set(purpleMonster.transform.scale, 4, 6, 1);
        purpleMonster.addComponent(new BoxCollider(true, 0, -4, 2, 1, DoodleJumpSceneCollection.MONSTER_LAYER));
        purpleMonster.addComponent(new Monster());
        
        let purpleMonsterImageElements = this.imageLoader.getImageElements(this.PURPLE_MONSTER_URL);
        purpleMonster.addComponent(new MeshRenderer(this.quad, purpleMonsterImageElements, this.vectorArtTextureInfo));

        let purpleMonsterWayPoints = [
            new GameObject("Waypoint 0").transform,
            new GameObject("Waypoint 1").transform
        ];
        purpleMonsterWayPoints[0].gameObject.addComponent(new WayPoint([ 3, 0, 1], false, false, false));
        purpleMonsterWayPoints[1].gameObject.addComponent(new WayPoint([ -3, 0 ,1], false, false, false));
        purpleMonsterWayPoints[0].setParent(purpleMonster.transform);
        purpleMonsterWayPoints[1].setParent(purpleMonster.transform);

        purpleMonster.addComponent(new WayPointMovement(4, false));

        
        // Add Red Monster
        let redMonster = new GameObject("Red Monster");
        vec3.set(redMonster.transform.position, 18, 18, 1);
        vec3.set(redMonster.transform.scale, 4, 6, 1);
        redMonster.addComponent(new BoxCollider(true, 0, -2, 2, 1, DoodleJumpSceneCollection.MONSTER_LAYER));
        redMonster.addComponent(new Monster());

        let redMonsterImageElements = this.imageLoader.getImageElements(this.RED_MONSTER_URL);
        redMonster.addComponent(new MeshRenderer(this.quad, redMonsterImageElements, this.vectorArtTextureInfo));

        let redMonsterWayPoints = [
            new GameObject("Waypoint 0").transform,
            new GameObject("Waypoint 1").transform,
            new GameObject("Waypoint 2").transform,
            new GameObject("Waypoint 3").transform,
            new GameObject("Waypoint 4").transform,

        ];

        redMonsterWayPoints[0].gameObject.addComponent(new WayPoint([ 2, 2, 1], false, false, false));
        redMonsterWayPoints[1].gameObject.addComponent(new WayPoint([ -2, 1 ,1], false, false, false));
        redMonsterWayPoints[2].gameObject.addComponent(new WayPoint([ 2, 0, 1], false, false, false));
        redMonsterWayPoints[3].gameObject.addComponent(new WayPoint([ -2, -1 ,1], false, false, false));
        redMonsterWayPoints[4].gameObject.addComponent(new WayPoint([ 2, -2, 1], false, false, false));
        
        
        redMonsterWayPoints[0].setParent(redMonster.transform);
        redMonsterWayPoints[1].setParent(redMonster.transform);
        redMonsterWayPoints[2].setParent(redMonster.transform);
        redMonsterWayPoints[3].setParent(redMonster.transform);
        redMonsterWayPoints[4].setParent(redMonster.transform);

        redMonster.addComponent(new WayPointMovement(7, false));


        // Add Blue Monster
        let blueMonster = new GameObject("Blue Monster");
        vec3.set(blueMonster.transform.position, 18, 18, 1);
        vec3.set(blueMonster.transform.scale, 3, 6, 1);
        blueMonster.addComponent(new BoxCollider(true, 0, -4, 2, 1, DoodleJumpSceneCollection.MONSTER_LAYER));
        blueMonster.addComponent(new Monster());

        let blueMonsterImageElements = this.imageLoader.getImageElements(this.BLUE_MONSTER_URL);
        blueMonster.addComponent(new MeshRenderer(this.quad, blueMonsterImageElements, this.vectorArtTextureInfo));

        let blueMonsterWayPoints = [
            new GameObject("Waypoint 0").transform,
            new GameObject("Waypoint 1").transform,
        ];

        blueMonsterWayPoints[0].gameObject.addComponent(new WayPoint([ 20, 2, 1], true, false, false));
        blueMonsterWayPoints[1].gameObject.addComponent(new WayPoint([ -20, 1 ,1], true, false, false));
        blueMonsterWayPoints[0].setParent(blueMonster.transform);
        blueMonsterWayPoints[1].setParent(blueMonster.transform);

        blueMonster.addComponent(new WayPointMovement(1, false)); 

        // Add Bat Monster
        
        let batMonster = new GameObject("Bat Monster");
        vec3.set(batMonster.transform.position, 18, 18, 1);
        vec3.set(batMonster.transform.scale, 6, 6, 1);
        batMonster.addComponent(new BoxCollider(true, 0, -2, 2, 1, DoodleJumpSceneCollection.MONSTER_LAYER));
        batMonster.addComponent(new Monster());

        let batMonsterImageElements = this.imageLoader.getImageElements([this.BAT_MONSTER0_URL, this.BAT_MONSTER1_URL, this.BAT_MONSTER2_URL, this.BAT_MONSTER3_URL, this.BAT_MONSTER4_URL]);
        batMonster.addComponent(new MeshRenderer(this.quad, batMonsterImageElements, this.vectorArtTextureInfo));
        batMonster.addComponent(new BatAnimator());

        let batMonsterWayPoints = [
            new GameObject("Waypoint 0").transform,
            new GameObject("Waypoint 1").transform,
            new GameObject("Waypoint 2").transform,
            new GameObject("Waypoint 3").transform,
            new GameObject("Waypoint 4").transform,
        ];

        batMonsterWayPoints[0].gameObject.addComponent(new WayPoint([ 2, 4, 1], false, false, false));
        batMonsterWayPoints[1].gameObject.addComponent(new WayPoint([ -2, 2 ,1], false, false, false));
        batMonsterWayPoints[2].gameObject.addComponent(new WayPoint([ 2, 0, 1], false, false, false));
        batMonsterWayPoints[3].gameObject.addComponent(new WayPoint([ -2, -2 ,1], false, false, false));
        batMonsterWayPoints[4].gameObject.addComponent(new WayPoint([ 2, -4, 1], false, false, false));

        batMonsterWayPoints[0].setParent(batMonster.transform);
        batMonsterWayPoints[1].setParent(batMonster.transform);
        batMonsterWayPoints[2].setParent(batMonster.transform);
        batMonsterWayPoints[3].setParent(batMonster.transform);
        batMonsterWayPoints[4].setParent(batMonster.transform);
        
        batMonster.addComponent(new WayPointMovement(7, false));


        // Spawn Set
        let testSpawnSet = new SpawnSet(1, 60, -20, 20, [-20,20], [4,14], [ 
            new PlatformSpawnInfo(greenPlatform, 10, false, true),
            new PlatformSpawnInfo(brownPlatform, 3, true, false),
            new PlatformSpawnInfo(bluePlatform, 3, false, true),
            new PlatformSpawnInfo(whitePlatform, 1, false, false)
            ], 200,[
            new ObstacleSpawnInfo(purpleMonster, 3),
            new ObstacleSpawnInfo(redMonster, 1),
            new ObstacleSpawnInfo(blueMonster, 1),
            new ObstacleSpawnInfo(batMonster, 1)
            ], 10, [
                new PlatformItemSpawnInfo(spring, 6,[-0.2,0.2], 0.8),
                new PlatformItemSpawnInfo(jetpack, 2,[-0.2,0.2], 2),
                new PlatformItemSpawnInfo(hat, 1,[-0.2,0.2], 1.8)
            ], 80
        );


        // Add Spawner
        let spawner = new GameObject('Spawner');
        sceneGameObjects.push(spawner);

        spawner.addComponent(new EnvironmentSpawner([
            testSpawnSet
        ], 60));
        spawner.addComponent(new MaxFollowerMovement(playerGameObject, false, true, false));
        spawner.transform.position[1] = -30;
        

        // Add Destroyer
        let destroyer = new GameObject('Destroyer');
        sceneGameObjects.push(destroyer);

        let destroyerFollwerMovement = new MaxFollowerMovement(playerGameObject, false, true, false);
        destroyer.addComponent(new BoxCollider(true, 0,-133, 1000, 200, DoodleJumpSceneCollection.DESTROYER_LAYER));
        destroyer.addComponent(new EnvironmentDestroyer());
        destroyer.addComponent(destroyerFollwerMovement);
        destroyer.addComponent(new ScoreTracking(destroyerFollwerMovement, 18));
        destroyer.addComponent(new PlayerGameOverContact());
        
        return sceneGameObjects;
    }

}

export default MainGameSceneContent;