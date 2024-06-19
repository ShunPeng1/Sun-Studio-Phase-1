import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";

abstract class Platform extends Component{
    private boundOnContact: (event: Collider) => void;

    constructor(){
        super();
        this.boundOnContact = this.onContact.bind(this);
    }
    
    public awake(){
        this.gameObject.getComponent<Collider>(Collider)?.subcribeToCollisionEnter(this.boundOnContact);   
        this.gameObject.getComponent<Collider>(Collider)?.subcribeToCollisionStay(this.boundOnContact);
    }

    public destroy() {
        this.gameObject.getComponent<Collider>(Collider)?.unsubcribeToCollisionEnter(this.boundOnContact);   
        this.gameObject.getComponent<Collider>(Collider)?.unsubcribeToCollisionStay(this.boundOnContact);
    }

    protected abstract onContact(other : Collider): void;
}

export default Platform;