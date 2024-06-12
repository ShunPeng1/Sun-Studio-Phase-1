import Component from "../components/Component";
import Transform from "../components/Transform";


class GameObject {
    public name: string = 'GameObject';
    public readonly transform: Transform;

    private components: Component[] = []; 
    
    private isDestroyed: boolean = false;
    private isMarkedForDestruction: boolean = false;

    constructor(name: string = 'New GameObject') {
        this.name = name;
        this.transform = new Transform();
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

    public update() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update();
        }
    }

    public render() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].render();
        }
    }

    public fixedUpdate() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].fixedUpdate();
        }
    }


    public addComponent(component: Component) {
        this.components.push(component);
    }

    public getComponent<T extends Component>(type: {new(): T}): T | null {
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

        gameObject.awake(); // Awake the new game object similar to Unity
        return gameObject;
    }

    public destroy() {
        this.isMarkedForDestruction = true;
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].destroy();
        }

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