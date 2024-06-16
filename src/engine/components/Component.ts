import GameObject from "../gameobjects/GameObject";
import Transform from "./Transform";

abstract class Component {
    public gameObject: GameObject;
    public transform: Transform;

    private isAwaked: boolean = false;
    private isStarted: boolean = false;

    public setGameObject(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.transform = gameObject.transform;
    }

    public tryAwake() {
        if (!this.isAwaked) {
            this.isAwaked = true;
            this.awake();
        }
        else{
            return;
        }
    }

    public awake() {
    }

    public tryStart() {
        if (!this.isStarted) {
            this.isStarted = true;
            this.start();
        }
        else{
            return;
        }
    }

    protected start() {
        
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