import InputManager from "../../inputs/InputManager";
import Component from "../Component";

class Button extends Component{
    private onClick: () => void;
    private x : number;
    private y : number;
    private width : number;
    private height : number;

    private isPressed: boolean = false;

    private boundMouseDown: (event: MouseEvent) => void;
    private boundMouseUp: (event: MouseEvent) => void;

    constructor(x : number, y : number, width : number, height : number, onClick: () => void = ()=>{}) {
        super();
        this.onClick = onClick;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.boundMouseDown = this.mouseDown.bind(this);
        this.boundMouseUp = this.mouseUp.bind(this);

    }

    public onEnable(): void {
        // Add to UI Manager

        InputManager.getInstance().subscribeMouseDown(this.boundMouseDown);
        InputManager.getInstance().subscribeMouseUp(this.boundMouseUp);
    
    }

    private mouseDown(event : MouseEvent): void {
        if (this.isMouseInside(event)) {
            this.isPressed = true;
            this.onMouseDown(event);
        }
    }

    private mouseUp(event : MouseEvent): void {
        if (this.isPressed) {
            this.isPressed = false;
            this.onMouseUp(event);

            if (this.isMouseInside(event)) {
                this.onClick();
            }
        }
    }

    protected onMouseDown(event: MouseEvent): void {

        console.log("Mouse Down");
    }


    protected onMouseUp(event: MouseEvent) {

        console.log("Mouse Up");
    }

    private isMouseInside(event : MouseEvent) : boolean {
        return event.clientX >= this.x &&
        event.clientX <= this.x + this.width &&
        event.clientY >= this.y &&
        event.clientY <= this.y + this.height;
    }

    protected onDisable(): void {
        InputManager.getInstance().unsubscribeMouseDown(this.boundMouseDown);
        InputManager.getInstance().unsubscribeMouseUp(this.boundMouseUp);
    }
    

    public clone(): Component {
        return new Button(this.x, this.y, this.width, this.height, this.onClick);
    }
    
}

export default Button;