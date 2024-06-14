import BaseShader from './BaseShader';
import ShaderType from "./ShaderType";

class VertexShader extends BaseShader {
    private vertexShaderText = [
        'precision mediump float;',
        '',
        'attribute vec3 vertPosition;',
        'attribute vec4 vertColor;',
        'attribute vec3 vertNormal;',
        'attribute vec2 vertTexCoord;',

        'varying vec4 fragColor;',
        'varying vec3 fragNormal;',
        'varying vec2 fragTexCoord;',
        
        'uniform mat4 mWorld;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        'uniform vec2 mTexScale;',
        '',
        'void main()',
        '{',
        '  fragColor = vertColor;',
        '  fragTexCoord = vertTexCoord * vec2(1,1);',
        '  fragNormal = vertNormal;',
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