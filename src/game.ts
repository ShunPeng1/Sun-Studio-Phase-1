import Canvas from "./webgl/Canvas";
import WebGLManager from "./webgl/WebGLManager";


class Game {
    canvas: HTMLCanvasElement | null ;

    
    constructor() {
        // Create canvas  
        let canvas = new Canvas('game', 800, 600);
        this.canvas = canvas.createCanvas();
        
    
        let webGLManager = new WebGLManager(this.canvas);


    }

}

new Game()
