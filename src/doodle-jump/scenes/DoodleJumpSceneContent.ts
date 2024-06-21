import { vec2, vec3 } from "gl-matrix";
import CameraRenderer from "../../engine/components/renderers/CameraRenderer";
import GameObject from "../../engine/gameobjects/GameObject";
import ISceneContent from "../../engine/scenes/ISceneContent";
import ImageLoader from "../../engine/webgl/textures/ImageLoader";
import TextureInfo from "../../engine/webgl/textures/TextureInfo";
import MeshRenderer from "../../engine/components/renderers/MeshRenderer";
import ModelReaderFactory from "../../engine/webgl/factories/ModelReaderFactory";
import MeshType from "../../engine/webgl/shapes/MeshType";
import TextRenderer from "../../engine/components/renderers/TextRenderer";
import TextWriter from "../scores/TextWriter";
import ScoreManager from "../ScoreManager";
import BoxCollider from "../../engine/components/physics/BoxCollider";
import Rigidbody from "../../engine/components/physics/Rigidbody";

import PlayerWear from "../player/PlayerEquipment";
import Mesh from "../../engine/webgl/shapes/Mesh";
import MeshFactory from "../../engine/webgl/factories/MeshFactory";
import IGameSceneCollection from "../../engine/scenes/IGameSceneCollection";
import HatWearableAnimator from "../animators/HatWearableAnimator";
import JetpackWearableAnimator from "../animators/JetpackWearableAnimator";
import PlayerTrunk from "../player/PlayerTrunk";
import ForwardMovement from "../movement/ForwardMovement";
import TimeoutSelfDestruction from "../monsters/TimeoutSelfDestruction";
import PlayerFeet from "../player/PlayerFeet";
import PlayerAnimator from "../animators/playerAnimator";
import Player from "../player/Player";
import StarAnimator from "../animators/StarAnimator";
import DoodleJumpSceneCollection from "./DoodleJumpSceneCollection";

abstract class DoodleJumpSceneContent implements ISceneContent{

    public sceneCollection: IGameSceneCollection;
    
    // Loaders
    protected imageLoader: ImageLoader;
    protected quad: Mesh;
    protected vectorArtTextureInfo: TextureInfo;


    // Assets base url
    protected ASSETS_BASE_URL = 'assets/images/doodle';
    protected ATLAS_URL = `${this.ASSETS_BASE_URL}/atlas`;
    protected ATLAS2_URL = `${this.ASSETS_BASE_URL}/atlas2`;
    protected ATLAS3_URL = `${this.ASSETS_BASE_URL}/atlas3`;
    protected AUDIO_URL = `${this.ASSETS_BASE_URL}/audio`;
    protected PLAYER_URL = `${this.ASSETS_BASE_URL}/player`;


    // Platform images
    protected PLATFORM0_URL = `${this.ATLAS_URL}/platform0.png`;
    protected PLATFORM1_URL = `${this.ATLAS_URL}/platform1.png`;
    protected PLATFORM2_URL = `${this.ATLAS_URL}/platform2.png`;
    protected PLATFORM_SHEET_02_URL = `${this.ATLAS_URL}/platformSheet_02.png`;
    protected PLATFORM_SHEET_03_URL = `${this.ATLAS_URL}/platformSheet_03.png`;
    protected PLATFORM_SHEET_04_URL = `${this.ATLAS_URL}/platformSheet_04.png`;
    protected PLATFORM3_URL = `${this.ATLAS_URL}/platform3.png`;

    // Background images
    protected BACKGROUND_URL = `${this.ATLAS2_URL}/background.png`;
    protected TOP_URL = `${this.ATLAS_URL}/top.png`;
    

    // Player images
    protected PLAYER_IDLE_URL = `${this.PLAYER_URL}/tile000.png`;
    protected PLAYER_JUMP_URL = `${this.PLAYER_URL}/tile001.png`;
    protected PLAYER_SHOOT_URL = `${this.PLAYER_URL}/tile002.png`;
    protected PLAYER_SHOOT_JUMP_URL = `${this.PLAYER_URL}/tile003.png`;

    protected TRUNK_URL = `${this.ATLAS_URL}/trunk.png`;
    protected BULLET_URL = `${this.ATLAS_URL}/bullet.png`;

    // Hat images
    protected HAT_WEARABLE1_URL = `${this.ATLAS_URL}/propeller_02.png`;
    protected HAT_WEARABLE2_URL = `${this.ATLAS_URL}/propeller_03.png`;
    protected HAT_WEARABLE3_URL = `${this.ATLAS_URL}/propeller_04.png`;

