import GameObject from "../gameobjects/GameObject";
import ISceneContent from "./ISceneContent";

class Scene{
    
    private name: string;
    private gameObjects: GameObject[] = []; 
    private content: ISceneContent;

    constructor(name: string, content : ISceneContent) {
        this.name = name;
        this.content = content;
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

    public downloadContent() : Promise<any> []{
        return this.content.download(); // Ensure this returns a Promise
    }

    public createContent(){
        this.gameObjects = this.content.create();
        for (let gameObject of this.gameObjects){
            gameObject.setScene(this);
        }
    }


    public load() {
        this.gameObjects.forEach((gameObject) => {
            gameObject.awake();
        });

    }

    public unload() {

        let gameObjects = this.gameObjects.slice();
        gameObjects.forEach((gameObject) => {
            console.log("Destroy ", gameObject.name)
            gameObject.destroy();
        });

        this.gameObjects = [];
    }

}

export default Scene;