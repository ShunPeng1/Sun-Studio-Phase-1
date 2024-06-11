enum ShaderType {
    Vertex = WebGLRenderingContext.VERTEX_SHADER,
    Fragment = WebGLRenderingContext.FRAGMENT_SHADER
}


abstract class BaseShader {
    public webGlShader: WebGLShader;
    public type: ShaderType;


    constructor(gl: WebGLRenderingContext, type: ShaderType) {
        let shader = gl.createShader(type);

        if (!shader) {
            console.error('Error creating shader');
            throw new Error('Error creating shader');
        }

        this.type = type;
        this.webGlShader = shader;
    }


    public abstract getSource(): string;

}

export { BaseShader, ShaderType };