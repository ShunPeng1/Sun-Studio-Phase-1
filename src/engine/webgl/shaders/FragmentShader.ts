import BaseShader from './BaseShader';
import ShaderType from "./ShaderType";

class FragmentShader extends BaseShader {
    private fragmentShaderText = [
        'precision mediump float;',
        '',
        'varying vec4 fragColor;',
        'varying vec3 fragNormal;',
        'varying vec2 fragTexCoord;',

        'uniform sampler2D sampler;', // Texture sampler
        'uniform vec2 mTexScale;',
        'void main()',
        '{',
        '  vec4 texColor = texture2D(sampler, fragTexCoord );',
        
        '  if (texColor.a * fragColor.a <= 0.01) {',
        '    discard;',
        '  }',
        'gl_FragColor = fragColor * texColor ;',
        '}'
    ].join('\n');

    constructor(gl: WebGLRenderingContext) {
        super(gl, ShaderType.Fragment);
    }

    public getSource(): string {
        return this.fragmentShaderText;
    }
}

export default FragmentShader;
