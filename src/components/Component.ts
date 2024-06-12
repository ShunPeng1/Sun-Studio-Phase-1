abstract class Component {
    
    constructor() {
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