import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Player from "../player/PlayerWear";
import Platform from "./Platform";

class CloudPlatform extends Platform {
  
    constructor() {
        super();
    }   

    protected onContact(other: Collider): void {
        if (other.gameObject.getComponent<Player>(Player)) {
            this.gameObject.destroy();
        }
    }
    public clone(): Component {
        return new CloudPlatform();
    }
}

export default CloudPlatform;
 