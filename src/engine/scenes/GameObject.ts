import Component from "../components/Component";
import Transform from "../components/Transform";
import Scene from "./Scene";


class GameObject {
    
    public name: string = 'GameObject';
    public readonly transform: Transform;

    private components: Component[] = []; 
    
    private isDestroyed: boolean = false;
    private isMarkedForDestruction: boolean = false;
    private scene: Scene;

    constructor(name: string = 'New GameObject') {
        this.name = name;
        this.transform = new Transform();
        this.transform.setGameObject(this);
    }

    public awake() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].awake();
        }
    }
    
    public start() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].start();
        }
    }

    public update(time: number, deltaTime : number) {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update(time, deltaTime);
        }
    }

    public render(time: number, deltaTime : number) {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].render(time, deltaTime);
        }
    }

    public fixedUpdate(fixedLastTime: number, fixedDeltaTime : number) {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].fixedUpdate(fixedLastTime, fixedDeltaTime);
        }
    }

    public setScene(scene: Scene) {
        this.scene = scene;
    }

    public addComponent(component: Component) {
        component.setGameObject(this);
        this.components.push(component);
    }

    public getComponent<T extends Component>(type: {new(...args: any[]): T}): T | null {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof type) {
                return this.components[i] as T;
            }
        }
        return null;
    }

    public clone(): GameObject {
        let gameObject = new GameObject(this.name+" (Clone)");
        gameObject.transform.setTransformFromTransform(this.transform);
        for (let i = 0; i < this.components.length; i++) {
            gameObject.addComponent(this.components[i].clone());
        }

        this.scene.addGameObject(gameObject);
        gameObject.awake(); // Awake the new game object similar to Unity
        return gameObject;
    }

    public destroy() {
        this.isMarkedForDestruction = true;
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].destroy();
        }
        this.scene.removeGameObject(this);
        this.isDestroyed = true;
    }

    public getIsDestroyed() : boolean {
        return this.isDestroyed;
    }

    public getIsMarkedForDestruction() : boolean {
        return this.isMarkedForDestruction;
    }
    
}

export default GameObject;