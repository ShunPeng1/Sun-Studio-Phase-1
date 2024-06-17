import WebGLManager from "../../webgl/WebGLManager";
import Shape from "../../webgl/shapes/Shape";
import TextureInfo from "../../webgl/textures/TextureInfo";
import Component from "../Component";
import Renderer from "./Renderer";


class PrimativeRenderer extends Renderer {



    public constructor(webgl : WebGLManager, shape: Shape, textureUrl : string, textureInfo : TextureInfo) {
        super(webgl);
    
        this.initializeShape(shape);

        this.initializeTexture(textureUrl, textureInfo);


    }

    public clone(): Component {
        // Add your implementation here
        return new PrimativeRenderer(this.webgl, this.shape, this.textureUrl, this.textureInfo);
    }

    public render(time: number, deltaTime : number) {
        if (this.shape === undefined) {
            return;
        }
        let gl = this.webgl.getGL();

        // Get the location of the transformation matrix uniform
        let modelMatrixUniformLocation = gl.getUniformLocation(this.webgl.getProgram(), 'mWorld');

        gl.uniformMatrix4fv(modelMatrixUniformLocation, false, this.transform.getWorldMatrix());

        // Unbind any previously bound texture
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Texture
        if (this.webglTexture) {
            let modelMatrixUniformLocation = gl.getUniformLocation(this.webgl.getProgram(), 'mTexScale');

            gl.uniform2fv(modelMatrixUniformLocation, this.transform.getXYScale());

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.webglTexture);
            
        }


        // Set the transformation matrix
        this.shape.draw();
        

        // Unbind the texture
        if (this.webglTexture) {
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }
  
}

export default PrimativeRenderer;