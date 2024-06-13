import WebGLManager from "../webgl/WebGLManager";
import Shape from "../webgl/shapes/Shape";
import TextureInfo from "../webgl/textures/TextureInfo";
import Component from "./Component";
import Renderer from "./Renderer";


class PrimativeRenderer extends Renderer {

    private textureUrl : string;
    private textureInfo: TextureInfo;


    public constructor(webgl : WebGLManager, shape: Shape, textureUrl : string, textureInfo : TextureInfo) {
        super(webgl);


        this.initializeShape(shape);

        this.initializeTexture(textureUrl, textureInfo);


    }

    public clone(): Component {
        // Add your implementation here
        return new PrimativeRenderer(this.webgl, this.shape, this.textureUrl, this.textureInfo);
    }

    
  
}

export default PrimativeRenderer;