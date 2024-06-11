class Canvas {
    private element: HTMLCanvasElement;
    private id: string;
    private width: number;
    private height: number;


    constructor(id: string, width: number, height: number) {
        this.id = id;
        this.width = width;
        this.height = height;
    }

    public createCanvas(): HTMLCanvasElement {
        let canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.textContent = 'Your browser does not support the HTML5 canvas element.';

        document.body.appendChild(canvas);

        this.element = canvas;

        return this.element;
    }


    public getCanvas(): HTMLCanvasElement {
        return this.element;
    }
}

export default Canvas;