import WayPointMovement from "../../doodle-jump/movement/WayPointMovement";
import Component from "../components/Component";
import Transform from "../components/Transform";
import Scene from "../scenes/Scene";


class GameObject {
    
    public name: string = 'GameObject';
    public readonly transform: Transform;

    private components: Component[] = []; 
    
    private isEnable: boolean = true;
    private isDestroyed: boolean = false;
    private isMarkedForDestruction: boolean = false;
    private scene: Scene;

    public readonly id: number;
    private static lastId: number = 0;

    constructor(name: string = 'New GameObject') {
        this.name = name;
        this.transform = new Transform();
        this.transform.setGameObject(this);

        this.id = GameObject.lastId;
        GameObject.lastId++;
    }

    public awake() {


        for (let i = 0; i < this.components.length; i++) {
            this.components[i].tryAwake();
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.awake();
        }
    }
    
    private start() {
        
        if (this.isEnable == false) {
            return;
        }

        for (let i = 0; i < this.components.length; i++) {
            this.components[i].tryStart();
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.start();
        }
    }

    public update(time: number, deltaTime : number) {
        
        if (this.isEnable == false) {
            return;
        }

        this.start();

        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update(time, deltaTime);
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.update(time, deltaTime);
        }
    }

    public render(time: number, deltaTime : number) {
        
        if (this.isEnable == false) {
            return;
        }

        for (let i = 0; i < this.components.length; i++) {
            this.components[i].render(time, deltaTime);
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.render(time, deltaTime);
        }
    }

    public fixedUpdate(fixedLastTime: number, fixedDeltaTime : number) {
        
        if (this.isEnable == false) {
            return;
        }

        this.start();

        for (let i = 0; i < this.components.length; i++) {
            this.components[i].fixedUpdate(fixedLastTime, fixedDeltaTime);
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.fixedUpdate(fixedLastTime, fixedDeltaTime);
        }
    }

    public setScene(scene: Scene) {
        this.scene = scene;

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.setScene(scene);
        }
    }

    public getScene() {
        return this.scene;
    }

    public addComponent(component: Component) {
        component.setGameObject(this);
        this.components.push(component);
    }

    public getComponent<T extends Component>(type: (new(...args: any[]) => T) | {prototype: T}): T | null {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof (type as any)) {
                return this.components[i] as T;
            }
        }
        return null;
    }
    
    public getComponentInParent<T extends Component>(type: (new(...args: any[]) => T) | {prototype: T}): T | null {
        let parent = this.transform.getParent();
        while (parent) {
            let component = parent.gameObject.getComponent<T>(type);
            if (component) {
                return component;
            }
            parent = parent.transform.getParent();
        }
        return null;
    }

    public getComponentInChildren<T extends Component>(type: (new(...args: any[]) => T) | {prototype: T}): T | null {
        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            let component = children[i].gameObject.getComponent<T>(type);
            if (component) {
                return component;
            }
        }
    
        for (let i = 0; i < children.length; i++) {
            let child = children[i].gameObject.getComponentInChildren<T>(type);
            if (child) {
                return child;
            }
        }
    
        return null;
    }
    

    public removeComponent(component: Component) {
        let index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
        }
    }

    public setEnable(isEnable: boolean) {
        if (this.isEnable == isEnable) {
            return;
        }

        this.isEnable = isEnable;

        for (let i = 0; i < this.components.length; i++) {
            this.components[i].setEnable(isEnable);
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.setEnable(isEnable);
        }

    }

    public getEnable() {
        return this.isEnable;
    }
    

    public clone(parent : Transform | null = null): GameObject {
        let gameObject = new GameObject(this.name+" (Clone)");
        gameObject.transform.setScaleFromVec3(this.transform.getScale());
        gameObject.transform.setParent(parent);
        for (let i = 0; i < this.components.length; i++) {
            gameObject.addComponent(this.components[i].clone());
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            let child = children[i].gameObject.clone(gameObject.transform);
        }
        
        if (parent == null) {
            this.scene.addGameObject(gameObject);        
            gameObject.awake(); // Awake the new game object similar to Unity
        }
        return gameObject;
    }

    public destroy() {
        if (this.isMarkedForDestruction)
        {
            return;
        }
        this.isMarkedForDestruction = true;
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].tryDestroy();
        }

        let children = this.transform.getChildren();
        for (let i = 0; i < children.length; i++) {
            children[i].gameObject.destroy();
        }
        
        this.scene.removeGameObject(this);

        let parent = this.transform.getParent();
        if (parent) {
            parent.gameObject.transform.removeChild(this.transform);    
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