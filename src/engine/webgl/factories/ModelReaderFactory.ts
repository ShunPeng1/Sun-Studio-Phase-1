import ObjReader from "../readers/OjbReader";
import JsonModelReader from "../readers/JsonModelReader";
import ReaderResult from "../readers/ReaderResult";

class ModelReaderFactory {
    private cache: Map<string, ReaderResult>; // Cache for storing loaded models

    constructor() {
        this.cache = new Map<string, ReaderResult>(); // Initialize the cache
    }
    public createModel(objectUrl: string, callback : (objReader: ReaderResult) => void = ()=>{}): Promise<ReaderResult> {
        return new Promise((resolve, reject) => {
    
            
            // Check if the model is in the cache
            if (this.cache.has(objectUrl)) {
                const result = this.cache.get(objectUrl);
                if (result) {
                    resolve(result);
                    callback(result);
                    return;
                } 
            }
        
            switch (objectUrl.split('.').pop()) {
                case 'obj':
                    new ObjReader().load(objectUrl, (result) => {
                        this.cache.set(objectUrl, result); // Store the loaded model in the cache
                        
                        resolve(result);
                        callback(result);
                    });
                    break;
                case 'json':
                    new JsonModelReader().load(objectUrl, (result) => {
                        this.cache.set(objectUrl, result); // Store the loaded model in the cache
                        
                        resolve(result);
                        callback(result);
                    });
                    break;
                default:
                    reject('Unsupported file format');
                    return ;
            }
        });
    }

}

export default ModelReaderFactory;