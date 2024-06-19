import PhysicManager from "../../physics/PhysicManager";
import Collider from "./Collider";
import Component from "../Component";
import Rigidbody from "./Rigidbody";
import Transform from "../Transform";
import Ray from "../../physics/Ray";

class BoxCollider extends Collider{
    private x : number= 0;
    private y : number = 0;
    private width : number = 0;
    private height : number = 0;

    constructor(isTrigger : boolean, x: number, y: number, width: number, height: number) {
        super(isTrigger);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }

    public getMinX(): number {
        let worldPosition = this.transform.getWorldPosition();
        let worldScale = this.transform.getWorldScale();
        return (worldPosition[0] + this.x) - this.width/2 * worldScale[0];
    }

    public getMaxX(): number {
        let worldPosition = this.transform.getWorldPosition();
        let worldScale = this.transform.getWorldScale();
        return (worldPosition[0] + this.x) + this.width/2 * worldScale[0];
    }

    public getMinY(): number {
        let worldPosition = this.transform.getWorldPosition();
        let worldScale = this.transform.getWorldScale();
        return (worldPosition[1] + this.y) - this.height/2 * worldScale[1];
    }

    public getMaxY(): number {
        let worldPosition = this.transform.getWorldPosition();
        let worldScale = this.transform.getWorldScale();
        return (worldPosition[1] + this.y) + this.height/2 * worldScale[1];
    }

    public getCenter(): number[] {
        let worldPosition = this.transform.getWorldPosition();
        return [worldPosition[0] + this.x, worldPosition[1] + this.y, 0];
    }


