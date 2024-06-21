import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Transform from "../../engine/components/Transform";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import GameObject from "../../engine/gameobjects/GameObject";
import JumpPlatformIgnorance from "./JumpPlatformIgnorance";
import PlayerTrunk from "./PlayerTrunk";
import Player from "./Player";

class PlayerEquipment extends Component{
    
    private isEquippingItem : boolean = false;
    private hatWearable : GameObject;
    private jetpackWearable : GameObject;
    private starWearable : GameObject;
    
    private rigidbody : Rigidbody;
    private jumpPlatformIgnorance : JumpPlatformIgnorance ;
    private playerTrunk : PlayerTrunk;
    private player : Player;

    private maxUpVelocity : number = 10;
    private upForce : number = 10;
    private duration : number = 0;

    private zOffset : number = 0;

    
    constructor(hatWearable : GameObject, jetpackWearable : GameObject, starWearable : GameObject, zOffset : number = 0.1) {
        super();
        this.hatWearable = hatWearable;
        this.jetpackWearable = jetpackWearable;
        this.starWearable = starWearable;

        this.zOffset = zOffset;
    }

    public awake(): void {
        this.rigidbody = this.gameObject.getComponent<Rigidbody>(Rigidbody)!;
        this.jumpPlatformIgnorance = this.gameObject.getComponent<JumpPlatformIgnorance>(JumpPlatformIgnorance)!;
        this.playerTrunk = this.gameObject.getComponent<PlayerTrunk>(PlayerTrunk)!;
        this.player = this.gameObject.getComponent<Player>(Player)!;

        this.hatWearable.setEnable(false);
        this.jetpackWearable.setEnable(false);
        this.starWearable.setEnable(false);
    }

    protected onEnable(): void {
        this.player.subscribeStun((duration: number) => {
            this.equipStar(duration);
        });
        
    }

    protected onDisable(): void {
        this.player.unsubscribeStun((duration: number) => {
            this.equipStar(duration);
        });
    }

    public update(time: number, deltaTime: number): void {
        if (this.isEquippingItem) {


            // Cap the velocity
            const velocity = this.rigidbody.velocity;
            const speed = Math.abs(velocity[1]);
            if (speed > this.maxUpVelocity) {
                vec3.set(this.rigidbody.velocity, velocity[0], this.maxUpVelocity, velocity[2]); // Cap the velocity
            }

            //console.log("Equipping item" , this.rigidbody.velocity, this.rigidbody.transform.position, this.rigidbody.acceleration, this.upForce, this.maxUpVelocity, this.duration);
            this.rigidbody.addForce([0,this.upForce,0]); // Add the force to the rigidbody


            // Decrease the duration
            this.duration -= deltaTime;
            if (this.duration <= 0) {
                this.isEquippingItem = false;
                
                this.jumpPlatformIgnorance.enablePlayerToPlatformLayer();
                this.jumpPlatformIgnorance.enablePlayerToItemLayer();
                this.jumpPlatformIgnorance.enablePlayerToMonsterLayer();
                
                this.jumpPlatformIgnorance.setEnable(true);
                this.playerTrunk.setCanShoot(true);

                this.hatWearable.setEnable(false);
                this.jetpackWearable.setEnable(false);
            }            


            // Update the rotation of wearables
            //console.log( "Wearable rotation: ", this.gameObject.transform.rotation[1], this.headWearable.transform.rotation[1], this.backWearable.transform.rotation[1])
            let frontOrBack = this.gameObject.transform.rotation[1] == 0 ? 1 : -1;
            this.hatWearable.transform.position[2] = this.zOffset * frontOrBack;
            this.jetpackWearable.transform.position[2] = this.zOffset * frontOrBack;

        }

    
    }


    private equipWearable(wearable: GameObject, maxVelocity: number, duration: number, force: number) {
        if (this.isEquippingItem) {
            return;
        }
    
        this.maxUpVelocity = maxVelocity;
        this.duration = duration;
        this.upForce = force;
        this.isEquippingItem = true;
    
        wearable.setEnable(true);
        this.jumpPlatformIgnorance.disablePlayerToPlatformLayer();
        this.jumpPlatformIgnorance.disablePlayerToItemLayer();
        this.jumpPlatformIgnorance.disablePlayerToMonsterLayer();
        this.jumpPlatformIgnorance.setEnable(false);
        this.playerTrunk.setCanShoot(false);
    }

    
    public equipJetpack(maxVelocity: number, duration: number, force: number) {
        this.equipWearable(this.jetpackWearable, maxVelocity, duration, force);
    }
    
    public equipHat(maxVelocity: number, duration: number, force: number) {
        this.equipWearable(this.hatWearable, maxVelocity, duration, force);
    }
    
    public equipStar(duration: number) {
        this.equipWearable(this.starWearable, Infinity, duration, 0);
    }
    
    public clone(): Component {
        return new PlayerEquipment(this.hatWearable, this.jetpackWearable, this.starWearable, this.zOffset);   
    }
}


export default PlayerEquipment;