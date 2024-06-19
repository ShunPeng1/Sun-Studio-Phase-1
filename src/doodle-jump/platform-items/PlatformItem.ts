import Component from "../../engine/components/Component";
import Platform from "../platforms/Platform";


abstract class PlatformItem extends Component {
    
    platform : Platform;
    
    setPlatform(platform : Platform){
        this.platform = platform;
        this.gameObject.transform.setParent(platform.gameObject.transform);
    }

}


export default PlatformItem;