    public collidesWith(other: Collider): boolean {
        if (!this.isEnable) {
            return false;
        }
        
        if ((other instanceof BoxCollider))
        {
            const collision = this.getMinX() <= other.getMaxX() &&
            this.getMaxX() >= other.getMinX() &&
            this.getMinY() <= other.getMaxY() &&
            this.getMaxY() >= other.getMinY();

            if (!collision) {
                return false;
            }

            // Check if the collision is with a trigger
            //if (this.isTrigger && other.isTrigger) {
            //    return false; // Ignore Snapping
            //}
            
            if (this.isTrigger || other.isTrigger) {
                return true; // Ignore Snapping
            }

            // Determine the standing and snapping transforms
            let otherRidigBody = other.gameObject.getComponent<Rigidbody>(Rigidbody);
            let thisRidigBody = this.gameObject.getComponent<Rigidbody>(Rigidbody);

            let snappingTransform : Transform = this.transform;
            let standingTransform : Transform = other.transform;
            if (otherRidigBody && thisRidigBody) {
                if (otherRidigBody.isKinematic && thisRidigBody.isKinematic) {
                    return collision;
                }
                if (thisRidigBody.isKinematic) {
                    snappingTransform = other.transform;
                    standingTransform = this.transform;
                }

            }
            else if (otherRidigBody) {
                if (otherRidigBody.isKinematic) {
                    return collision;
                }
                snappingTransform = other.transform;
                standingTransform = this.transform;
            }
            else if (thisRidigBody) {
                if (thisRidigBody.isKinematic) {
                    return collision;
                }
                snappingTransform = this.transform;
                standingTransform = other.transform;
            }
            else{
                return collision;
            }

            // Snap the object to the other object
            let snappingCollider = snappingTransform.gameObject.getComponent<BoxCollider>(BoxCollider)!;
            let standingCollider = standingTransform.gameObject.getComponent<BoxCollider>(BoxCollider)!;

            let snappingRigidbody = snappingTransform.gameObject.getComponent<Rigidbody>(Rigidbody)!;
            
            
            const dMaxMinX = snappingCollider.getMaxX() - standingCollider.getMinX();
            const dMaxMinY = snappingCollider.getMaxY() - standingCollider.getMinY();
            const dMinMaxX = snappingCollider.getMinX() - standingCollider.getMaxX();
            const dMinMaxY = snappingCollider.getMinY() - standingCollider.getMaxY();

            const dx = Math.min(Math.abs(dMaxMinX), Math.abs(dMinMaxX));
            const dy = Math.min(Math.abs(dMaxMinY), Math.abs(dMinMaxY));
            // console.log("Snapping ", snappingCollider.gameObject.name, " Standing", standingCollider.gameObject.name)
            // console.log( snappingCollider.getMaxX(), standingCollider.getMinX(), dMaxMinX);
            // console.log( snappingCollider.getMinX(), standingCollider.getMaxX(), dMinMaxX);
            // console.log( snappingCollider.getMaxY(), standingCollider.getMinY(), dMaxMinY);
            // console.log( snappingCollider.getMinY(), standingCollider.getMaxY(), dMinMaxY);
            // console.log("dx ", dx, " dy ", dy);

            if (Math.abs(dx) < Math.abs(dy)) {
                // Horizontal collision
                

                if (Math.abs(dMaxMinX) > Math.abs(dMinMaxX)) {
                    // Collision on the right side

                    if (snappingRigidbody) {
                        snappingRigidbody.velocity[0] = Math.max(0, snappingRigidbody.velocity[0]);
                        snappingRigidbody.acceleration[0] = Math.max(0, snappingRigidbody.acceleration[0]);
                    }
                   
                    snappingTransform.position[0] = standingTransform.position[0] + standingCollider.x + snappingTransform.scale[0] * snappingCollider.width/2 + standingTransform.scale[0] * standingCollider.width/2;
                } else {
                    // Collision on the left side

                    if (snappingRigidbody) {
                        snappingRigidbody.velocity[0] = Math.min(0, snappingRigidbody.velocity[0]);
                        snappingRigidbody.acceleration[0] = Math.min(0, snappingRigidbody.acceleration[0]);
                    }

                    snappingTransform.position[0] = standingTransform.position[0] + standingCollider.x - snappingTransform.scale[0] * snappingCollider.width/2 - standingTransform.scale[0] * standingCollider.width/2;
                }
            } else {
                // Vertical collision
                if (Math.abs(dMaxMinY) > Math.abs(dMinMaxY)) {
                    // Collision on the top side

                    if (snappingRigidbody) {
                        snappingRigidbody.velocity[1] = Math.max(0, snappingRigidbody.velocity[1]);
                        snappingRigidbody.acceleration[1] = Math.max(0, snappingRigidbody.acceleration[1]);
                    }

                    snappingTransform.position[1] = standingTransform.position[1] + standingCollider.y + standingTransform.scale[1] * standingCollider.height/2 + snappingTransform.scale[1] * snappingCollider.height/2;
                } else {
                    // Collision on the bottom side

                    if (snappingRigidbody) {
                        snappingRigidbody.velocity[1] = Math.min(0, snappingRigidbody.velocity[1]);
                        snappingRigidbody.acceleration[1] = Math.min(0, snappingRigidbody.acceleration[1]);
                    }

                    snappingTransform.position[1] = standingTransform.position[1] + standingCollider.y - snappingTransform.scale[1] * snappingCollider.height/2 - standingTransform.scale[1] * standingCollider.height/2;
                }
            }
        

            return collision;
        }

        return false;
    }
    
    public intersectsRay(ray: Ray): boolean {
        let tmin = (this.getMinX() - ray.origin[0]) / ray.direction[0];
        let tmax = (this.getMaxX() - ray.origin[0]) / ray.direction[0];
    
        if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
    
        let tymin = (this.getMinY() - ray.origin[1]) / ray.direction[1];
        let tymax = (this.getMaxY() - ray.origin[1]) / ray.direction[1];
    
        if (tymin > tymax) [tymin, tymax] = [tymax, tymin];
    
        if ((tmin > tymax) || (tymin > tmax))
            return false;
    
        return true;
    }

    public clone(): Component {
        // Add your implementation here
        return new BoxCollider(this.isTrigger, this.x, this.y, this.width, this.height);
    }
}

export default BoxCollider;