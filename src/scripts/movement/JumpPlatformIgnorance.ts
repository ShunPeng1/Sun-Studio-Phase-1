import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import PhysicManager from "../../engine/physics/PhysicManager";
import Platform from "../platforms/Platform";

class JumpPlatformIgnorance extends Component{
    
    
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
            if (collider.gameObject.getComponent<Platform>) {
                return true;
            }
            return false;
        }).forEach((collider) => {
            collider.isEnable = false;
        });

        //console.log("disable collider");
    }

    private enableCollider() {
        let physicManager = PhysicManager.getInstance();

        physicManager.queryColliders((collider : Collider) =>{
            if (collider.gameObject.getComponent<Platform>) {
                return true;
            }
            return false;
        
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


export default JumpPlatformIgnorance;