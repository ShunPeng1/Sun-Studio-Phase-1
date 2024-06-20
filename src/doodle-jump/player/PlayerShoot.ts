import { vec2, vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import GameObject from "../../engine/gameobjects/GameObject";
import InputManager from "../../engine/inputs/InputManager";
import PlayerTrunk from "./PlayerTrunk";
import CanvasManager from "../../engine/canvas/CanvasManager";

class PlayerShoot extends Component{

    private playerTrunk : PlayerTrunk;

    private inputManager : InputManager;

    private spaceShoot : () => void;
    private mouseShoot : (event : MouseEvent) => void;

    constructor(){
        super();
    
        

        this.spaceShoot = this.onSpaceShoot.bind(this);
        this.mouseShoot = this.onMouseShoot.bind(this);
    }

    public awake(): void {
        this.inputManager = InputManager.getInstance();
    
        this.playerTrunk = this.gameObject.getComponent<PlayerTrunk>(PlayerTrunk)!;
    }

    protected onEnable(): void {
        this.inputManager.subscribeKeyDown(' ', this.spaceShoot);

        this.inputManager.subscribeMouseDown(this.mouseShoot);
    }

    protected onDisable(): void {
        this.inputManager.unsubscribeKeyDown(' ', this.spaceShoot);

        this.inputManager.unsubscribeMouseDown(this.mouseShoot);
    }

    private onSpaceShoot() {
        this.shoot(Math.PI/2);  
    }

    private onMouseShoot(event : MouseEvent) {
        let gameWitdh = CanvasManager.getInstance().getWidth();
        let gameHeight = CanvasManager.getInstance().getHeight();

        if (event.clientX < 0 || event.clientX > gameWitdh || event.clientY < 0 || event.clientY > gameHeight){
            return;
        }

        let angle = Math.acos( (gameWitdh/2 - event.clientX)/ ( gameWitdh/2) )  ;
        
        this.shoot(angle);
    }

    public shoot(angle : number = 0) {
        this.playerTrunk.shoot(angle);
    }

    public clone(): Component {
        return new PlayerShoot();
    }

}

export default PlayerShoot;