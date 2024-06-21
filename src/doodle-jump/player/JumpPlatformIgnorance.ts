import Collider from "../../engine/components/physics/Collider";
import Component from "../../engine/components/Component";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import PhysicManager from "../../engine/physics/PhysicManager";
import Platform from "../platforms/Platform";
import PlatformItem from "../platform-items/PlatformItem";
import DoodleJumpSceneCollection from "../scenes/DoodleJumpSceneCollection";

class JumpPlatformIgnorance extends Component{
    
    
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
     
        
        this.enablePlayerToItemLayer();
        this.enablePlayerToMonsterLayer();
        this.enablePlayerToPlatformLayer();
    }

    public fixedUpdate(time: number, deltaTime: number): void {
        if (!this.isEnable) {
            return;
        }

        if (this.checkDirection()) {
            if (this.isFalling) {
                this.enablePlayerToPlatformLayer();
            }
    
            if (this.isJumping) {
                this.disablePlayerToPlatformLayer();
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

    public disablePlayerToPlatformLayer() {
        this.physicsManager.unsetLayerInteraction(DoodleJumpSceneCollection.PLAYER_LAYER, DoodleJumpSceneCollection.PLATFORM_LAYER);

    }

    public enablePlayerToPlatformLayer() {
        this.physicsManager.setLayerInteraction(DoodleJumpSceneCollection.PLAYER_LAYER, DoodleJumpSceneCollection.PLATFORM_LAYER);
    }

    public disablePlayerToItemLayer() {
        this.physicsManager.unsetLayerInteraction(DoodleJumpSceneCollection.PLAYER_LAYER, DoodleJumpSceneCollection.ITEM_LAYER);
    }

    public enablePlayerToItemLayer() {
        this.physicsManager.setLayerInteraction(DoodleJumpSceneCollection.PLAYER_LAYER, DoodleJumpSceneCollection.ITEM_LAYER);
    }

    public disablePlayerToMonsterLayer() {
        this.physicsManager.unsetLayerInteraction(DoodleJumpSceneCollection.PLAYER_LAYER, DoodleJumpSceneCollection.MONSTER_LAYER);    
    }

    public enablePlayerToMonsterLayer() {
        this.physicsManager.setLayerInteraction(DoodleJumpSceneCollection.PLAYER_LAYER, DoodleJumpSceneCollection.MONSTER_LAYER);
    }

    public setEnable(value: boolean) {
        this.isEnable = value;
    }
    
    
    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    
}


export default JumpPlatformIgnorance;