import Canvas from "./Canvas";

class CanvasManager {
    private static instance: CanvasManager;
    private webglCanvas: Canvas;
    private html2dCanvas: Canvas;
    private webglCanvasContext: WebGLRenderingContext;
    private html2dCanvasContext: CanvasRenderingContext2D;

    private constructor(width: number = 800, height: number = 600) {

        this.webglCanvas = new Canvas("Webgl Canvas", width, height, 0);
        this.html2dCanvas = new Canvas("2d Canvas", width, height, 1);

        this.webglCanvasContext = this.webglCanvas.getWebGLContext();
        this.html2dCanvasContext = this.html2dCanvas.get2dContext();
    }

    public static createInstance(width: number = 800, height: number = 600): CanvasManager {
        if (!CanvasManager.instance) {
            CanvasManager.instance = new CanvasManager(width, height);
        }
        return CanvasManager.instance;
    }

    public static getInstance(): CanvasManager {
        if (!CanvasManager.instance) {
            CanvasManager.instance = new CanvasManager();
        }
        return CanvasManager.instance;
    }

    public getWebglCanvas(): HTMLCanvasElement {
        return this.webglCanvas.getHtmlCanvasElement();
    }

    public get2dCanvas(): HTMLCanvasElement {
        return this.html2dCanvas.getHtmlCanvasElement();
    }

    public getWebglCanvasRenderingContext(): WebGLRenderingContext {
        return this.webglCanvasContext;
    }

    public get2dCanvasRenderingContext(): CanvasRenderingContext2D {
        return this.html2dCanvasContext;
    }
    
}

export default CanvasManager;