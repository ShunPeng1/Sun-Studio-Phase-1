import Component from "../../engine/components/Component";
import InputManager from "../../engine/inputs/InputManager";


class LeftRightControlMovement extends Component {

    private speed : number;
    private headingXPosition : number
    private isPressingLeft : boolean = false;
    private isPressingRight : boolean = false;

    
    
    constructor(speed : number) {
        super();
        this.speed = speed;
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.stopLeft = this.stopLeft.bind(this);
        this.stopRight = this.stopRight.bind(this);
        
    }
    public awake(): void {
        this.headingXPosition = 0;
        

        InputManager.getInstance().subscribeKeyDown("ArrowLeft" , this.moveLeft);
        InputManager.getInstance().subscribeKeyDown("ArrowRight" , this.moveRight);
        InputManager.getInstance().subscribeKeyUp("ArrowLeft" , this.stopLeft);
        InputManager.getInstance().subscribeKeyUp("ArrowRight" , this.stopRight);
    }
    
    public update(time: number, deltaTime : number) {
        
        if (this.isPressingLeft && !this.isPressingRight) {
            this.headingXPosition = -1;
        } else if (this.isPressingRight && !this.isPressingLeft) {
            this.headingXPosition = 1;
        } else {
            this.headingXPosition = 0;
        }

        this.gameObject.transform.position[0] += this.headingXPosition * deltaTime * this.speed;
    
        // Only rotate the player if it's moving
        if (this.headingXPosition !== 0) {
            this.gameObject.transform.rotation[1] = (this.headingXPosition == 1 ? 1 : 0) * Math.PI; 
       
        }
    }

    public moveLeft() {
        this.isPressingLeft = true;
    }

    public moveRight() {
        this.isPressingRight = true;
    }

    public stopLeft() {
        this.isPressingLeft = false;
    }

    public stopRight() {
        this.isPressingRight = false;
    }

    
    public  clone() {
        return new LeftRightControlMovement(this.speed);
    }
}

export default LeftRightControlMovement;