import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Platform from "../platforms/Platform";
import PlatformItem from "../platform-items/PlatformItem";
import Obstacle from "../obstacles/Obstacle";

class EnvironmentDestroyer extends Component{
    private boundDestroyPlatform: (event: Collider) => void;

    constructor(){
        super();
        this.boundDestroyPlatform = this.destroyEnvironment.bind(this);
    }

    public clone(): Component {
        return new EnvironmentDestroyer();
    }

    public awake(): void {
        let collider = this.gameObject.getComponent<Collider>(Collider)!;
        
        collider.subcribeToCollisionEnter(this.boundDestroyPlatform);
        collider.subcribeToCollisionStay(this.boundDestroyPlatform);
    }

    private destroyEnvironment(other : Collider) : void {
        if (other.gameObject.getComponent<Platform>(Platform)) {
            other.gameObject.destroy();
        }

        if (other.gameObject.getComponent<PlatformItem>(PlatformItem)) {
            other.gameObject.destroy();
        }

        if (other.gameObject.getComponent<Obstacle>(Obstacle)) {
            other.gameObject.destroy();
        }
    }

    public destroy(): void {
        let collider = this.gameObject.getComponent<Collider>(Collider)!;
        
        collider.unsubcribeToCollisionEnter(this.boundDestroyPlatform);
        collider.unsubcribeToCollisionStay(this.boundDestroyPlatform);
    }
}

export default EnvironmentDestroyer;