import PhysicManager from "../physics/PhysicManager";
import Collider from "./Collider";
import Component from "./Component";
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
        return (this.transform.position[0] + this.x - this.width/2) *this.transform.scale[0] ;
    }

    public getMaxX(): number {
        return (this.transform.position[0] + this.x + this.width/2) * this.transform.scale[0];
    }

    public getMinY(): number {
        return (this.transform.position[1] + this.y - this.height/2) * this.transform.scale[1];
    }

    public getMaxY(): number {
        return (this.transform.position[1] + this.y + this.height/2) * this.transform.scale[1];
    }

    public getCenter(): number[] {
        return [(this.transform.position[0] + this.x) * this.transform.scale[0], (this.transform.position[1] + this.y) * this.transform.scale[1], 0] ;
    }


    public collidesWith(other: Collider): boolean {

        if ((other instanceof BoxCollider))
        {
            const collision = this.getMinX() < other.getMaxX() &&
            this.getMaxX() > other.getMinX() &&
            this.getMinY() < other.getMaxY() &&
            this.getMaxY() > other.getMinY();

            if (collision) {
            // Determine the direction of the collision
            const dx = this.getCenter()[0] - other.getCenter()[0];
            const dy = this.getCenter()[1] - other.getCenter()[1];

            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal collision
                if (dx > 0) {
                    // Collision on the right side
                    other.transform.position[0] = (this.getCenter()[0] + this.width/2 + other.width/2 ) / other.transform.scale[0] - other.x;
                } else {
                    // Collision on the left side
                    other.transform.position[0] = (this.getCenter()[0] - this.width/2 - other.width/2 ) / other.transform.scale[0] - other.x;
                }
            } else {
                // Vertical collision
                if (dy > 0) {
                    // Collision on the top side
                    other.transform.position[1] = (this.getCenter()[1] + this.height/2 + other.height/2 ) / other.transform.scale[1] - other.y;
                } else {
                    // Collision on the bottom side
                    other.transform.position[1] = (this.getCenter()[1] - this.height/2 - other.height/2 ) / other.transform.scale[1] - other.y;
                }
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