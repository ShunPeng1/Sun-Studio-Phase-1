import Scene from './Scene';

class SceneManager {
    
    private scenes: Scene[] = [];
    private currentScene: Scene | null = null;

    constructor() {
        this.scenes = [];
        this.currentScene = null;
    }

    addScene(scene: Scene) {
        this.scenes.push(scene);
    }

    setCurrentScene(scene: Scene) {
        this.currentScene = scene;
    }

    getCurrentScene() {
        return this.currentScene;
    }

    getScenes() {
        return this.scenes;
    }

    getSceneByName(name: string) {
        return this.scenes.find(scene => scene.getName() === name);
    }

    getSceneIndex(scene: Scene) {
        return this.scenes.indexOf(scene);
    }

    getSceneIndexByName(name: string) {
        return this.scenes.findIndex(scene => scene.getName() === name);
    }

    loadSceneByName(sceneName: string) {
        const scene = this.getSceneByName(sceneName);
        if (scene) {
            this.loadScene(scene);
        }
    }

    loadScene(scene: Scene) {
        if (this.currentScene){
            this.currentScene.unload();
        }

        scene.load();
        
        this.setCurrentScene(scene);
    }

    removeScene(scene: Scene) {
        const index = this.getSceneIndex(scene);
        if (index !== -1) {
            this.scenes.splice(index, 1);
        }
    }

    removeSceneByName(name: string) {
        const index = this.getSceneIndexByName(name);
        if (index !== -1) {
            this.scenes.splice(index, 1);
        }
    }
}

export default SceneManager;