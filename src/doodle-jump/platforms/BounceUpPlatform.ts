import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import Transform from "../../engine/components/Transform";
import Player from "../player/Player";
import Platform from "./Platform";

class BounceUpPlatform extends Platform {
    
    private force : number;

    constructor(force : number) {
        super();
        this.force = force;

    }

    protected onContact(other : Collider): void {
        if (other.gameObject.getComponent<Player>(Player)) {
            this.bounce(other);
        }
    }

    private bounce(other : Collider) {
        let playerRigidbody = other.gameObject.getComponent<Rigidbody>(Rigidbody);
        playerRigidbody?.addForce?.([0, this.force,0]);
    
    }



    public clone(): Component {
        return new BounceUpPlatform(this.force);        
    }
    
}

export default BounceUpPlatform;