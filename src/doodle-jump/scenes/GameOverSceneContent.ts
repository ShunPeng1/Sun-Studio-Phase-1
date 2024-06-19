import { vec3 } from "gl-matrix";
import GameObject from "../../engine/gameobjects/GameObject";
import DoodleJumpSceneContent from "./DoodleJumpSceneContent";
import TextRenderer, { Align, Baseline, FontStyle } from "../../engine/components/renderers/TextRenderer";
import TextWriter from "../scores/TextWriter";
import ScoreManager from "../ScoreManager";
import MeshRenderer from "../../engine/components/renderers/PremadeRenderer";

import SceneManager from "../../engine/scenes/SceneManager";
import RendererTextureSwapButton from "../../engine/components/ui/RendererTextureSwapButton";
import DoodleJumpSceneCollection from "./DoodleJumpSceneCollection";

class GameOverSceneContent extends DoodleJumpSceneContent{

    private TAP_TO_CHANGE_URL = `${this.ATLAS_URL}/tapToChange.png`;
    private GAME_OVER_URL = `${this.ATLAS_URL}/gameOver.png`;

    private PLAY_AGAIN_1_URL = `${this.ATLAS_URL}/playAgain_01.png`;
    private PLAY_AGAIN_2_URL = `${this.ATLAS_URL}/playAgain_02.png`;

    private MENU_1_URL = `${this.ATLAS_URL}/menu_01.png`;
    private MENU_2_URL = `${this.ATLAS_URL}/menu_02.png`;




    public download(): Promise<any>[] {
        let promises: Promise<any>[] = [];

        promises.push(this.imageLoader.loadImageFromUrls(this.BACKGROUND_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.TOP_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.GAME_OVER_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.PLAY_AGAIN_1_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.PLAY_AGAIN_2_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.MENU_1_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.MENU_2_URL));
        promises.push(this.imageLoader.loadImageFromUrls(this.TAP_TO_CHANGE_URL));


        return promises;
    }
    public create(): GameObject[] {
        let sceneGameObjects: GameObject[] = [];
    
        
        // Create Camera
        let camera = this.createCamera();
        sceneGameObjects.push(camera);

        // Add Background
        let paperBackground = this.createBackground();
        paperBackground.transform.setParent(camera.transform);
        

        // Add Score Panel
        let scorePanel = this.createScorePanel();
        scorePanel.transform.setParent(camera.transform);
        sceneGameObjects.push(scorePanel);


        
        // Game over images
        let gameOverGameObject = new GameObject('Game Over Image');
        vec3.set(gameOverGameObject.transform.position, 0, 20, 0);
        vec3.set(gameOverGameObject.transform.scale, 15, 15, 1);
        let gameOverImageElements = this.imageLoader.getImageElements(this.GAME_OVER_URL);
        gameOverGameObject.addComponent(new MeshRenderer(this.quad, gameOverImageElements, this.vectorArtTextureInfo));
        sceneGameObjects.push(gameOverGameObject);


        // Play Again Button
        let playAgainGameObject = new GameObject('Play Again Button');
        vec3.set(playAgainGameObject.transform.position, 2, -10, 0);
        vec3.set(playAgainGameObject.transform.scale, 7, 5, 1);
        let playAgainImageElements = this.imageLoader.getImageElements([this.PLAY_AGAIN_1_URL, this.PLAY_AGAIN_2_URL]);
        playAgainGameObject.addComponent(new MeshRenderer(this.quad, playAgainImageElements, this.vectorArtTextureInfo));
        playAgainGameObject.addComponent(new RendererTextureSwapButton(0,1, 220,520, 220,70, ()=>{
            SceneManager.getInstance().setNextSceneByName(DoodleJumpSceneCollection.MAIN_SCENE_NAME);
        }))
        sceneGameObjects.push(playAgainGameObject);


        // Menu Button
        let menuGameObject = new GameObject('Menu Button');
        vec3.set(menuGameObject.transform.position, 12, -17, 0);
        vec3.set(menuGameObject.transform.scale, 7, 5, 1);
        let menuImageElements = this.imageLoader.getImageElements([this.MENU_1_URL, this.MENU_2_URL]);
        menuGameObject.addComponent(new MeshRenderer(this.quad, menuImageElements, this.vectorArtTextureInfo));
        menuGameObject.addComponent(new RendererTextureSwapButton(0,1,340,610, 220,70, ()=>{
            SceneManager.getInstance().setNextSceneByName(DoodleJumpSceneCollection.MENU_SCENE_NAME);
        }))
        sceneGameObjects.push(menuGameObject);

        // Add Game Over Text

        let gameOverText = new GameObject('Game Over Text');
        vec3.set(gameOverText.transform.position, 0, 0, 0);
        vec3.set(gameOverText.transform.scale, 1, 1, 1);

        let yourScoreText = new TextRenderer('your score: ' + ScoreManager.getInstance().getScore().toString(), 300, 350, 'black', '30px','Arial', FontStyle.BOLD, Align.CENTER, Baseline.MIDDLE);
        gameOverText.addComponent(yourScoreText);
        gameOverText.addComponent(new TextWriter(yourScoreText, () => {
            return ScoreManager.getInstance().getScore().toString();
        }, "your score: "));
        
        let yourHighScoreText = new TextRenderer('your high score: ' + ScoreManager.getInstance().getHighScore().toString(), 265, 400, 'black','30px','Arial', FontStyle.BOLD, Align.CENTER, Baseline.MIDDLE);
        gameOverText.addComponent(yourHighScoreText);
        gameOverText.addComponent(new TextWriter(yourHighScoreText, () => {
            return ScoreManager.getInstance().getHighScore().toString();
        }, "your high score: "));
        
        let youtNameText = new TextRenderer('your name: ', 350, 450, 'black', '30px','Arial', FontStyle.BOLD, Align.CENTER, Baseline.MIDDLE);
        gameOverText.addComponent(youtNameText);
        gameOverText.addComponent(new TextWriter(youtNameText, () => {
            return "Shun Peng";
        }, "your name: "));

        sceneGameObjects.push(gameOverText);

        // Tap to change image
        let tapToChangeGameObject = new GameObject('Tap To Change Image');
        vec3.set(tapToChangeGameObject.transform.position, 14, -5, 0);
        vec3.set(tapToChangeGameObject.transform.scale, 9, 9, 1);
        let tapToChangeImageElements = this.imageLoader.getImageElements(this.TAP_TO_CHANGE_URL);
        tapToChangeGameObject.addComponent(new MeshRenderer(this.quad, tapToChangeImageElements, this.vectorArtTextureInfo));
        sceneGameObjects.push(tapToChangeGameObject);


        
        return sceneGameObjects;
    }

}

export default GameOverSceneContent;