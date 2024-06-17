import { vec3 } from "gl-matrix";
import Component from "./Component";

class Rigidbody extends Component {
    
    public velocity: vec3;
    public acceleration: vec3;
    private mass: number;
    private gravity: number;
    public isKinematic : boolean = false;

    constructor(mass: number, gravity: number, isKinematic : boolean = false) {
        super();

        this.mass = mass;
        this.gravity = gravity;
        this.isKinematic = isKinematic;

        this.velocity = vec3.create();
        this.acceleration = vec3.create();
    }


    public fixedUpdate(fixedLastTime: number, fixedDeltaTime : number): void {

        if (this.isKinematic) return;

        // Apply gravity
        this.addForce([0, -this.gravity, 0]);
        
        let deltaVelocity = vec3.create();
        vec3.scale(deltaVelocity, this.acceleration, fixedDeltaTime);
        vec3.add(this.velocity, this.velocity, deltaVelocity);

        // Update position
        let deltaPositionByVelocity = vec3.create(), deltaPositionByAccerelation = vec3.create();
        vec3.scale(deltaPositionByVelocity, this.velocity, fixedDeltaTime);        
        //vec3.scale(deltaPositionByAccerelation, this.acceleration, 0.5 * fixedDeltaTime * fixedDeltaTime);
        vec3.add(this.gameObject.transform.position, this.gameObject.transform.position, deltaPositionByVelocity);
        //vec3.add(this.gameObject.transform.position, this.gameObject.transform.position, deltaPositionByAccerelation);
        
        
        // Reset acceleration for the next time step
        vec3.set(this.acceleration, 0, 0, 0);




        //console.log(fixedDeltaTime,this.gameObject.transform.position,deltaPositionByVelocity, this.velocity, deltaVelocity, this.acceleration);
    }

    public addForce(force: vec3) {
        let forceScaledByMass = vec3.create();
        vec3.scale(forceScaledByMass, force, 1/this.mass);
        vec3.add(this.acceleration, this.acceleration, forceScaledByMass);

    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }
}

export default Rigidbody;