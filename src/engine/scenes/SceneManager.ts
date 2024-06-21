import Scene from './Scene';

class SceneManager {
    private static instance: SceneManager ;
    private scenes: Scene[] = [];
    private currentScene: Scene | null = null;

    private nextScene: Scene | null = null;

    private constructor() {
        this.scenes = [];
        this.currentScene = null;
    }

    public static getInstance() {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    public addScene(scene: Scene) {
        this.scenes.push(scene);
    }

    public getCurrentScene() {
        return this.currentScene;
    }

    public getScenes() {
        return this.scenes;
    }

    public getSceneByName(name: string) {
        return this.scenes.find(scene => scene.getName() === name);
    }

    public getSceneIndex(scene: Scene) {
        return this.scenes.indexOf(scene);
    }

    public getSceneIndexByName(name: string) {
        return this.scenes.findIndex(scene => scene.getName() === name);
    }

    public setNextSceneByName(sceneName: string) {
        const scene = this.getSceneByName(sceneName);
        if (scene) {
            this.nextScene = scene;
        }
    }

    public setNextScene(scene: Scene) {
        this.nextScene = scene;
    }


    private loadScene(scene: Scene) {
        if (this.currentScene){
            this.currentScene.unload();
        }

        scene.createContent();
        scene.load();
        
        this.currentScene = scene;
    }

    

    public nextFrame(){
        if (this.nextScene) {
            this.loadScene(this.nextScene);
            this.nextScene = null;
        }
        else{
            this.currentScene?.nextFrame();
        }
    }

    public removeScene(scene: Scene) {
        const index = this.getSceneIndex(scene);
        if (index !== -1) {
            this.scenes.splice(index, 1);
        }
    }

    public removeSceneByName(name: string) {
        const index = this.getSceneIndexByName(name);
        if (index !== -1) {
            this.scenes.splice(index, 1);
        }
    }


    public async downloadScenesContent() {
        const downloadPromises = this.scenes.map(scene => scene.downloadContent());
        
        await Promise.all(downloadPromises.flat());
    }

}

export default SceneManager;