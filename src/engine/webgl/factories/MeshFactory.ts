import Mesh from "../shapes/Mesh";
import MeshType from "../shapes/MeshType";

class MeshFactory {

    public createMesh(shapeType: MeshType, colors : number[] = [], textureCoordinates : number[] = [], normals : number [] = []): Mesh {
        // Check if the shape is in the cache
        
        let mesh: Mesh;
        switch(shapeType){
            case MeshType.Box:
                mesh = this.createBox(colors, textureCoordinates, normals);
                break;
            case MeshType.Quad:
                mesh = this.createQuad(colors, textureCoordinates, normals);
                break;
            default:
                throw new Error('Unsupported shape type');
        }

        return mesh;
    }


    public createBox(colors: number[], textureCoordinates: number[], normals: number []): Mesh {
        
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

        if (colors.length !== 24) {
            //console.log("Color array must have 24 elements, used default color instead");

            colors = [
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

        if (normals.length !== 24) {
            //console.log("Normal array must have 24 elements, used default normal instead");

            normals = [
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

        if (textureCoordinates.length !== 16) {
            //console.log("Texture coordinates array must have 16 elements, used default texture coordinates instead");

            textureCoordinates = [
                // Top
                0, 0,
                0, 1,
                1, 1,
                1, 0,

                // Left
                0, 0,
                0, 1,
                1, 1,
                1, 0,

                // Right
                0, 0,
                0, 1,
                1, 1,
                1, 0,

                // Front
                0, 0,
                0, 1,
                1, 1,
                1, 0,

                // Back
                0, 0,
                0, 1,
                1, 1,
                1, 0,

                // Bottom
                0, 0,
                0, 1,
                1, 1,
                1, 0
            ];
        }
        
        return new Mesh(boxVertices, boxIndices, colors, normals, textureCoordinates);
    }
    public createQuad(colors: number[], textureCoordinates: number[], normals: number []): Mesh {
        if (colors.length == 0) {
            colors = [
                1.0, 1.0, 1.0, 1.0, 
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0, 
                1.0, 1.0, 1.0, 1.0
                ];
        }

        if (normals.length == 0) {
            normals = [
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0
            ];
        }

        if (textureCoordinates.length == 0) {
            textureCoordinates = [
                0.0, 1.0, 
                0.0, 0.0, 
                1.0, 0.0, 
                1.0, 1.0
            ];

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

        return new Mesh(positions, indices, colors, normals, textureCoordinates);
    }
    

}


export default MeshFactory;