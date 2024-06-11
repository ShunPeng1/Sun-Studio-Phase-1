import {BaseShader, ShaderType} from './BaseShader';

class FragmentShader extends BaseShader {
    private fragmentShaderText = [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        '  gl_FragColor = vec4(fragColor, 1.0);',
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
