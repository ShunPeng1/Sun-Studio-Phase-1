import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import Transform from "../../engine/components/Transform";
import Player from "../player/Player";
import Platform from "./Platform";

class WoodenPlatform extends Platform {
    
    public isBroken : boolean = false;

    protected onContact(other: Collider): void {
        if (other.gameObject.getComponent<Player>(Player) && !this.isBroken) {
            this.break();
        }
    }


    protected break(){
        this.isBroken = true;
        
    }

    public clone(): Component {
        return new WoodenPlatform();        
    }
    
}

export default WoodenPlatform;