import WebGLManager from "../../webgl/WebGLManager";
import Polyhedron from "../../webgl/shapes/Polyhedron";
import Component from "../Component";

import Renderer from "./Renderer";
import TextureInfo from "../../webgl/textures/TextureInfo";
import Mesh from "../../webgl/shapes/Mesh";



class MeshRenderer extends Renderer {
    private mesh : Mesh;

    constructor(webgl : WebGLManager, mesh : Mesh, textureUrl : string, textureInfo : TextureInfo ) {
        super(webgl);
        this.mesh = mesh;
        
        let shape = new Polyhedron(this.webgl.getGL(), this.webgl.getProgram(), mesh);
        this.initializeShape(shape);
        this.initializeTexture(textureUrl, textureInfo);

    }

    
    public clone(): Component {
        // Add your implementation here
        return new MeshRenderer(this.webgl, this.mesh, this.textureUrl, this.textureInfo);
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

            gl.uniform2fv(modelMatrixUniformLocation, [1,1]);

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

export default MeshRenderer;
