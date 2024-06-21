import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Transform from "../../engine/components/Transform";
import WayPointMovement from "./WayPointMovement";

class WayPoint extends Component {
    private wayPointMovement : WayPointMovement;
    private initialPosition : vec3;

    private isGlobalX : boolean;
    private isGlobalY : boolean;
    private isGlobalZ : boolean;
    
    constructor(initialXZPosition : vec3, isGlobalX : boolean, isGlobalY : boolean, isGlobalZ: boolean) {
        super();

        this.initialPosition = initialXZPosition;
        
        this.isGlobalX = isGlobalX;
        this.isGlobalY = isGlobalY;
        this.isGlobalZ = isGlobalZ;
    }

    
    public awake(): void {
        let wayPointMovementInParent = this.gameObject.getComponentInParent<WayPointMovement>(WayPointMovement)!;
        this.wayPointMovement = wayPointMovementInParent;

        this.wayPointMovement.addWayPoint(this.gameObject.transform);

        vec3.copy(this.gameObject.transform.position, this.initialPosition);
    }

    public start() : void{
        if (this.isGlobalX){
            this.gameObject.transform.position[0] = this.initialPosition[0];
        } else {
            this.gameObject.transform.position[0] = this.wayPointMovement.transform.position[0] + this.initialPosition[0];
        }
    
        if (this.isGlobalY){
            this.gameObject.transform.position[1] = this.initialPosition[1];
        } else {
            this.gameObject.transform.position[1] = this.wayPointMovement.transform.position[1] + this.initialPosition[1];
        }
    
        if (this.isGlobalZ){
            this.gameObject.transform.position[2] = this.initialPosition[2];
        } else {
            this.gameObject.transform.position[2] = this.wayPointMovement.transform.position[2] + this.initialPosition[2];
        }
        
    }

    public clone(): Component {
        return new WayPoint(this.initialPosition, this.isGlobalX, this.isGlobalY, this.isGlobalZ);
    }
}


export default WayPoint;