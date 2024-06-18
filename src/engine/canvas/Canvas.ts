class Canvas {
    
    private element: HTMLCanvasElement;


    constructor(id: string, width: number, height: number, zIndex: number) {

        let canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width = width;
        canvas.height = height;
        canvas.textContent = 'Your browser does not support the HTML5 canvas element.';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = zIndex.toString();

        document.body.appendChild(canvas);

        this.element = canvas;
        
    }


    public get2dContext(): CanvasRenderingContext2D {
        return this.element.getContext("2d")!;
    }

    public getWebGLContext(): WebGLRenderingContext {
        if (!this.element.getContext('webgl')) {
            console.log('WebGL not supported, falling back on experimental-webgl');
            return this.element.getContext('experimental-webgl')! as WebGLRenderingContext;
        }

        return this.element.getContext('webgl')!;
    }

    public getHtmlCanvasElement(): HTMLCanvasElement {
        return this.element;
    }
}

export default Canvas;