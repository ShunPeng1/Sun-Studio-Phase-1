

abstract class Shape{
    protected gl: WebGLRenderingContext;
    protected program: WebGLProgram;

    protected data: number[]; // Vertices 3, colors 3, normals 3
    protected indices: number[];
    
    protected vbo: WebGLBuffer; // Vertex Buffer Object (Vertices)
    protected ebo: WebGLBuffer; // Element Buffer Object (Indices)

    constructor(gl: WebGLRenderingContext, program: WebGLProgram, vertices: number[], indices: number[], color: number[], normal: number[]) {
        this.gl = gl;
        this.program = program;

        
        this.data = [];
        for (let i = 0; i < vertices.length / 3; i++) {
            this.data.push(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]); // Position
            this.data.push(color[i * 3], color[i * 3 + 1], color[i * 3 + 2]); // Color
            this.data.push(normal[i * 3], normal[i * 3 + 1], normal[i * 3 + 2]); // Normal
        }

        // Create and bind the vertex buffer
        this.vbo = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.data), this.gl.STATIC_DRAW);

        // Create position attribute
        let positionAttributeLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(
            positionAttributeLocation,
            3,
            this.gl.FLOAT,
            false,
            9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (position + color + normal)
            0
        );

        // Create color attribute
        let colorAttributeLocation = this.gl.getAttribLocation(this.program, 'vertColor');
        this.gl.enableVertexAttribArray(colorAttributeLocation);
        this.gl.vertexAttribPointer(
            colorAttributeLocation,
            3,
            this.gl.FLOAT,
            false,
            9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (position + color + normal)
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
            9 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (position + color + normal)
            6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        // Create and bind the index buffer
        this.ebo = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        // Unbind the buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    

    }


    public abstract draw(): void;
}

export default Shape;