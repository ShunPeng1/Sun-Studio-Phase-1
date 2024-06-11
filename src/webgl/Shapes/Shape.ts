

abstract class Shape{
    protected gl: WebGLRenderingContext;
    protected program: WebGLProgram;

    protected data: number[]; // Vertices 3, colors 4, normals 3, texCoords 2
    protected indices: number[];
    protected texture: WebGLTexture;
    
    protected vbo: WebGLBuffer; // Vertex Buffer Object (Vertices)
    protected ebo: WebGLBuffer; // Element Buffer Object (Indices)

    constructor(gl: WebGLRenderingContext, program: WebGLProgram, vertices: number[], indices: number[], color: number[], normal: number[], texCoords : number[]) {
        this.gl = gl;
        this.program = program;
        this.data = [];
        this.indices = indices;

        
        for (let i = 0; i < vertices.length / 3; i++) {
            this.data.push(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]); // Position
            this.data.push(color[i * 4], color[i * 4 + 1], color[i * 4 + 2], color[i * 4 + 3]); // Color
            this.data.push(normal[i * 3], normal[i * 3 + 1], normal[i * 3 + 2]); // Normal
            this.data.push(texCoords[i * 2], texCoords[i * 2 + 1]); // Texture Coordinates
        }

        // Create and bind the vertex buffer
        this.vbo = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.data), this.gl.STATIC_DRAW);

        // Create position attribute
        let positionAttributeLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(
            positionAttributeLocation, // Attribute location
            3, // Number of elements per attribute
            this.gl.FLOAT, // Type of elements
            false, // Normalized
            12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (position + color + normal)
            0
        );

        // Create color attribute
        let colorAttributeLocation = this.gl.getAttribLocation(this.program, 'vertColor');
        this.gl.enableVertexAttribArray(colorAttributeLocation);
        this.gl.vertexAttribPointer(
            colorAttributeLocation,
            4,
            this.gl.FLOAT,
            false,
            12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (position + color + normal)
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        // Create normal attribute
        let normalAttributeLocation = this.gl.getAttribLocation(this.program, 'vertNormal');
        this.gl.enableVertexAttribArray(normalAttributeLocation);
        this.gl.vertexAttribPointer(
            normalAttributeLocation,
            3,
            this.gl.FLOAT,
            false,
            12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (position + color + normal)
            7 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        // Create texture attribute
        let texCoordAttributeLocation = this.gl.getAttribLocation(this.program, 'vertTexCoord');
        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.vertexAttribPointer(
            texCoordAttributeLocation,
            2,
            this.gl.FLOAT,
            false,
            12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (position + color + normal)
            10 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );


        // Create and bind the index buffer
        this.ebo = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        

        // Unbind the buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    

    }

    public addTexture(image : ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas) : void {
        let gl = this.gl;

        var texture = gl.createTexture()!;
        this.texture = texture;

        gl.bindTexture(gl.TEXTURE_2D, texture);
       
        // Set the parameters so we can render any size image
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
       
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

export default Shape;