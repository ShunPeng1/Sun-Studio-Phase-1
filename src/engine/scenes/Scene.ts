import GameObject from "./GameObject";

class Scene{
    
    private name: string;
    private gameObjects: GameObject[] = []; 

    constructor(name: string) {
        this.name = name;
    }

    public addGameObject(gameObject: GameObject) {
        gameObject.setScene(this);
        this.gameObjects.push(gameObject);
    }

    public removeGameObject(gameObject: GameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    public getName(): string {
        return this.name;
    }

    public getGameObjects(): GameObject[]{
        return this.gameObjects;
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