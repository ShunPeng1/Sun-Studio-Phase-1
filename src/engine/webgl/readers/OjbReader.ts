import Mesh from "../shapes/Mesh";
import ReaderResult from "./ReaderResult";

class ObjReader {
    

    public load(url: string, callback : (objReader: ReaderResult) => void) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                await this.read(xhr.responseText, callback);
            }
        };
        xhr.send();
    }

    private async read(data: string, callback : (objReader: ReaderResult) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            // Split the input into lines
            let result : ReaderResult;

            try {
                let lines = data.split('\n');
                let vertices = [];
                let vertexNormals = [];
                let textureCoordinates = [];
                let faces = [];

        
                for (let line of lines) {
                    // Split the line into tokens
                    let tokens = line.split(' ');
        
                    switch (tokens[0]) {
                        case 'v': // Vertex
                            vertices.push(
                                parseFloat(tokens[1]),
                                parseFloat(tokens[2]),
                                parseFloat(tokens[3])
                            );
                            break;
        
                        case 'vn': // Vertex normal
                            vertexNormals.push(
                                parseFloat(tokens[1]),
                                parseFloat(tokens[2]),
                                parseFloat(tokens[3])
                            );
                            break;
        
                        case 'vt': // Texture coordinate
                            textureCoordinates.push(
                                parseFloat(tokens[1]),
                                parseFloat(tokens[2])
                            );
                            break;
        
                        case 'f': // Face
                            faces.push(
                                parseFloat(tokens[1]),
                                parseFloat(tokens[2]),
                                parseFloat(tokens[3])
                            );
                            break;
                    }

                }

                let colors = [];

                for (let i = 0; i < vertices.length; i++) {
                    colors.push(1.0, 1.0, 1.0, 1.0);
                }
                result = new ReaderResult(null);

                let mesh = new Mesh(vertices, faces, colors, vertexNormals, textureCoordinates);
                result.addMesh(mesh);
                resolve();
            } catch (error) {
                result = new ReaderResult(error);
                console.error(error);   
                reject(error);
            }
            
            
            callback(result);
        });
    }
}

export default ObjReader;
