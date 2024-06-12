import GameObject from "../scenes/GameObject";
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

    public fixedUpdate(){
    }
    
    public render(time: number, deltaTime : number) {
    }

    public destroy() {
    }
    

    public abstract clone(): Component;
}

export default Component;