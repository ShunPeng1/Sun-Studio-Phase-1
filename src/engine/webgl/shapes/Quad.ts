import Mesh from "./Mesh";
import Shape from "./Shape";

class Quad extends Shape {
    constructor(gl: WebGLRenderingContext, program: WebGLProgram, color: number[] = [], normal: number[] = [], texCoords : number[] = []) {
     
        if (color.length == 0) {
            color = [
                1.0, 1.0, 1.0, 1.0, 
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0, 
                1.0, 1.0, 1.0, 1.0
                ];
        }

        if (normal.length == 0) {
            normal = [
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0
            ];
        }

        if (texCoords.length == 0) {
            texCoords = [
                0.0, 1.0, 
                0.0, 0.0, 
                1.0, 0.0, 
                1.0, 1.0
            ];

            console.log("Default texture coordinates")
        }

        let positions = [
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0
        ];

        let indices = [
            0, 1, 2,
            0, 2, 3
        ];

        let mesh = new Mesh(positions, indices, color, normal, texCoords);

        super(gl, program, mesh);

    }
    
    
    

}


export default Quad;