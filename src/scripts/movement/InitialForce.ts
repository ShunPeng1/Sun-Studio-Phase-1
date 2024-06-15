import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/Rigidbody";

class InitialForce extends Component{
    
    constructor(private force : vec3) {
        super();
    }

    public start(): void {
        this.gameObject.getComponent<Rigidbody>(Rigidbody)?.addForce(this.force);
    
        this.gameObject.removeComponent(this);
    }

    
    
    
    public clone(): Component {
        return new InitialForce(this.force);
    }

}

export default InitialForce;