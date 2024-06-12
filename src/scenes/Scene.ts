import GameObject from "./GameObject";

class Scene{
    private name: string;
    private gameObjects: GameObject[] = []; 

    constructor(name: string) {
        this.name = name;
    }

    public addGameObject(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
    }

    public removeGameObject(gameObject: GameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    public getName() {
        return this.name;
    }

    public load() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.awake();
        });

    }

    public unload() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.destroy();
        });
    }

}

export default Scene;