import Mesh from "../Mesh";

class JsonModelResult {
    public meshes : Mesh[] = [];

}

class JsonModelReader {
    

    public load(url: string, callback : (json : JsonModelResult) => void) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                await this.read(xhr.responseText, callback);
            }
        };
        xhr.send();
    }

    private async read(data: string, callback : (json : JsonModelResult) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            let result = new JsonModelResult();
            try {
                let obj = JSON.parse(data);
    
                result.meshes.push(new Mesh(obj.meshes[0].vertices, [].concat.apply([], obj.meshes[0].faces), obj.meshes[0].colors[0], obj.meshes[0].normals, obj.meshes[0].texturecoords[0]));
                
                resolve();

            } catch (error) {
                console.error(error);   
                reject(error);
            }
    
            callback(result);
        });
    }
}

export { JsonModelReader, JsonModelResult};