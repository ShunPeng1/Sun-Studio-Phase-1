import { TextureFilter, TextureType, TextureWrap } from "../textures/TextureEnum";
import TextureInfo from "../textures/TextureInfo";
import Mesh from "./Mesh";


abstract class Shape{
    protected gl: WebGLRenderingContext;
    protected program: WebGLProgram;

    protected texture: WebGLTexture;
    protected mesh: Mesh;
    
    protected vbo: WebGLBuffer; // Vertex Buffer Object (Vertices)
    protected ebo: WebGLBuffer; // Element Buffer Object (Indices)

    constructor(gl: WebGLRenderingContext, program: WebGLProgram, mesh : Mesh) {
        this.gl = gl;
        this.program = program;
        this.mesh = mesh;

        let vboDataLength = mesh.getVertexLength() * Float32Array.BYTES_PER_ELEMENT; // Size of an individual vertex (position + color + normal + texture coordinates)
        
        // Create and bind the vertex buffer
        this.vbo = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(mesh.getVboData()), this.gl.STATIC_DRAW);

        // Create position attribute
        let positionAttributeLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(
            positionAttributeLocation, // Attribute location
            mesh.getPositionLength(), // Number of elements per attribute
            this.gl.FLOAT, // Type of elements
            false, // Normalized
            vboDataLength, 
            mesh.getPositionsOffset() * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        // Create color attribute
        let colorAttributeLocation = this.gl.getAttribLocation(this.program, 'vertColor');
        this.gl.enableVertexAttribArray(colorAttributeLocation);
        this.gl.vertexAttribPointer(
            colorAttributeLocation,
            mesh.getColorLength(),
            this.gl.FLOAT,
            false,
            vboDataLength, 
            mesh.getColorsOffset() * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        // Create normal attribute
        let normalAttributeLocation = this.gl.getAttribLocation(this.program, 'vertNormal');
        this.gl.enableVertexAttribArray(normalAttributeLocation);
        this.gl.vertexAttribPointer(
            normalAttributeLocation,
            mesh.getNormalLength(),
            this.gl.FLOAT,
            false,
            vboDataLength,
            mesh.getNormalsOffset() * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        // Create texture attribute
        let texCoordAttributeLocation = this.gl.getAttribLocation(this.program, 'vertTexCoord');
        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.vertexAttribPointer(
            texCoordAttributeLocation,
            mesh.getTextureCoordsLength(),
            this.gl.FLOAT,
            false,
            vboDataLength,
            mesh.getTextureCoordsOffset() * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );


        // Create and bind the index buffer
        this.ebo = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.getIndices()), this.gl.STATIC_DRAW);

        

        // Unbind the buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    
        
    }



    public draw(): void {
        
        let gl = this.gl;
        // Use the correct program
        //gl.useProgram(this.program);

        // Bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        
        
        // Draw the box
        gl.drawElements(gl.TRIANGLES, this.mesh.getIndicesLength(), gl.UNSIGNED_SHORT, 0);

        // Unbind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

       
    }
}

export {TextureType, TextureWrap, TextureFilter};
export default Shape;