import WebGLRenderer from "../renderers/WebGLRenderer";
import Button from "./Button";

class RendererTextureSwapButton extends Button {
    private renderer: WebGLRenderer;
    
    private mouseUpTextureIndex: number = 0;
    private mouseDownTextureIndex: number = 1;

    constructor(mouseUpTextureIndex : number, mouseDownTextureIndex: number, x: number, y: number, width: number, height: number, onClick: () => void = ()=>{}) {
        super(x, y, width, height, onClick);
    
        this.mouseUpTextureIndex = mouseUpTextureIndex;
        this.mouseDownTextureIndex = mouseDownTextureIndex;
    }

    public awake(): void {
        this.renderer = this.gameObject.getComponent<WebGLRenderer>(WebGLRenderer)!;

        this.swapTexture(this.mouseUpTextureIndex);
    }

    protected onMouseDown(event: MouseEvent): void {
        this.swapTexture(this.mouseDownTextureIndex);
    }

    protected onMouseUp(event: MouseEvent) {
        this.swapTexture(this.mouseUpTextureIndex);
    }

    public swapTexture(index : number): void {
        this.renderer.useTexture(index);
    }
}

export default RendererTextureSwapButton;