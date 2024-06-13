import PhysicManager from "../physics/PhysicManager";
import Collider from "./Collider";
import Component from "./Component";
import Rigidbody from "./Rigidbody";
import Transform from "./Transform";

class BoxCollider extends Collider{
    private x : number= 0;
    private y : number = 0;
    private width : number = 0;
    private height : number = 0;

    constructor(x: number, y: number, width: number, height: number) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }

    public getMinX(): number {
        return (this.transform.position[0] + this.x) - this.width/2 *this.transform.scale[0] ;
    }

    public getMaxX(): number {
        return (this.transform.position[0] + this.x) + this.width/2 * this.transform.scale[0];
    }

    public getMinY(): number {
        return (this.transform.position[1] + this.y) - this.height/2 * this.transform.scale[1];
    }

    public getMaxY(): number {
        return (this.transform.position[1] + this.y) + this.height/2 * this.transform.scale[1];
    }

    public getCenter(): number[] {
        return [(this.transform.position[0] + this.x), (this.transform.position[1] + this.y), 0] ;
    }


    public collidesWith(other: Collider): boolean {

        if ((other instanceof BoxCollider))
        {
            const collision = this.getMinX() <= other.getMaxX() &&
            this.getMaxX() >= other.getMinX() &&
            this.getMinY() <= other.getMaxY() &&
            this.getMaxY() >= other.getMinY();

            if (!collision) {
                return false;
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
            
            
            const dx = snappingCollider.getCenter()[0] - standingCollider.getCenter()[0];
            const dy = snappingCollider.getCenter()[1] - standingCollider.getCenter()[1];

            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal collision
                if (snappingRigidbody) {
                    snappingRigidbody.velocity[0] = 0;
                    snappingRigidbody.acceleration[0] = 0;
                }

                if (dx > 0) {
                    // Collision on the right side
                    snappingTransform.position[0] = standingTransform.position[0] + standingCollider.x + snappingTransform.scale[0] * snappingCollider.width/2 + standingTransform.scale[0] * standingCollider.width/2;
                } else {
                    // Collision on the left side
                    snappingTransform.position[0] = standingTransform.position[0] + standingCollider.x - snappingTransform.scale[0] * snappingCollider.width/2 - standingTransform.scale[0] * standingCollider.width/2;
                }
            } else {
                if (snappingRigidbody){
                    snappingRigidbody.velocity[1] = 0;
                    snappingRigidbody.acceleration[1] = 0;
                }
                // Vertical collision
                if (dy > 0) {
                    // Collision on the top side
                    snappingTransform.position[1] = standingTransform.position[1] + standingCollider.y + standingTransform.scale[1] * standingCollider.height/2 + snappingTransform.scale[1] * snappingCollider.height/2;
                } else {
                    // Collision on the bottom side
                    snappingTransform.position[1] = standingTransform.position[1] + standingCollider.y - snappingTransform.scale[1] * snappingCollider.height/2 - standingTransform.scale[1] * standingCollider.height/2;
                }
            }
        

            return collision;
        }

        return false;
    }
    
    

    public clone(): Component {
        // Add your implementation here
        return new BoxCollider(this.x, this.y, this.width, this.height);
    }
}

export default BoxCollider;