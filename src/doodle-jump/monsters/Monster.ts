import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import Player from "../player/Player";
import PlayerEquipment from "../player/PlayerEquipment";
import PlayerGameOverContact from "../player/PlayerGameOverContact";
import Rigidbody from "../../engine/components/physics/Rigidbody";


class Monster extends Component {
    
    private collider : Collider;

    private onColliderHit : (other : Collider) => void ;

    constructor() {
        super();
    
        this.onColliderHit = this.checkPlayerHit.bind(this);
    }


    public awake(): void {
        this.collider = this.gameObject.getComponent<Collider>(Collider)!;


    }
    
    protected onEnable(): void {
        this.collider.subcribeToCollisionEnter(this.onColliderHit);
    
    }  

    checkPlayerHit(other : Collider){
        let player = other.gameObject.getComponent<Player>(Player);
        if(player){
            player.stun(1);
            

            let playerRigidbody = player.gameObject.getComponent<Rigidbody>(Rigidbody)!;

            let pushForceX = (Math.random() - 0.5) * 20;
            let pushForceY = (Math.random() - 0.5) * 20;
    
            let pushForce = vec3.fromValues(pushForceX, pushForceY, 0);
    
            // Apply the force to the player
            
            playerRigidbody.addForce(pushForce);
        
        }

    }


    protected onDisable(): void {
        this.collider.unsubcribeToCollisionEnter(this.onColliderHit);
    }
    
    public clone(): Component {
        return new Monster();
    }

}

export default Monster;