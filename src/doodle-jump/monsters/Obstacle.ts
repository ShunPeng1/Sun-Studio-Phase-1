import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import Player from "../player/Player";

class Obstacle extends Component{
    private collider : Collider;

    private onColliderHit : (other : Collider) => void ;
    constructor() {
        super();
    
    }


    public awake(): void {
        this.collider = this.gameObject.getComponent<Collider>(Collider)!;


        this.onColliderHit = this.checkPlayerHit.bind(this);
        
    }
    
    protected onEnable(): void {
        this.collider.subcribeToCollisionEnter(this.onColliderHit);
    
    }  

    private checkPlayerHit(other : Collider){
        let player = other.gameObject.getComponent<Player>(Player);
        if(player){

            this.onPlayerHit(player);
        
        }

    }


    protected onPlayerHit(player: Player): void {
    }


    protected onDisable(): void {
        this.collider.unsubcribeToCollisionEnter(this.onColliderHit);
    }
    
    public clone(): Component {
        return new Obstacle();
    }

}


export default Obstacle;