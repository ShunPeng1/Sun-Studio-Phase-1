import WebGLManager from "../webgl/WebGLManager";
import Polyhedron from "../webgl/shapes/Polyhedron";
import Component from "./Component";
import { JsonModelReader, JsonModelResult } from "../webgl/shapes/readers/JsonReader";
import { ObjReader, ObjReaderResult } from "../webgl/shapes/readers/OjbReader";
import Renderer from "./Renderer";
import TextureInfo from "../webgl/textures/TextureInfo";



class MeshRenderer extends Renderer {

    private objectUrl : string;
    private textureUrl : string;
    private textureInfo: TextureInfo;

    constructor(webgl : WebGLManager, objectUrl : string, textureUrl : string,
        textureInfo : TextureInfo ) {
        super(webgl);
        
        this.objectUrl = objectUrl;
        this.textureUrl = textureUrl;
        this.textureInfo = textureInfo;

        switch (objectUrl.split('.').pop()) {
            case 'obj':
                new ObjReader().load(objectUrl, (result : ObjReaderResult) => {
                    let mesh = result.mesh;
                    let shape = new Polyhedron(this.webgl.getGL(), this.webgl.getProgram(),mesh);
                    this.initializeShape(shape);
                    this.initializeTexture(textureUrl, textureInfo);
                });
                break;
            case 'json':
                new JsonModelReader().load(objectUrl, (result : JsonModelResult) => {
                    let mesh = result.meshes[0];
                    console.log("mesh");  // Add this line
                    let gl = this.webgl.getGL();
                    let program = this.webgl.getProgram();
                    let shape = new Polyhedron(gl, program, mesh);
    
                    this.initializeShape(shape);
                    console.log( "Init shape")
                    this.initializeTexture(textureUrl, textureInfo);
                });
                break;
            default:
                console.error('Unsupported file format');
                return;
        }

        
    }

    
    public clone(): Component {
        // Add your implementation here
        return new MeshRenderer(this.webgl, this.objectUrl, this.textureUrl, this.textureInfo);
    }
    

}

export default MeshRenderer;
