import Component from "../../engine/components/Component";
import InputManager from "../../inputs/InputManager";

class UpDownMovement extends Component {

    private speed : number;
    private headingYPosition : number
    private isPressingUp : boolean = false;
    private isPressingDown : boolean = false;
    constructor(speed : number) {
        super();
        this.speed = speed;
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.stopUp = this.stopUp.bind(this);
        this.stopDown = this.stopDown.bind(this);
        
    }
    public awake(): void {
        this.headingYPosition = 0;

        InputManager.getInstance().subscribeKeyDown("ArrowUp" , this.moveUp);
        InputManager.getInstance().subscribeKeyDown("ArrowDown" , this.moveDown);
        InputManager.getInstance().subscribeKeyUp("ArrowUp" , this.stopUp);
        InputManager.getInstance().subscribeKeyUp("ArrowDown" , this.stopDown);
    }
    
    public update(time: number, deltaTime : number) {
        
        if (this.isPressingUp && !this.isPressingDown) {
            this.headingYPosition = 1;
        } else if (this.isPressingDown && !this.isPressingUp) {
            this.headingYPosition = -1;
        } else {
            this.headingYPosition = 0;
        }

        this.gameObject.transform.position[1] += this.headingYPosition * deltaTime * this.speed;

    }

    public moveUp() {
        this.isPressingUp = true;
    }

    public moveDown() {
        this.isPressingDown = true;
    }

    public stopUp() {
        this.isPressingUp = false;
    }

    public stopDown() {
        this.isPressingDown = false;
    }

    
    public  clone() {
        return new UpDownMovement(this.speed);
    }
}

export default UpDownMovement;