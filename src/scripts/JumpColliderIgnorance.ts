import Collider from "../engine/components/Collider";
import Component from "../engine/components/Component";
import Rigidbody from "../engine/components/Rigidbody";
import PhysicManager from "../engine/physics/PhysicManager";

class JumpColliderIgnorance extends Component{
    
    
    private isFalling: boolean = true;
    private isJumping: boolean = false;
    private rigidbody: Rigidbody;

    constructor(){
        super();
    
    }

    public awake(): void {
        this.rigidbody = this.gameObject.getComponent<Rigidbody>(Rigidbody)!;
        this.checkDirection();
        
        this.enableCollider();
    }

    public fixedUpdate(time: number, deltaTime: number): void {
        if (this.checkDirection()) {
            if (this.isFalling) {
                this.enableCollider();
            }
    
            if (this.isJumping) {
                this.disableCollider();
            }
        }
    }

    private checkDirection(): boolean {
        if (this.rigidbody.velocity[1] <= 0 && !this.isFalling) {
            this.isFalling = true;
            this.isJumping = false;
            return true;
        }
    
        if (this.rigidbody.velocity[1] > 0 && !this.isJumping) {
            this.isJumping = true;
            this.isFalling = false;
            return true;
        }
    
        return false;
    }

    private disableCollider() {
        let physicManager = PhysicManager.getInstance();

        physicManager.queryColliders((collider : Collider) =>{
            return collider.isEnable == true;
        
        }).forEach((collider) => {
            collider.isEnable = false;
        });

        //console.log("disable collider");
    }

    private enableCollider() {
        let physicManager = PhysicManager.getInstance();

        physicManager.queryColliders((collider : Collider) =>{
            return collider.isEnable == false;
        
        }).forEach((collider) => {
            collider.isEnable = true;
        });

        //console.log("enable collider");
    }

    public update(time: number, deltaTime: number): void {
        
    }
    
    
    
    
    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    
}


export default JumpColliderIgnorance;