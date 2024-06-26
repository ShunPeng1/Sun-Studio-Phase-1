import GameObject from "../gameobjects/GameObject";
import Transform from "./Transform";

abstract class Component {
    public gameObject: GameObject;
    public transform: Transform;

    private isAwaked: boolean = false;
    private isStarted: boolean = false;

    protected isEnable: boolean = false;

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
            this.setEnable(true);

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

    public lateUpdate(time: number, deltaTime : number){
    
    }

    public fixedUpdate(fixedLastTime: number, fixedDeltaTime : number){
    }
    
    public render(time: number, deltaTime : number) {
    }

    public tryDestroy() {
        this.setEnable(false);
        this.destroy();
    }

    protected destroy() {
    }
    
    public setEnable(isEnable: boolean) {
        if (this.isEnable == isEnable) {
            return;
        }
        this.isEnable = isEnable;
        if (isEnable) {
            this.onEnable();
        }
        else {
            this.onDisable();
        }
    }

    public getIsEnable() {
        return this.isEnable;
    }

    protected onEnable() {
        
    }

    protected onDisable() {
    
    }

    public abstract clone(): Component;
}

export default Component;