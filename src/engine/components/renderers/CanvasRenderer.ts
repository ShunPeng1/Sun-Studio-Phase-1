
import CanvasManager from "../../canvas/CanvasManager";
import Component from "../Component";

class CanvasRenderer extends Component {
    
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;

    constructor() {
        super();
        
        this.canvas = CanvasManager.getInstance().get2dCanvas();
        this.context = CanvasManager.getInstance().get2dCanvasRenderingContext();
    }

    public render(time: number, deltaTime: number) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public clone(): Component {
        return new CanvasRenderer();
    }
}

export default CanvasRenderer;
