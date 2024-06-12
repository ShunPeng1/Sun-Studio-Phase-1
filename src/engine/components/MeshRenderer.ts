import WebGLManager from "../webgl/WebGLManager";
import Mesh from "../webgl/shapes/Mesh";
import Polyhedron from "../webgl/shapes/Polyhedron";
import Shape, { TextureFilter, TextureType, TextureWrap } from "../webgl/shapes/Shape";
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

    constructor(webgl : WebGLManager, objectUrl : string, textureUrl : string,
        isFlipY : boolean = false,
        textureType : TextureType = TextureType.TEXTURE_2D,
        textureWrapS : TextureWrap = TextureWrap.CLAMP_TO_EDGE,
        textureWrapT : TextureWrap = textureWrapS,
        textureMinFilter : TextureFilter = TextureFilter.LINEAR,
        textureMagFilter : TextureFilter = TextureFilter.LINEAR) {
        super();
        
        this.webgl = webgl;
        this.objectUrl = objectUrl;
        this.textureUrl = textureUrl;

        switch (objectUrl.split('.').pop()) {
            case 'obj':
                new ObjReader().load(objectUrl, (result : ObjReaderResult) => {
                    this.mesh = result.mesh;
                    this.initializeTexture(isFlipY, textureType, textureWrapS, textureWrapT, textureMinFilter, textureMagFilter);
                });
                break;
            case 'json':
                new JsonModelReader().load(objectUrl, (result : JsonModelResult) => {
                    this.mesh = result.meshes[0];
                    this.initializeTexture(isFlipY, textureType, textureWrapS, textureWrapT, textureMinFilter, textureMagFilter);
                });
                break;
            default:
                console.error('Unsupported file format');
                return;
        }

        
    }

    
    private initializeTexture(
        isFlipY : boolean = false,
        textureType : TextureType = TextureType.TEXTURE_2D,
        textureWrapS : TextureWrap = TextureWrap.CLAMP_TO_EDGE,
        textureWrapT : TextureWrap = textureWrapS,
        textureMinFilter : TextureFilter = TextureFilter.LINEAR,
        textureMagFilter : TextureFilter = TextureFilter.LINEAR
    ) {
        this.shape = new Polyhedron(this.webgl.getGL(), this.webgl.getProgram(), this.mesh);

        this.texture = new Image();
        this.texture.src = this.textureUrl;
        this.texture.onload = () => {
            this.shape.addTexture(this.texture, isFlipY, textureType, textureWrapS, textureWrapT, textureMinFilter, textureMagFilter);
            
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
