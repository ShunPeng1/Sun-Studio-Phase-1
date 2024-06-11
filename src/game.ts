import Canvas from "./webgl/Canvas";
import WebGLManager from "./webgl/WebGLManager";


class Game {
    private canvas: HTMLCanvasElement | null ;
    private webGLManager: WebGLManager;
    private lastTime : number = 0;
    private deltaTime : number = 0;


    
    constructor() {
        // Create canvas  
        let canvas = new Canvas('game', 800, 600);
        this.canvas = canvas.createCanvas();
        
    
        this.webGLManager = new WebGLManager(this.canvas);
    
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    private loop = () : void => {
        let time = performance.now();
        this.deltaTime = time - this.lastTime;
        
        this.processInput();
        this.update(time, this.deltaTime);
        this.render(time, this.deltaTime);
        
        requestAnimationFrame(this.loop);
    }

    private processInput() {
        // Get input
        window.addEventListener('keydown', (event) => {
            console.log(event.key);
        });
    }

    private update(time: number, deltaTime : number) : void {
        // Update game objects
        return;
    }

    private render(time: number, deltaTime : number) : void {
        this.webGLManager.render(time,deltaTime);
    
    }

}

new Game()
