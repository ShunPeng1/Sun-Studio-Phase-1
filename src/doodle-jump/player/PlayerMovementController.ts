import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import InputManager from "../../engine/inputs/InputManager";
import Player from "./Player";


class PlayerMovementController extends Component {

    private maxSpeed : number;
    private force : number;

    private headingXPosition : number
    private isPressingLeft : boolean = false;
    private isPressingRight : boolean = false;

    private player : Player;
    private rigidbody : Rigidbody;
    
    constructor(maxSpeed : number, force : number = 1000) {
        super();
        this.maxSpeed = maxSpeed;
        this.force = force;
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.stopLeft = this.stopLeft.bind(this);
        this.stopRight = this.stopRight.bind(this);
        
    }
    public awake(): void {
        this.headingXPosition = 0;
        
        this.player = this.gameObject.getComponent<Player>(Player)!;
        this.rigidbody = this.gameObject.getComponent<Rigidbody>(Rigidbody)!;

        InputManager.getInstance().subscribeKeyDown("ArrowLeft" , this.moveLeft);
        InputManager.getInstance().subscribeKeyDown("ArrowRight" , this.moveRight);
        InputManager.getInstance().subscribeKeyUp("ArrowLeft" , this.stopLeft);
        InputManager.getInstance().subscribeKeyUp("ArrowRight" , this.stopRight);
    }


    protected onEnable(): void {
        this.player.subscribeStun(() => {
            this.setEnable(false);    
        });
        
    }

    
    public fixedUpdate(time: number, deltaTime : number) {
        
        
        if (!this.isEnable){
            return;
        }

        let lastHeadingXPosition = this.headingXPosition;
        if (this.isPressingLeft && !this.isPressingRight) {
            this.headingXPosition = -1;
        } else if (this.isPressingRight && !this.isPressingLeft) {
            this.headingXPosition = 1;
        } else {
            this.headingXPosition = 0;
        }

        if (this.headingXPosition === 0 ) {
            this.rigidbody.velocity[0] = 0;

        }
        else{
            if (lastHeadingXPosition !== this.headingXPosition){
                this.rigidbody.velocity[0] = -this.rigidbody.velocity[0];
            }
    
            
            if (this.rigidbody.velocity[0] > this.maxSpeed) {
                this.rigidbody.velocity[0] = this.maxSpeed;
            } else if (this.rigidbody.velocity[0] < -this.maxSpeed) {
                this.rigidbody.velocity[0] = -this.maxSpeed;
            }
    
            this.rigidbody.addForce([this.force * deltaTime * this.headingXPosition , 0, 0]);    
        }

        
        //this.gameObject.transform.position[0] += this.headingXPosition * deltaTime * this.maxSpeed;
        



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
        return new PlayerMovementController(this.maxSpeed, this.force);
    }
}

export default PlayerMovementController;