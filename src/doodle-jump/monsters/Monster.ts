import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import Player from "../player/Player";
import PlayerEquipment from "../player/PlayerEquipment";
import PlayerGameOverContact from "../player/PlayerGameOverContact";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import Obstacle from "./Obstacle";


class Monster extends Obstacle {

    private stunTime : number;
    private minKnockBackForce : vec3;
    private maxKnockBackForce : vec3;
    constructor( stunTime : number = 2, minKnockBackForce : vec3 = vec3.fromValues(1000, 1000, 0), maxKnockBackForce : vec3 = vec3.fromValues(4000, 4000, 0)) {
        super();
    
        this.stunTime = stunTime;
        this.minKnockBackForce = minKnockBackForce;        
    
        this.maxKnockBackForce = maxKnockBackForce;
    }




    protected onPlayerHit(player: Player): void {
        player.stun(this.stunTime);
            

            let playerRigidbody = player.gameObject.getComponent<Rigidbody>(Rigidbody)!;

            let pushForceX = (Math.random() - 0.5) * (this.maxKnockBackForce[0] - this.minKnockBackForce[0]) + this.minKnockBackForce[0];
            let pushForceY = (Math.random() - 0.5) * (this.maxKnockBackForce[1] - this.minKnockBackForce[1]) + this.minKnockBackForce[1];
    
            let pushForce = vec3.fromValues(pushForceX, pushForceY, 0);
    
            // Apply the force to the player
            
            playerRigidbody.velocity = vec3.fromValues(0,0,0)

            playerRigidbody.addForce(pushForce)
    }
    
    public clone(): Component {
        return new Monster(this.stunTime, this.minKnockBackForce, this.maxKnockBackForce);
    }

}

export default Monster;