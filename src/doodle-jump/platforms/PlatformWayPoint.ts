import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Transform from "../../engine/components/Transform";
import WayPointMovement from "../movement/WayPointMovement";

class PlatformWayPoint extends Component {
    private wayPointMovement : WayPointMovement;
    private initialXZPosition : vec3;
    
    constructor(initialXZPosition : vec3) {
        super();

        this.initialXZPosition = initialXZPosition;
    }

    
    public awake(): void {
        let wayPointMovementInParent = this.gameObject.getComponentInParent<WayPointMovement>(WayPointMovement)!;
        this.wayPointMovement = wayPointMovementInParent;

        this.wayPointMovement.addWayPoint(this.gameObject.transform);

        vec3.copy(this.gameObject.transform.position, this.initialXZPosition);
    }

    public start() : void{
        this.gameObject.transform.position[0] = this.initialXZPosition[0];
        this.gameObject.transform.position[1] = this.wayPointMovement.transform.position[1];
        this.gameObject.transform.position[2] = this.initialXZPosition[2];
    
    }

    public clone(): Component {
        return new PlatformWayPoint(this.initialXZPosition);
    }
}


export default PlatformWayPoint;