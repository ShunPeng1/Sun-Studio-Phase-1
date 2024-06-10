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

    createCanvas(){
        let canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.textContent = 'Your browser does not support the HTML5 canvas element.';
        
        document.body.appendChild(canvas);
    
        this.element = canvas;

        return this.element;
    }


    getCanvas(){
        return this.element;
    }
}


class Game {
    canvas: HTMLCanvasElement | null ;
    gl : WebGLRenderingContext | null;
    
    constructor() {

        let gameCanvas = new Canvas('game-surface', 800, 600);
        this.canvas = gameCanvas.createCanvas();
        
        this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext;

        if (!this.gl) {
            console.log('WebGL not supported, falling back on experimental-webgl');
            this.gl = this.canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        }

        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        console.log('Game created');
        

        this.gl.clearColor(1.0, 1.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    }

}

new Game()
