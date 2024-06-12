import Mesh from "./Mesh";

enum TextureType {
    TEXTURE_2D = WebGLRenderingContext.TEXTURE_2D,
    TEXTURE_CUBE_MAP = WebGLRenderingContext.TEXTURE_CUBE_MAP
}

enum TextureWrap {
    CLAMP_TO_EDGE = WebGLRenderingContext.CLAMP_TO_EDGE,
    MIRRORED_REPEAT = WebGLRenderingContext.MIRRORED_REPEAT,
    REPEAT = WebGLRenderingContext.REPEAT
}

enum TextureFilter {
    LINEAR = WebGLRenderingContext.LINEAR,
    NEAREST = WebGLRenderingContext.NEAREST
}


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

    public addTexture(
        image : ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas, 
        isFlipY : boolean = false,
        textureType : TextureType = TextureType.TEXTURE_2D,
        textureWrapS : TextureWrap = TextureWrap.CLAMP_TO_EDGE,
        textureWrapT : TextureWrap = textureWrapS,
        textureMinFilter : TextureFilter = TextureFilter.LINEAR,
        textureMagFilter : TextureFilter = TextureFilter.LINEAR
    ) : void {
        let gl = this.gl;

        var texture = gl.createTexture()!;
        this.texture = texture;

        gl.bindTexture(textureType, texture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, isFlipY); 
        
        // Set the parameters so we can render any size image
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, textureWrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, textureWrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, textureMinFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, textureMagFilter);
       
        if (image instanceof ImageData) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image.data);
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        }

        // Unbind the texture
        gl.bindTexture(gl.TEXTURE_2D, null);

    }


    public abstract draw(): void;
}

export {TextureType, TextureWrap, TextureFilter};
export default Shape;