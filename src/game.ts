enum ShaderType {
    Vertex = WebGLRenderingContext.VERTEX_SHADER,
    Fragment = WebGLRenderingContext.FRAGMENT_SHADER
}


abstract class BaseShader{
    public shader : WebGLShader;
    public type : ShaderType;


    constructor(gl : WebGLRenderingContext, type : ShaderType){
        let shader = gl.createShader(type);

        if (!shader) {
            console.error('Error creating shader');
            throw new Error('Error creating shader');
        }

        this.type = type;
        this.shader = shader;
    }

    
    public abstract getSource() : string;

}

class VertexShader extends BaseShader{
    private vertexShaderText = 
    [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main()',
    '{',
    '  fragColor = vertColor;',
    '  gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
    ].join('\n');
    
    

    constructor(gl : WebGLRenderingContext){
        super(gl, ShaderType.Vertex);
    }

    public getSource() : string{
        return `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `;
    }
}

class FragmentShader extends BaseShader{
    private fragmentShaderText =
    [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '  gl_FragColor = vec4(fragColor, 1.0);',
    '}'
    ].join('\n');

    constructor(gl : WebGLRenderingContext){
        super(gl, ShaderType.Fragment);
    }

    public getSource() : string{
        return `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1, 0, 0.5, 1);
            }
        `;
    }
}

class WebGLManager{
    private gl : WebGLRenderingContext;

    constructor(canvas : HTMLCanvasElement){
        
        this.gl = canvas.getContext('webgl') as WebGLRenderingContext;

        if (!this.gl) {
            console.log('WebGL not supported, falling back on experimental-webgl');
            this.gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext;
        }

        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
    
    }

    public getGL() : WebGLRenderingContext{
        return this.gl;
    }

    public createShader(shader : BaseShader){
        
        this.gl.shaderSource(shader.shader, shader.getSource());
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('ERROR compiling shader!', this.gl.getShaderInfoLog(shader));
            return;
        }
        return shader;
    }

}


class Canvas{
    private element: HTMLCanvasElement;
    private id: string;
    private width: number;
    private height: number;

    
    constructor(id : string, width : number, height : number){
        this.id = id;
        this.width = width;
        this.height = height;
    }

    public createCanvas() : HTMLCanvasElement{
        let canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.textContent = 'Your browser does not support the HTML5 canvas element.';
        
        document.body.appendChild(canvas);
    
        this.element = canvas;

        return this.element;
    }


    public getCanvas() : HTMLCanvasElement{
        return this.element;
    }
}


class Game {
    canvas: HTMLCanvasElement | null ;

    
    constructor() {

        
        let gameCanvas = new Canvas('game-surface', 800, 600);
        this.canvas = gameCanvas.createCanvas();

        console.log('Game created');
        
        let webglManager = new WebGLManager(this.canvas);

        let webgl = webglManager.getGL();

        webgl.clearColor(1.0, 1.0, 0.0, 1.0);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

        let vertexShader = webglManager.createShader(new VertexShader(webgl));
        let fragmentShader = webglManager.createShader(new FragmentShader(webgl));


    }

}

new Game()
