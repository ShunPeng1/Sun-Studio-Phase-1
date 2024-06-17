import Component from "../../engine/components/Component";
import Transform from "../../engine/components/Transform";

class Player extends Component{
    private headTransform : Transform;
    private backTransform : Transform;
    constructor(headTransform : Transform, backTransform : Transform) {
        super();
        this.headTransform = headTransform;
        this.backTransform = backTransform;
    }

    

    public clone(): Component {
        return new Player(this.headTransform, this.backTransform);    
    }
}


export default Player;