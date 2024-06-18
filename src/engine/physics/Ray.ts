import { vec3 } from "gl-matrix";

class Ray {
    public origin: vec3;
    public direction: vec3;

    constructor(origin: vec3, direction: vec3) {
        this.origin = origin;
        this.direction = vec3.normalize(vec3.create(), direction); // Ensure direction is a unit vector
    }
}


export default Ray;