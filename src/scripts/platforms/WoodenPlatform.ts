import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import Transform from "../../engine/components/Transform";
import Player from "../player/Player";
import Platform from "./Platform";

class WoodenPlatform extends Platform {
    
    public isBroken : boolean = false;
    private fallSpeed : number = 0.1;
    constructor(fallSpeed : number){
        super();
        this.fallSpeed = fallSpeed;
    }

    protected onContact(other: Collider): void {
        if (other.gameObject.getComponent<Player>(Player) && !this.isBroken) {
            this.break();
        }
    }

    public update(time: number, deltaTime: number): void {
        if (this.isBroken) {
            this.transform.position[1] -= this.fallSpeed * deltaTime;
        }
    }

    protected break(){
        this.isBroken = true;
        
    }


    public clone(): Component {
        return new WoodenPlatform(this.fallSpeed);        
    }
    
}

export default WoodenPlatform;