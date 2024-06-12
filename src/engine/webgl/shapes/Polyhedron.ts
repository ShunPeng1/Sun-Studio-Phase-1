import Shape from "./Shape";
import Mesh from "./Mesh";

class Polyhedron extends Shape {
    constructor(gl: WebGLRenderingContext, program: WebGLProgram, mesh: Mesh) {
        super(gl, program, mesh);
    }

    public draw() {
        let gl = this.gl;

        // Bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);

        // Texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(gl.TEXTURE0);

        // Draw the box
        gl.drawElements(gl.TRIANGLES, this.mesh.getIndicesLength(), gl.UNSIGNED_SHORT, 0);

        // Unbind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }
}   


export default Polyhedron;