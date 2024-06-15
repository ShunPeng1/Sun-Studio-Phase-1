import Collider from "../../engine/components/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/Rigidbody";
import Transform from "../../engine/components/Transform";
import Platform from "./Platform";

class BreakablePlatform extends Platform {

    public awake(): void {
        this.gameObject.getComponent<Collider>(Collider)?.subcribeToCollisionEnter(this.checkBreak.bind(this));   
    }

    private checkBreak(other : Collider) {

        if (other.gameObject.name === "Player") {
            this.gameObject.destroy();
        }
    }

    public clone(): Component {
        return new BreakablePlatform();        
    }
    
}

export default BreakablePlatform;