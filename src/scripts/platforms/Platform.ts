import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";

abstract class Platform extends Component{
    
    
    public awake(){
        this.gameObject.getComponent<Collider>(Collider)?.subcribeToCollisionEnter(this.onContact.bind(this));   
        this.gameObject.getComponent<Collider>(Collider)?.subcribeToCollisionStay(this.onContact.bind(this));
    }

    public destroy() {
        this.gameObject.getComponent<Collider>(Collider)?.unsubcribeToCollisionEnter(this.onContact.bind(this));   
        this.gameObject.getComponent<Collider>(Collider)?.unsubcribeToCollisionStay(this.onContact.bind(this));
    }

    protected abstract onContact(other : Collider): void;

    

}

export default Platform;