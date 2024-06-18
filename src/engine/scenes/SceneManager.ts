import Scene from './Scene';

class SceneManager {
    private static instance: SceneManager ;
    private scenes: Scene[] = [];
    private currentScene: Scene | null = null;
    private startScene: Scene | null = null;

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

    public setStartScene(scene: Scene) {
        this.startScene = scene;
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

    public loadSceneByName(sceneName: string) {
        const scene = this.getSceneByName(sceneName);
        if (scene) {
            this.loadScene(scene);
        }
    }

    public loadStartScene() {
        if (this.startScene) {
            this.loadScene(this.startScene);
        }
        else{
            this.loadScene(this.scenes[0]);
        }
    }


    public loadScene(scene: Scene) {
        if (this.currentScene){
            this.currentScene.unload();
        }

        scene.load();
        
        this.currentScene = scene;
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


    private async downloadScenesContent() {
        const downloadPromises = this.scenes.map(scene => scene.downloadContent());
        
        await Promise.all(downloadPromises.flat());
    }

    public async createScenesContent() {
        await this.downloadScenesContent();
    
        this.scenes.forEach(scene => {
            scene.createContent();
        })
    };
}

export default SceneManager;