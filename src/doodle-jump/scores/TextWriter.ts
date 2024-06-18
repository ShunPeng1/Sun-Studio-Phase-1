import Component from "../../engine/components/Component";
import TextRenderer from "../../engine/components/renderers/TextRenderer";


class TextWriter extends Component{
    private textRenderer : TextRenderer;
    private prefix : string;
    private postfix : string;
    private getContent : () => string;
    constructor(textRenderer : TextRenderer, getContent : () => string , prefix : string = "", postfix : string = ""){
        super();
        this.textRenderer = textRenderer;
        this.getContent = getContent;
        this.prefix = prefix;
        this.postfix = postfix;
    }

    public update(time: number, deltaTime: number): void {
        this.textRenderer.setText(this.getString());
    }

    private getString() : string{
        return this.prefix + this.getContent() + this.postfix;
    }


    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    
}

export default TextWriter;