    // Jetpack images
    protected JETPACK_WEARABLE0_URL = `${this.ATLAS_URL}/bonus2anim_01.png`;
    protected JETPACK_WEARABLE1_URL = `${this.ATLAS_URL}/bonus2anim_02.png`;
    protected JETPACK_WEARABLE2_URL = `${this.ATLAS_URL}/bonus2anim_03.png`;
    protected JETPACK_WEARABLE3_URL = `${this.ATLAS_URL}/bonus2anim_04.png`;
    protected JETPACK_WEARABLE4_URL = `${this.ATLAS_URL}/bonus2anim_05.png`;
    protected JETPACK_WEARABLE5_URL = `${this.ATLAS_URL}/bonus2anim_06.png`;
    protected JETPACK_WEARABLE6_URL = `${this.ATLAS_URL}/bonus2anim_07.png`;
    protected JETPACK_WEARABLE7_URL = `${this.ATLAS_URL}/bonus2anim_08.png`;
    protected JETPACK_WEARABLE8_URL = `${this.ATLAS_URL}/bonus2anim_09.png`;
    protected JETPACK_WEARABLE9_URL = `${this.ATLAS_URL}/bonus2anim_10.png`;

    // Star images
    protected STAR0_URL = `${this.ATLAS_URL}/stars_01.png`;
    protected STAR1_URL = `${this.ATLAS_URL}/stars_02.png`;
    protected STAR2_URL = `${this.ATLAS_URL}/stars_03.png`;


    

    constructor(sceneCollection : IGameSceneCollection){
        this.sceneCollection = sceneCollection;

        let vectorArtTextureInfo = new TextureInfo(true, WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE,
            WebGLRenderingContext.LINEAR, WebGLRenderingContext.LINEAR);
        this.vectorArtTextureInfo = vectorArtTextureInfo;

        // Create factory
        let objectFactory = new ModelReaderFactory();
        let shapeFactory = new MeshFactory();
        
        // Create quad
        let quad = shapeFactory.createMesh(MeshType.Quad);
        this.quad = quad;
        
        
        // Load images
        let imageLoader = new ImageLoader();
        this.imageLoader = imageLoader;
    }

    public abstract download(): Promise<any>[] ;
    
    public abstract create(): GameObject[] ;
    

    protected downloadPlayerImages(): Promise<any>[]{
        let promises: Promise<any>[] = [];
        promises.push(this.imageLoader.loadImageFromUrls([this.PLAYER_IDLE_URL, this.PLAYER_JUMP_URL, this.PLAYER_SHOOT_URL, this.PLAYER_SHOOT_JUMP_URL]));
        return promises;
    }

    protected downloadBackgroundImage(): Promise<any>[]{
        let promises: Promise<any>[] = [];
        promises.push(this.imageLoader.loadImageFromUrls(this.BACKGROUND_URL));
        return promises;
    }

    protected downloadScorePanelImage(): Promise<any>[]{
        let promises: Promise<any>[] = [];
        promises.push(this.imageLoader.loadImageFromUrls(this.TOP_URL));
        return promises;
    }

    protected createCamera(): GameObject{
        // Add Camera
        let camera = new GameObject('Camera');

        vec3.set(camera.transform.position, 0, 0, 55);
        vec3.set(camera.transform.rotation, 0, 0, 0);
        vec3.set(camera.transform.scale, 1, 1, 1);
        
        camera.addComponent(new CameraRenderer(true));

        return camera;
    }

    protected createBackground(): GameObject{

        // Add Background
        let paperBackground = new GameObject('Background 1');
        
        vec3.set(paperBackground.transform.position, 0, 40, -65);
        vec3.set(paperBackground.transform.rotation, 0, 0, 0);
        vec3.set(paperBackground.transform.scale, 30, 80, 1);
        
        let paperBackgroundImageElements = this.imageLoader.getImageElements(this.BACKGROUND_URL);
        paperBackground.addComponent(new MeshRenderer( this.quad, paperBackgroundImageElements, this.vectorArtTextureInfo));

        return paperBackground;
    }

    protected createScorePanel(): GameObject{
        // Add UI
        let scoreText = new GameObject('Score Text');

        vec3.set(scoreText.transform.position, 0, 37, -55);
        vec3.set(scoreText.transform.scale, 30, 7, 1);
        let topImageElements = this.imageLoader.getImageElements(this.TOP_URL);
        scoreText.addComponent(new MeshRenderer(this.quad, topImageElements, this.vectorArtTextureInfo));
        
        let textRenderer = new TextRenderer('Score: 0', 50, 40, 'black', '30px Arial');
        scoreText.addComponent(textRenderer);
        scoreText.addComponent(new TextWriter(textRenderer, () => {
            return ScoreManager.getInstance().getScore().toString();
        }))

        let fpstextRenderer = new TextRenderer('FPS: 0', 350, 40, 'black', '30px Arial');
        scoreText.addComponent(fpstextRenderer);
    
        let lastUpdateTime = Date.now();
        let frameCount = 0;
    
        scoreText.addComponent(new TextWriter(fpstextRenderer, () => {
            let currentTime = Date.now();
            let deltaTime = currentTime - lastUpdateTime;
    
            if (deltaTime >= 1000) {
                lastUpdateTime = currentTime;
                let fps = frameCount;
                frameCount = 0;
                return 'FPS: ' + fps;
            }
    
            frameCount++;
            return fpstextRenderer.getText();
        }));


        return scoreText;
    }


