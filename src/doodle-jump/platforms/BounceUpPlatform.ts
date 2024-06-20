import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import Transform from "../../engine/components/Transform";
import PlayerEquipment from "../player/PlayerEquipment";
import Platform from "./Platform";
import { EventEmitter } from 'events';
import PlayerFeet from "../player/PlayerFeet";


class BounceUpPlatform extends Platform {
    
    private force : number;
    private eventEmitter: EventEmitter;

    constructor(force : number) {
        super();
        this.force = force;

        this.eventEmitter = new EventEmitter();

    }

    protected onContact(other : Collider): void {
        let playerFeet = other.gameObject.getComponent<PlayerFeet>(PlayerFeet);
        if (playerFeet) {
            this.bounce(other);
            playerFeet.jump();
        }
    }

    private bounce(other : Collider) {
        let playerRigidbody = other.gameObject.getComponent<Rigidbody>(Rigidbody)!;

        playerRigidbody.velocity[1] = 0;
        playerRigidbody.acceleration[1] = 0; 


        playerRigidbody?.addForce?.([0, this.force,0]);

        // Emit the bounce event
        this.eventEmitter.emit('bounce', other);
        
    }

    // Method to subscribe to the bounce event
    public onBounce(listener: (other: Collider) => void): void {
        this.eventEmitter.on('bounce', listener);
    }

    public clone(): Component {
        return new BounceUpPlatform(this.force);        
    }
    
}

export default BounceUpPlatform;