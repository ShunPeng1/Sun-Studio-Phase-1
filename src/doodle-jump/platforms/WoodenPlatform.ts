import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import Transform from "../../engine/components/Transform";
import PlayerEquipment from "../player/PlayerEquipment";
import Platform from "./Platform";
import PhysicManager from "../../engine/physics/PhysicManager";
import EnvironmentDestroyer from "../spawners/EnvironmentDestroyer";

class WoodenPlatform extends Platform {
    
    
    public isBroken : boolean = false;
    private fallSpeed : number = 0.1;
    
    constructor(fallSpeed : number){
        super();
        this.fallSpeed = fallSpeed;
    }


    protected onContact(other: Collider): void {
        if (other.gameObject.getComponent<PlayerEquipment>(PlayerEquipment) && !this.isBroken) {
            
            this.isBroken = true;
        }
    }

    
    
    public update(time: number, deltaTime: number): void {
        if (this.isBroken) {
            this.transform.position[1] -= this.fallSpeed * deltaTime;
        }

    }


    public clone(): Component {
        return new WoodenPlatform(this.fallSpeed);        
    }
    
}

export default WoodenPlatform;