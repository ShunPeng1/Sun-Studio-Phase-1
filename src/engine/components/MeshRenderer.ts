import WebGLManager from "../webgl/WebGLManager";
import Polyhedron from "../webgl/shapes/Polyhedron";
import Component from "./Component";

import Renderer from "./Renderer";
import TextureInfo from "../webgl/textures/TextureInfo";
import Mesh from "../webgl/shapes/Mesh";



class MeshRenderer extends Renderer {

    private mesh : Mesh;
    private textureUrl : string;
    private textureInfo: TextureInfo;

    constructor(webgl : WebGLManager, mesh : Mesh, textureUrl : string, textureInfo : TextureInfo ) {
        super(webgl);
        
        this.mesh = mesh;
        this.textureUrl = textureUrl;
        this.textureInfo = textureInfo;

        
        let shape = new Polyhedron(this.webgl.getGL(), this.webgl.getProgram(),mesh);
        this.initializeShape(shape);
        this.initializeTexture(textureUrl, textureInfo);

    }

    
    public clone(): Component {
        // Add your implementation here
        return new MeshRenderer(this.webgl, this.mesh, this.textureUrl, this.textureInfo);
    }
    

}

export default MeshRenderer;
