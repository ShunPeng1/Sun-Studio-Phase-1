import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import BounceUpPlatform from "../platforms/BounceUpPlatform";
import PlatformItem from "./PlatformItem";
import Platform from "../platforms/Platform";

class Spring extends PlatformItem {
    
    platform: Platform;

    constructor() {
        super();
    }

    public setPlatform(platform: Platform): void {
        this.platform = platform;
        this.gameObject.transform.setParent(platform.gameObject.transform);
    }
    

    public clone(): Component {
        return new Spring();
    }
    

}

export default Spring;