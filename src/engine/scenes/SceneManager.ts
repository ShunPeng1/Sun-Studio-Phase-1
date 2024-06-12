import Scene from './Scene';

class SceneManager {
    
    private scenes: Scene[] = [];
    private currentScene: Scene | null = null;

    constructor() {
        this.scenes = [];
        this.currentScene = null;
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

    public loadSceneByName(sceneName: string) {
        const scene = this.getSceneByName(sceneName);
        if (scene) {
            this.loadScene(scene);
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
}

export default SceneManager;