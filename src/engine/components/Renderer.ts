import WebGLManager from "../webgl/WebGLManager";
import Shape, { TextureFilter, TextureType, TextureWrap } from "../webgl/shapes/Shape";
import TextureInfo from "../webgl/textures/TextureInfo";
import Component from "./Component";

class Renderer extends Component {
    protected webgl : WebGLManager;
    
    protected shape : Shape;
    protected texture : ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas;

    constructor(webgl : WebGLManager){
        super();
        this.webgl = webgl;
    }

    protected initializeShape(shape : Shape) {
        this.shape = shape;
    }
    
    protected initializeTexture( textureUrl : string,
        textureInfo : TextureInfo) {
       
        this.texture = new Image();
        this.texture.src = textureUrl;
        this.texture.onload = () => {
            this.shape.addTexture(this.texture, textureInfo);
            
        };
    }


    public render(time: number, deltaTime : number) {
        if (this.shape === undefined) {
            return;
        }
        let gl = this.webgl.getGL();

        // Get the location of the transformation matrix uniform
        let modelMatrixUniformLocation = gl.getUniformLocation(this.webgl.getProgram(), 'mWorld');

        gl.uniformMatrix4fv(modelMatrixUniformLocation, false, this.transform.getWorldMatrix());
    
        // Set the transformation matrix
        this.shape.draw();
        
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }


}

export default Renderer;