import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import Monster from "./Monster";

class Bullet extends Component {
    private collider : Collider;

    private onColliderHit : (other : Collider) => void ;

    constructor() {
        super();
    
        this.onColliderHit = this.checkMonsterHit.bind(this);
    }


    public awake(): void {
        this.collider = this.gameObject.getComponent<Collider>(Collider)!;


    }
    
    protected onEnable(): void {
        this.collider.subcribeToCollisionEnter(this.onColliderHit);
    
    }  

    checkMonsterHit(other : Collider){
        if(other.gameObject.getComponent<Monster>(Monster)){
            other.gameObject.destroy();
            this.gameObject.destroy();
        }

    }


    protected onDisable(): void {
        this.collider.unsubcribeToCollisionEnter(this.onColliderHit);
    }
    
    public clone(): Component {
        return new Bullet();
    }
}


export default Bullet;