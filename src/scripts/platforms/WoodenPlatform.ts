import Collider from "../../engine/components/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/Rigidbody";
import Transform from "../../engine/components/Transform";
import Player from "../player/Player";
import Platform from "./Platform";

class WoodenPlatform extends Platform {
    
    private isBroken : boolean = false;

    protected onContact(other: Collider): void {
        if (other.gameObject.getComponent<Player>(Player) && !this.isBroken) {
            this.break();
        }
    }


    protected break(){
        this.isBroken = true;
        
        this.gameObject.destroy();
    }

    public clone(): Component {
        return new WoodenPlatform();        
    }
    
}

export default WoodenPlatform;