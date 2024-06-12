import WebGLManager from "../webgl/WebGLManager";
import Mesh from "../webgl/shapes/Mesh";
import Polyhedron from "../webgl/shapes/Polyhedron";
import Shape from "../webgl/shapes/Shape";
import Component from "./Component";
import { JsonModelReader, JsonModelResult } from "../webgl/shapes/readers/JsonReader";
import { ObjReader, ObjReaderResult } from "../webgl/shapes/readers/OjbReader";

class MeshRenderer extends Component {
    
    private webgl : WebGLManager;

    private shape : Shape; 
    private mesh : Mesh;
    private texture : ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas;

    private objectUrl : string;
    private textureUrl : string;

    constructor(webgl : WebGLManager, objectUrl : string, textureUrl : string) {
        super();
        
        this.webgl = webgl;
        this.objectUrl = objectUrl;
        this.textureUrl = textureUrl;

        switch (objectUrl.split('.').pop()) {
            case 'obj':
                new ObjReader().load(objectUrl, (result : ObjReaderResult) => {
                    this.mesh = result.mesh;
                    this.initializeTexture();
                });
                break;
            case 'json':
                new JsonModelReader().load(objectUrl, (result : JsonModelResult) => {
                    this.mesh = result.meshes[0];
                    this.initializeTexture();
                });
                break;
            default:
                console.error('Unsupported file format');
                return;
        }

        
    }

    
    private initializeTexture() {
        this.shape = new Polyhedron(this.webgl.getGL(), this.webgl.getProgram(), this.mesh);

        this.texture = new Image();
        this.texture.src = this.textureUrl;
        this.texture.onload = () => {
            this.shape.addTexture(this.texture, true);
            
        };
    }

    public awake() {
        
    }

    start() {
        // Add your implementation here
    }

    update(time: number, deltaTime : number) {
        // Add your implementation here
    }

    fixedUpdate() {
        // Add your implementation here
    }


    render(time: number, deltaTime : number) {
        if (this.shape === undefined) {
            return;
        }

        this.shape.draw();
        
    }
    
    public clone(): Component {
        // Add your implementation here
        return new MeshRenderer(this.webgl, this.objectUrl, this.textureUrl);
    }
    

}

export default MeshRenderer;
