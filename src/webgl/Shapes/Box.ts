import Shape from "./Shape";

class Box extends Shape {
    constructor(gl: WebGLRenderingContext, program: WebGLProgram, color: number[] = [], normal: number[] = []) {
        
        var boxVertices = 
        [ // X, Y, Z 
            // Top
            -1.0, 1.0, -1.0,  
            -1.0, 1.0, 1.0,   
            1.0, 1.0, 1.0,    
            1.0, 1.0, -1.0,   
    
            // Left
            -1.0, 1.0, 1.0,   
            -1.0, -1.0, 1.0,  
            -1.0, -1.0, -1.0, 
            -1.0, 1.0, -1.0,  
    
            // Right
            1.0, 1.0, 1.0,    
            1.0, -1.0, 1.0,   
            1.0, -1.0, -1.0,  
            1.0, 1.0, -1.0,   
    
            // Front
            1.0, 1.0, 1.0,    
            1.0, -1.0, 1.0,   
            -1.0, -1.0, 1.0,  
            -1.0, 1.0, 1.0,   
    
            // Back
            1.0, 1.0, -1.0,   
            1.0, -1.0, -1.0,  
            -1.0, -1.0, -1.0, 
            -1.0, 1.0, -1.0,  
    
            // Bottom
            -1.0, -1.0, -1.0, 
            -1.0, -1.0, 1.0,  
            1.0, -1.0, 1.0,   
            1.0, -1.0, -1.0,  
        ];

        var boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
        ];

        if (color.length !== 24) {
            console.log("Color array must have 24 elements, used default color instead");

            color = [
                // Top
                1, 0, 0, 1,
                1, 0, 0, 1,
                1, 0, 0, 1,
                1, 0, 0, 1,

                // Left
                0, 1, 0, 1,
                0, 1, 0, 1,
                0, 1, 0, 1,
                0, 1, 0, 1,

                // Right
                0, 0, 1, 1,
                0, 0, 1, 1,
                0, 0, 1, 1,
                0, 0, 1, 1,

                // Front
                1, 1, 0, 1,
                1, 1, 0, 1,
                1, 1, 0, 1,
                1, 1, 0, 1,

                // Back
                0, 1, 1, 1,
                0, 1, 1, 1,
                0, 1, 1, 1,
                0, 1, 1, 1,

                // Bottom
                1, 0, 1, 1,
                1, 0, 1, 1,
                1, 0, 1, 1,
                1, 0, 1, 1
            ];
        }

        if (normal.length !== 24) {
            console.log("Normal array must have 24 elements, used default normal instead");

            normal = [
                // Top
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,

                // Left
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,

                // Right
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,

                // Front
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,

                // Back
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,

                // Bottom
                0, -1, 0,
                0, -1, 0,
                0, -1, 0,
                0, -1, 0
            ];
        }
        
        super(gl, program, boxVertices, boxIndices, color, normal);
    }

    public draw(): void {
        let gl = this.gl;

        // Bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        
        // Draw the box
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

        // Unbind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    
    }
}


export default Box;