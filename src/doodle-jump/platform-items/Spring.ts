import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import BounceUpPlatform from "../platforms/BounceUpPlatform";
import PlatformItem from "./PlatformItem";
import Platform from "../platforms/Platform";
import { vec3 } from "gl-matrix";

class Spring extends PlatformItem {
    private bounceUpPlatform: BounceUpPlatform;
    private bounceListener: any;
    constructor() {
        super();
    }

    public awake(): void {
        this.bounceUpPlatform = this.gameObject.getComponent<BounceUpPlatform>(BounceUpPlatform)!;
    
        this.bounceListener = this.setToBounceState.bind(this);
        
        this.bounceUpPlatform.onBounce(this.bounceListener);
    }

    private setToBounceState() {
        vec3.add(this.gameObject.transform.scale, this.gameObject.transform.scale, [0, 2, 0]);

        vec3.add(this.gameObject.transform.position, this.gameObject.transform.position, [0, 2, 0]);
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