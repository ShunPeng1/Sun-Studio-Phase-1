interface VertexNormal {
    nx: number;
    ny: number;
    nz: number;
}

interface TextureCoordinate {
    u: number;
    v: number;
}

interface Vertex {
    x: number;
    y: number;
    z: number;
}

interface Face {
    v1: number;
    v2: number;
    v3: number;
}

class ObjReader {
    public vertices: Vertex[] = [];
    public vertexNormals: VertexNormal[] = [];
    public textureCoordinates: TextureCoordinate[] = [];
    public faces: Face[] = [];

    public load(url: string, callback : (objReader: ObjReader) => void) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                await this.read(xhr.responseText, callback);
            }
        };
        xhr.send();
    }

    private async read(data: string, callback : (objReader: ObjReader) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            // Split the input into lines
            try {
                let lines = data.split('\n');
        
                for (let line of lines) {
                    // Split the line into tokens
                    let tokens = line.split(' ');
        
                    switch (tokens[0]) {
                        case 'v': // Vertex
                            this.vertices.push({
                                x: parseFloat(tokens[1]),
                                y: parseFloat(tokens[2]),
                                z: parseFloat(tokens[3])
                            });
                            break;
        
                        case 'vn': // Vertex normal
                            this.vertexNormals.push({
                                nx: parseFloat(tokens[1]),
                                ny: parseFloat(tokens[2]),
                                nz: parseFloat(tokens[3])
                            });
                            break;
        
                        case 'vt': // Texture coordinate
                            this.textureCoordinates.push({
                                u: parseFloat(tokens[1]),
                                v: parseFloat(tokens[2])
                            });
                            break;
        
                        case 'f': // Face
                            this.faces.push({
                                v1: parseInt(tokens[1].split('/')[0]),
                                v2: parseInt(tokens[2].split('/')[0]),
                                v3: parseInt(tokens[3].split('/')[0])
                            });
                            break;
                    }

                }
                
                resolve();
                callback(this);

            } catch (error) {
                console.error(error);   
                reject(error);
            }
    
        });
    }
}

export {ObjReader, Vertex, VertexNormal, TextureCoordinate, Face} 
