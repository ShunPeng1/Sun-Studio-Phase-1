import Canvas from "../../canvas/Canvas";
import CanvasManager from "../../canvas/CanvasManager";
import CanvasRenderer from "./CanvasRenderer";

enum Align {
    LEFT = 'left',
    RIGHT = 'right',
    CENTER = 'center',
    JUSTIFY = 'justify',
    START = 'start',
    END = 'end'
}

enum Baseline {
    TOP = 'top',
    HANGING = 'hanging',
    MIDDLE = 'middle',
    ALPHABETIC = 'alphabetic',
    IDEOGRAPHIC = 'ideographic',
    BOTTOM = 'bottom'
}

enum FontStyle {
    NORMAL = 'normal',
    BOLD = 'bold',
    ITALIC = 'italic'
}
class TextRenderer extends CanvasRenderer {
    private text: string = '';
    private x: number = 0;
    private y: number = 0;
    private color: string = 'black';
    private fontSize: string = '16px';
    private fontFamily: string = 'Arial';
    private fontStyle: FontStyle = FontStyle.NORMAL;
    private align: Align = Align.CENTER;
    private baseline: Baseline = Baseline.MIDDLE;



    constructor(text: string, x: number, y: number, color: string = 'black', fontSize: string = '16px', fontFamily: string = 'Arial', fontStyle: FontStyle = FontStyle.NORMAL, align: Align = Align.CENTER, baseline: Baseline = Baseline.MIDDLE) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.fontStyle = fontStyle;
        this.align = align;
        this.baseline = baseline;
    }

    public awake(): void {
        this.renderText();
    }


    public render(time: number, deltaTime: number) {
        this.renderText();
    }

    public renderText() {
        this.context.fillStyle = this.color;
        this.context.font = `${this.fontStyle} ${this.fontSize} ${this.fontFamily}`;
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

    public setFontSize(fontSize: string) {
        this.fontSize = fontSize;
    }

    public setFontFamily(fontFamily: string) {
        this.fontFamily = fontFamily;
    }

    public setFontStyle(fontStyle: FontStyle): void {
        this.fontStyle = fontStyle;
    }

    public setAlign(align: Align): void {
        this.align = align;
    }

    public setBaseline(baseline: Baseline): void {
        this.baseline = baseline;
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
        return `${this.fontSize} ${this.fontFamily}`;
    }

    public getFontSize() {
        return this.fontSize;
    }

    public getFontFamily() {
        return this.fontFamily;
    }

    public getFontStyle(): FontStyle {
        return this.fontStyle;
    }
    
    public getAlign(): Align {
        return this.align;
    }

    public getBaseline(): Baseline {
        return this.baseline;
    }

    
    public clone(): TextRenderer {
        return new TextRenderer(this.text, this.x, this.y, this.color, this.fontSize, this.fontFamily, this.fontStyle, this.align, this.baseline);
    }
}

export default TextRenderer;