import Collider from "../../engine/components/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/Rigidbody";
import Transform from "../../engine/components/Transform";
import Platform from "./Platform";

class BouncePlatform extends Platform {
    private force : number;

    constructor(force : number) {
        super();
        this.force = force;

    }

    public awake(): void {
        this.gameObject.getComponent<Collider>(Collider)?.subcribeToCollisionEnter(this.bounce.bind(this));   
        this.gameObject.getComponent<Collider>(Collider)?.subcribeToCollisionStay(this.bounce.bind(this)); 
    }

    private bounce(other : Collider) {

        if (other.gameObject.name === "Player") {
            let playerRigidbody = other.gameObject.getComponent<Rigidbody>(Rigidbody);
            playerRigidbody?.addForce?.([0, this.force,0]);
        }

        
    }

    public destroy() {
        this.gameObject.getComponent<Collider>(Collider)?.unsubcribeToCollisionEnter(this.bounce.bind(this));   
        this.gameObject.getComponent<Collider>(Collider)?.unsubcribeToCollisionStay(this.bounce.bind(this)); 
    }


    public clone(): Component {
        return new BouncePlatform(this.force);        
    }
    
}

export default BouncePlatform;