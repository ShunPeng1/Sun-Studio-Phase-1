import { vec3 } from "gl-matrix";
import GameObject from "../../engine/gameobjects/GameObject";
import DoodleJumpSceneContent from "./DoodleJumpSceneContent";
import MeshRenderer from "../../engine/components/renderers/MeshRenderer";
import RendererTextureSwapButton from "../../engine/components/ui/RendererTextureSwapButton";
import SceneManager from "../../engine/scenes/SceneManager";
import InitialForce from "../movement/InitialForce";
import Collider from "../../engine/components/physics/Collider";
import BoxCollider from "../../engine/components/physics/BoxCollider";
import BounceUpPlatform from "../platforms/BounceUpPlatform";
import JumpPlatformIgnorance from "../player/JumpPlatformIgnorance";
import DoodleJumpSceneCollection from "./DoodleJumpSceneCollection";

class MenuSceneContent extends DoodleJumpSceneContent{

    private PLAY1_URL = `${this.ATLAS_URL}/Play_01.png`;
    private PLAY2_URL = `${this.ATLAS_URL}/Play_02.png`;

    private BACKGROUND_MENU_URL = `${this.ATLAS3_URL}/bgMenu.png`;

    public download(): Promise<any>[] {
        let promises: Promise<any>[] = [];

        promises.push(...this.downloadPlayerImages());

        promises.push(this.imageLoader.loadImageFromUrls(this.PLATFORM0_URL));

        promises.push(this.imageLoader.loadImageFromUrls(this.BACKGROUND_MENU_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.PLAY1_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.PLAY2_URL));



        return promises;
    }
    public create(): GameObject[] {
        let sceneGameObjects: GameObject[] = [];

        // Create Camera
        let camera = this.createCamera();
        sceneGameObjects.push(camera);


        // Add Background
        let background = new GameObject('Background');
        vec3.set(background.transform.position, 0, 40, -65);
        vec3.set(background.transform.scale, 28, 80, 1);
        let backgroundElements = this.imageLoader.getImageElements(this.BACKGROUND_MENU_URL);
        background.addComponent(new MeshRenderer(this.quad, backgroundElements, this.vectorArtTextureInfo));
        sceneGameObjects.push(background);

        // Add Player
        let player = this.createPlayer();
        vec3.set(player.transform.position, -15, -30, 1);
        vec3.set(player.transform.rotation, 0, Math.PI, 0);
        vec3.set(player.transform.scale, 4, 4, 1);
        player.addComponent(new InitialForce([0, 5000, 0]));
        player.addComponent(new JumpPlatformIgnorance())
        sceneGameObjects.push(player);

        // Add Green Platform
        let greenPlatform = new GameObject('Green Platform');
        vec3.set(greenPlatform.transform.position, -15, -20, 0);
        vec3.set(greenPlatform.transform.scale, 4, 2, 1);

        greenPlatform.addComponent(new BoxCollider(false, 0, 1, 2, 1, DoodleJumpSceneCollection.PLATFORM_LAYER));
        greenPlatform.addComponent(new BounceUpPlatform(4000));
        let platformImageElements = this.imageLoader.getImageElements(this.PLATFORM0_URL);
        greenPlatform.addComponent(new MeshRenderer(this.quad, platformImageElements, this.vectorArtTextureInfo));
        sceneGameObjects.push(greenPlatform);


        // Add Play Button
        let playButton = new GameObject('Play Button');
        
        vec3.set(playButton.transform.position, -7, 15, 0);
        vec3.set(playButton.transform.scale, 7, 5, 1);
        let playButtonImageElements = this.imageLoader.getImageElements([this.PLAY1_URL, this.PLAY2_URL]);
        let playButtonRenderer = new MeshRenderer(this.quad, playButtonImageElements, this.vectorArtTextureInfo);
        playButton.addComponent(playButtonRenderer);
        playButton.addComponent(new RendererTextureSwapButton(0,1, 100,200, 220,90, () =>{
            SceneManager.getInstance().setNextSceneByName('main');
            //console.log('Play Button Clicked');
        } ));

        sceneGameObjects.push(playButton);




        return sceneGameObjects;
    }


}

export default MenuSceneContent;