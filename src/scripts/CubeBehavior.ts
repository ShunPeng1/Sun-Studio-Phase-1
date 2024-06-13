import Component from "../engine/components/Component";

class CubeBehavior extends Component {
    
    constructor() {
        super();
    
    }

    public render(time: number, deltaTime: number): void {
        console.log("CubeBehavior update");
    }
    
    public clone(): Component {
        return new CubeBehavior();
    }
}

export default CubeBehavior;