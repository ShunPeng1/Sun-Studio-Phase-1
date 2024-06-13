import Shape from "./Shape";
import Mesh from "./Mesh";

class Polyhedron extends Shape {
    constructor(gl: WebGLRenderingContext, program: WebGLProgram, mesh: Mesh) {
        console.log("polyhedron");
        super(gl, program, mesh);
    }

    
}   


export default Polyhedron;