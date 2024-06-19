import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import PhysicManager from "../../engine/physics/PhysicManager";
import Platform from "../platforms/Platform";
import PlatformItem from "../platform-items/PlatformItem";

class JumpPlatformIgnorance extends Component{
    private isEnable: boolean = true;    
    
    private isFalling: boolean = true;
    private isJumping: boolean = false;


    private rigidbody: Rigidbody;
    private physicsManager: PhysicManager;
    private collider: Collider;

    constructor(){
        super();
    
    }

    public awake(): void {
        this.rigidbody = this.gameObject.getComponent<Rigidbody>(Rigidbody)!;
        this.physicsManager = PhysicManager.getInstance();
        this.collider = this.gameObject.getComponent<Collider>(Collider)!;
        this.checkDirection();
        
    }

    public fixedUpdate(time: number, deltaTime: number): void {
        if (!this.isEnable) {
            return;
        }

        if (this.checkDirection()) {
            if (this.isFalling) {
                this.enablePlayerCollider();
            }
    
            if (this.isJumping) {
                this.disablePlayerCollider();
            }
        }
    }

    private checkDirection(): boolean {
        if (this.rigidbody.velocity[1] < 0) {
            this.isFalling = true;
            this.isJumping = false;
            return true;
        }
    
        if (this.rigidbody.velocity[1] >= 0 ) {
            this.isJumping = true;
            this.isFalling = false;
            return true;
        }
    
        return false;
    }

    public disablePlayerCollider() {
        this.collider.isEnable = false;   
    }

    public enablePlayerCollider() {
        this.collider.isEnable = true;   
    }

    // public disablePlatformCollider() {
        

    //     this.physicsManager.queryColliders((collider : Collider) =>{
    //         if (collider.gameObject.getComponent<Platform>) {
    //             return true;
    //         }
    //         return false;
    //     }).forEach((collider) => {
    //         this.physicsManager.ignoreCollisions(this.gameObject.getComponent<Collider>(Collider)!, collider);
    //     });

    //     //console.log("disable collider");
    // }

    // public enablePlatformCollider() {
        

    //     this.physicsManager.queryColliders((collider : Collider) =>{
    //         if (collider.gameObject.getComponent<Platform>) {
    //             return true;
    //         }
    //         return false;
        
    //     }).forEach((collider) => {
    //         this.physicsManager.unignoreCollisions(this.gameObject.getComponent<Collider>(Collider)!, collider);
    //     });

    //     //console.log("enable collider");
    // }

    // public disablePlatformAndItemCollider() {

    //     this.physicsManager.queryColliders((collider : Collider) =>{
    //         if (collider.gameObject.getComponent<Platform>(Platform) || collider.gameObject.getComponent<PlatformItem>(PlatformItem)) {
    //             return true;
    //         }
    //         return false;
        
    //     }).forEach((collider) => {
    //         this.physicsManager.ignoreCollisions(this.gameObject.getComponent<Collider>(Collider)!, collider);
    //     });

    //     //console.log("disable collider");
    // }

    // public enablePlatformAndItemCollider() {

    //     this.physicsManager.queryColliders((collider : Collider) =>{
    //         if (collider.gameObject.getComponent<Platform>(Platform) || collider.gameObject.getComponent<PlatformItem>(PlatformItem)) {
    //             return true;
    //         }
    //         return false;
        
    //     }).forEach((collider) => {
    //         this.physicsManager.unignoreCollisions(this.gameObject.getComponent<Collider>(Collider)!, collider);
    //     });

    //     //console.log("enable collider");
    // }


    public setEnable(value: boolean) {
        this.isEnable = value;
    }
    
    
    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    
}


export default JumpPlatformIgnorance;