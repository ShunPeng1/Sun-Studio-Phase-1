import { vec3 } from "gl-matrix";
import Component from "./Component";

class Rigidbody extends Component {
    
    private velocity: vec3;
    private acceleration: vec3;
    private mass: number;
    private gravity: number;

    constructor(mass: number, gravity: number) {
        super();

        this.mass = mass;
        this.gravity = gravity;
        
        this.velocity = vec3.create();
        this.acceleration = vec3.create();
    }

    public update(time: number, deltaTime: number): void {
        let deltaPosition = vec3.create();
        vec3.scale(deltaPosition, this.velocity, deltaTime);
        
        
        vec3.add(this.gameObject.transform.position, this.gameObject.transform.position, deltaPosition);
        
        let deltaVelocity = vec3.create();
        vec3.scale(deltaVelocity, this.acceleration, deltaTime);
        vec3.add(this.velocity, this.velocity, deltaVelocity);

        vec3.add(this.acceleration, this.acceleration, [0, -this.gravity * deltaTime, 0]);
        console.log(deltaTime,this.gameObject.transform.position,deltaPosition, this.velocity, deltaVelocity, this.acceleration);
    }

    public addForce(force: vec3) {
        vec3.scale(force, force, 1/this.mass);
        vec3.add(this.acceleration, this.acceleration, force);

    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }
}

export default Rigidbody;