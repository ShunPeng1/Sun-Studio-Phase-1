import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Platform from "./Platform";

class PlatformDestroyer extends Component{
    private boundDestroyPlatform: (event: Collider) => void;

    constructor(){
        super();
        this.boundDestroyPlatform = this.destroyPlatform.bind(this);
    }

    public clone(): Component {
        return new PlatformDestroyer();
    }

    public awake(): void {
        let collider = this.gameObject.getComponent<Collider>(Collider)!;
        
        collider.subcribeToCollisionEnter(this.boundDestroyPlatform);
        collider.subcribeToCollisionStay(this.boundDestroyPlatform);
    }

    private destroyPlatform(other : Collider) : void {
        if (other.gameObject.getComponent<Platform>(Platform)) {
            other.gameObject.destroy();
        }
    }

    public destroy(): void {
        let collider = this.gameObject.getComponent<Collider>(Collider)!;
        
        collider.unsubcribeToCollisionEnter(this.boundDestroyPlatform);
        collider.unsubcribeToCollisionStay(this.boundDestroyPlatform);
    }
}

export default PlatformDestroyer;