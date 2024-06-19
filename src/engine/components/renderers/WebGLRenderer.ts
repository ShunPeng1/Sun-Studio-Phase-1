import ImageElements from "../../webgl/textures/ImageElements";
import WebGLManager from "../../webgl/WebGLManager";
import Shape from "../../webgl/shapes/Shape";
import TextureInfo from "../../webgl/textures/TextureInfo";
import Component from "../Component";
import Mesh from "../../webgl/shapes/Mesh";


class WebGLRenderer extends Component {
    protected isEnable : boolean = true;

    protected webgl : WebGLManager;

    protected shape : Shape;
    protected mesh : Mesh;
    
    protected imageElements : ImageElements[];
    protected webglTextures : WebGLTexture[];
    protected textureInfo: TextureInfo;

    protected renderingTextureIndex : number = 0;
    constructor(){
        super();
    }

    public awake(): void {
        
        this.webgl = WebGLManager.getInstance();
    }


    protected initializeShape(mesh : Mesh) {
        this.shape = new Shape(this.webgl.getGL(), this.webgl.getProgram(), mesh);
    }
    
    protected initializeTexture(imageElements : ImageElements[], textureInfo : TextureInfo) {
        this.imageElements = imageElements;
        this.textureInfo = textureInfo;
        this.webglTextures = [];
       
        imageElements.forEach(image => {
            let webglTexture = this.addTexture(image, textureInfo);
            this.webglTextures.push(webglTexture);
        });
        
        this.renderingTextureIndex = 0;
    }


    public render(time: number, deltaTime : number) {
        
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }

    
    public addTexture(
        texture : ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas, 
        textureInfo : TextureInfo
    ) : WebGLTexture {
        let gl = this.webgl.getGL();

        var webglTexture = gl.createTexture()!;

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


        return webglTexture;
    }

    public useTexture(index : number) {
        if (index < 0 || index >= this.webglTextures.length) {
            console.error("Invalid texture index");
        }
        this.renderingTextureIndex = index;
    }

    public setEnable(isEnable : boolean) {
        this.isEnable = isEnable;
    }
}

export default WebGLRenderer;