import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import Transform from "../../engine/components/Transform";
import Player from "../player/Player";
import Platform from "./Platform";
import PhysicManager from "../../engine/physics/PhysicManager";
import PlatformDestroyer from "./PlatformDestroyer";

class WoodenPlatform extends Platform {
    
    
    public isBroken : boolean = false;
    private fallSpeed : number = 0.1;
    private fallTimeDestroy : number = 0;

    private fallTime : number = 0;
    constructor(fallSpeed : number, fallTimeDestroy : number){
        super();
        this.fallSpeed = fallSpeed;
        this.fallTimeDestroy = fallTimeDestroy;
    }


    protected onContact(other: Collider): void {
        if (other.gameObject.getComponent<Player>(Player) && !this.isBroken) {
            
            this.isBroken = true;
        }
    }

    
    
    public update(time: number, deltaTime: number): void {
        if (this.isBroken) {
            this.transform.position[1] -= this.fallSpeed * deltaTime;
        }

    }


    public clone(): Component {
        return new WoodenPlatform(this.fallSpeed, this.fallTimeDestroy);        
    }
    
}

export default WoodenPlatform;