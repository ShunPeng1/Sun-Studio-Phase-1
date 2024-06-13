import Mesh from "../shapes/Mesh";
import ReaderResult from "./ReaderResult";



class JsonModelReader {
    

    public load(url: string, callback : (json : ReaderResult) => void) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                await this.read(xhr.responseText, callback);
            }
        };
        xhr.send();
    }

    private async read(data: string, callback : (json : ReaderResult) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            let result : ReaderResult;
            try {
                let obj = JSON.parse(data);
                let colors = this.getColor(obj, obj.meshes[0].vertices.length);
                
                result = new ReaderResult(null);
                result.addMesh(new Mesh(obj.meshes[0].vertices, [].concat.apply([], obj.meshes[0].faces), colors, obj.meshes[0].normals, obj.meshes[0].texturecoords[0]));
                
                resolve();

            } catch (error) {
                result = new ReaderResult(error);
                console.error(error);   
                reject(error);
            }
    
            callback(result);
        });
    }

    private getColor(obj : any, defaultLength : number)  {
        if (obj.meshes && obj.meshes[0] && obj.meshes[0].colors && obj.meshes[0].colors.length > 0) {
            let color = obj.meshes[0].colors[0];
            return color;
        } else {
            return new Array(defaultLength * 4).fill(1);
        }
    }
}

export default JsonModelReader;