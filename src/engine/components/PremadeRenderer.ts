// import WebGLManager from "../webgl/WebGLManager";
// import ShapeType from "../webgl/shapes/ShapeType";
// import Component from "./Component";
// import Renderer from "./Renderer";


// class PremadeRenderer extends Renderer {

//     public constructor(webgl : WebGLManager, shapeType : ShapeType, textureUrl : string, textureInfo : TextureInfo) {
//         super(webgl);

//         switch (shapeType) {
//             case ShapeType.CUBE:
//                 this.initializeShape(new Cube(this.webgl.getGL(), this.webgl.getProgram()));
//                 break;
            
//                 default:
//                 console.error('Unsupported shape type');
//                 return;
//         }


//         this.initializeShape(shapeType);

//         this.initializeTexture(textureUrl, textureInfo);


//     }

//     public clone(): Component {
//         // Add your implementation here
//         return new PremadeRenderer(this.webgl, this.objectUrl, this.textureUrl);
//     }

    
  
// }