    protected createPlayer(): GameObject{
        
        // Add Player
        let playerGameObject = new GameObject("Player");

        vec3.set(playerGameObject.transform.position, 0, -20, 1);
        vec3.set(playerGameObject.transform.rotation, 0, 0, 0);
        vec3.set(playerGameObject.transform.scale, 4, 4, 1);
        playerGameObject.addComponent(new Player());
        playerGameObject.addComponent(new BoxCollider(false, 0, -0.5, 1, 0.25, DoodleJumpSceneCollection.PLAYER_LAYER));
        playerGameObject.addComponent(new Rigidbody(1.1, 140));
        playerGameObject.addComponent(new PlayerFeet(0.2));

        // Add Player Parts
        
        let playerHead = new GameObject("Player Head");
        playerHead.transform.setParent(playerGameObject.transform);

        vec3.set(playerHead.transform.position, 0, 1.2, 0.1);
        vec3.set(playerHead.transform.scale, 0.5,1,1)

        let hatWearableImageElements = this.imageLoader.getImageElements([this.HAT_WEARABLE1_URL, this.HAT_WEARABLE2_URL, this.HAT_WEARABLE3_URL]);
        playerHead.addComponent(new MeshRenderer(this.quad, hatWearableImageElements, this.vectorArtTextureInfo));
        playerHead.addComponent(new HatWearableAnimator())
        
        

        let playerBack = new GameObject("Player Back");
        playerBack.transform.setParent(playerGameObject.transform);
        
        vec3.set(playerBack.transform.position, 0.7, 0.3, 0.1);
        vec3.set(playerBack.transform.scale, 0.7,2,1)

        let jetpackImageElements = this.imageLoader.getImageElements([this.JETPACK_WEARABLE0_URL, this.JETPACK_WEARABLE1_URL, this.JETPACK_WEARABLE2_URL, this.JETPACK_WEARABLE3_URL, this.JETPACK_WEARABLE4_URL, this.JETPACK_WEARABLE5_URL, this.JETPACK_WEARABLE6_URL, this.JETPACK_WEARABLE7_URL, this.JETPACK_WEARABLE8_URL, this.JETPACK_WEARABLE9_URL]);
        playerBack.addComponent(new MeshRenderer(this.quad, jetpackImageElements, this.vectorArtTextureInfo));
        playerBack.addComponent(new JetpackWearableAnimator(3))


        // Add Star
        let star = new GameObject("Star");
        star.transform.setParent(playerGameObject.transform);
        vec3.set(star.transform.position, 0, 1, 0.1);
        vec3.set(star.transform.scale, 1,1,1)

        let starImageElements = this.imageLoader.getImageElements([this.STAR0_URL, this.STAR1_URL, this.STAR2_URL]);
        star.addComponent(new MeshRenderer(this.quad, starImageElements, this.vectorArtTextureInfo));
        star.addComponent(new StarAnimator())
        
        


        // Add Trunk
        let playerTrunk = new GameObject("Trunk");

        vec3.set(playerTrunk.transform.position, 0, 1, 0.1);
        vec3.set(playerTrunk.transform.scale, 0.25,2,1)

        playerTrunk.transform.setParent(playerGameObject.transform);

        let trunkImageElements = this.imageLoader.getImageElements(this.TRUNK_URL);
        playerTrunk.addComponent(new MeshRenderer(this.quad, trunkImageElements, this.vectorArtTextureInfo));

        
        
        // Add bullet prefab
        let bulletPrefab = new GameObject("Bullet");
        vec3.set(bulletPrefab.transform.scale, 1, 1.5, 1);
        let bulletImageElements = this.imageLoader.getImageElements(this.BULLET_URL);
        bulletPrefab.addComponent(new MeshRenderer(this.quad, bulletImageElements, this.vectorArtTextureInfo));
        bulletPrefab.addComponent(new ForwardMovement(200));
        bulletPrefab.addComponent(new TimeoutSelfDestruction(1));

        
        // Combine all player parts
        playerGameObject.addComponent(new PlayerTrunk(playerTrunk, bulletPrefab, [0, 2, 0], 10, 0.4));
        playerGameObject.addComponent(new PlayerWear(playerHead, playerBack, star, 0.1));

        
        let playerImageElements = this.imageLoader.getImageElements([this.PLAYER_IDLE_URL, this.PLAYER_JUMP_URL, this.PLAYER_SHOOT_URL, this.PLAYER_SHOOT_JUMP_URL]);
        playerGameObject.addComponent(new MeshRenderer(this.quad, playerImageElements, this.vectorArtTextureInfo));
        playerGameObject.addComponent(new PlayerAnimator());     


        return playerGameObject;
    }

}

export default DoodleJumpSceneContent;