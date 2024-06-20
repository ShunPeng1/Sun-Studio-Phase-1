import Component from "../../engine/components/Component";
import Platform from "../platforms/Platform";


abstract class PlatformItem extends Component {
    
    protected platform : Platform;
    
    public setPlatform(platform : Platform){
        this.platform = platform;
        this.gameObject.transform.setParent(platform.gameObject.transform);
    }

}


export default PlatformItem;