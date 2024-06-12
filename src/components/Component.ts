abstract class Component {
    
    constructor() {
    }

    public awake() {
    }

    public start() {
    }

    public update(){
    }

    public fixedUpdate(){
    }
    
    public render() {
    }

    public destroy() {
    }
    

    public abstract clone(): Component;
}

export default Component;