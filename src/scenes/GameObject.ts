import Transform from "../components/Transform";


class GameObject {
    public readonly transform: Transform;

    private components: Components[] = []; 

    constructor() {
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


    public addComponent(component: Components) {
        this.components.push(component);
    }

    public getComponent<T extends Components>(type: {new(): T}): T | null {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof type) {
                return this.components[i] as T;
            }
        }
        return null;
    }

    public clone(): GameObject {
        let gameObject = new GameObject();
        gameObject.transform.setTransformFromTransform(this.transform);
        for (let i = 0; i < this.components.length; i++) {
            gameObject.addComponent(this.components[i].clone());
        }
        return gameObject;
    }

    
}

export default GameObject;