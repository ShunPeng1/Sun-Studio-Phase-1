import {BaseShader, ShaderType} from './BaseShader';

class VertexShader extends BaseShader {
    private vertexShaderText = [
        'precision mediump float;',
        '',
        'attribute vec3 vertPosition;',
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        'uniform mat4 mWorld;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        '',
        'void main()',
        '{',
        '  fragColor = vertColor;',
        '  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
        '}'
    ].join('\n');



    constructor(gl: WebGLRenderingContext) {
        super(gl, ShaderType.Vertex);
    }

    public getSource(): string {
        return this.vertexShaderText;
    }
}

export default VertexShader;