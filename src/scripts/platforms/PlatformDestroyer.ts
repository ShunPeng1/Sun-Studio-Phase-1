import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Platform from "./Platform";

class PlatformDestroyer extends Component{
    public clone(): Component {
        return new PlatformDestroyer();
    }

    public awake(): void {
        let collider = this.gameObject.getComponent<Collider>(Collider)!;
        
        collider.subcribeToCollisionEnter(this.destroyPlatform.bind(this));
        collider.subcribeToCollisionStay(this.destroyPlatform.bind(this));

    }

    private destroyPlatform(other : Collider) : void {
        if (other.gameObject.getComponent<Platform>(Platform)) {
            other.gameObject.destroy();
        }
    }
}

export default PlatformDestroyer;