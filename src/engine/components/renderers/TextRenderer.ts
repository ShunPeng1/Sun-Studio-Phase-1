import Canvas from "../../canvas/Canvas";
import CanvasManager from "../../canvas/CanvasManager";
import CanvasRenderer from "./CanvasRenderer";

class TextRenderer extends CanvasRenderer {
    private text: string = '';
    private x: number = 0;
    private y: number = 0;
    private color: string = 'black';
    private font: string = '16px Arial';


    constructor(text: string, x: number, y: number, color: string = 'black', font: string = '16px Arial') {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.font = font;


    }

    public awake(): void {
        this.renderText();
    }


    public render(time: number, deltaTime: number) {
        this.renderText();
    }

    public renderText() {
        this.context.fillStyle = this.color;
        this.context.font = this.font;
        this.context.fillText(this.text, this.x, this.y);
    }

    public setText(text: string) {
        this.text = text;
    }

    public setX(x: number) {
        this.x = x;
    }

    public setY(y: number) {
        this.y = y;
    }

    public setColor(color: string) {
        this.color = color;
    }

    public setFont(font: string) {
        this.font = font;
    }

    public getText() {
        return this.text;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getColor() {
        return this.color;
    }

    public getFont() {
        return this.font;
    }




    public clone(): CanvasRenderer {
        return new TextRenderer(this.text, this.x, this.y, this.color, this.font);
    }
}

export default TextRenderer;