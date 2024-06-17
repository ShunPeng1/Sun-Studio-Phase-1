import WebGLManager from "../../webgl/WebGLManager";
import Shape, { TextureFilter, TextureType, TextureWrap } from "../../webgl/shapes/Shape";
import TextureInfo from "../../webgl/textures/TextureInfo";
import Component from "../Component";

class Renderer extends Component {
    protected webgl : WebGLManager;
    protected webglTexture : WebGLTexture;
    protected shape : Shape;
    protected texture : ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas;
    protected textureUrl : string;
    protected textureInfo: TextureInfo;
    constructor(webgl : WebGLManager){
        super();
        this.webgl = webgl;
    }

    protected initializeShape(shape : Shape) {
        this.shape = shape;
    }
    
    protected initializeTexture( textureUrl : string, textureInfo : TextureInfo) {
        this.textureUrl = textureUrl;
        this.textureInfo = textureInfo;
       
        this.texture = new Image();
        this.texture.src = textureUrl;
        this.texture.onload = () => {
            this.addTexture(this.texture, textureInfo);
            
        };
    }


    public render(time: number, deltaTime : number) {
        
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }

    
    public addTexture(
        texture : ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas, 
        textureInfo : TextureInfo
    ) : void {
        this.texture = texture;
        let gl = this.webgl.getGL();

        var webglTexture = gl.createTexture()!;
        this.webglTexture = webglTexture;

        gl.bindTexture(textureInfo.textureType, webglTexture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, textureInfo.isFlipY); 
        
        // Set the parameters so we can render any size image
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, textureInfo.textureWrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, textureInfo.textureWrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, textureInfo.textureMinFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, textureInfo.textureMagFilter);
       
        if (texture instanceof ImageData) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texture.width, texture.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, texture.data);
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
        }

        // Unbind the texture
        gl.bindTexture(gl.TEXTURE_2D, null);

    }
}

export default Renderer;