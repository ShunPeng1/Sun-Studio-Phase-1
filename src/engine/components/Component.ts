import GameObject from "../gameobjects/GameObject";
import Transform from "./Transform";

abstract class Component {
    public gameObject: GameObject;
    public transform: Transform;


    public setGameObject(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.transform = gameObject.transform;
    }

    public awake() {
    }

    public start() {
    }

    public update(time: number, deltaTime : number){
    }

    public fixedUpdate(fixedLastTime: number, fixedDeltaTime : number){
    }
    
    public render(time: number, deltaTime : number) {
    }

    public destroy() {
    }
    

    public abstract clone(): Component;
}

export default Component;