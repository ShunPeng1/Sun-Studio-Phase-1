import WebGLManager from "../WebGLManager";
import Box from "../shapes/Box";
import Quad from "../shapes/Quad";
import Shape from "../shapes/Shape";
import ShapeType from "../shapes/ShapeType";

class ShapeFactory {
    private webgl: WebGLManager;

    constructor(webgl: WebGLManager) {
        this.webgl = webgl;
    }

    public createShape(shapeType: ShapeType, colors : number[] = [], textureCoordinates : number[] = []): Shape {
        // Check if the shape is in the cache
        
        let shape: Shape;
        switch(shapeType){
            case ShapeType.Box:
                
                shape = new Box(this.webgl.getGL(), this.webgl.getProgram(), colors, textureCoordinates);
                break;
            case ShapeType.Quad:
                shape = new Quad(this.webgl.getGL(), this.webgl.getProgram(), colors, textureCoordinates);
                break;
            default:
                throw new Error('Unsupported shape type');
        }

        return shape;
    }

}

export default ShapeFactory;