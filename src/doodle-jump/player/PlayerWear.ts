import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Transform from "../../engine/components/Transform";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import GameObject from "../../engine/gameobjects/GameObject";
import JumpPlatformIgnorance from "./JumpPlatformIgnorance";

class Player extends Component{
    
    private headWearable : GameObject;
    private backWearable : GameObject;
    
    private isEquipping : boolean = false;
    private rigidbody : Rigidbody;
    private jumpPlatformIgnorance : JumpPlatformIgnorance ;

    private maxUpVelocity : number = 10;
    private upForce : number = 10;
    private duration : number = 0;

    private zOffset : number = 0;
    
    constructor(headWearable : GameObject, backWearable : GameObject, zOffset : number = 0.1) {
        super();
        this.headWearable = headWearable;
        this.backWearable = backWearable;

        this.zOffset = zOffset;
    }

    public awake(): void {
        this.rigidbody = this.gameObject.getComponent<Rigidbody>(Rigidbody)!;
        this.jumpPlatformIgnorance = this.gameObject.getComponent<JumpPlatformIgnorance>(JumpPlatformIgnorance)!;

        this.headWearable.setEnable(false);
        this.backWearable.setEnable(false);
    }


    public update(time: number, deltaTime: number): void {
        if (this.isEquipping) {

            this.rigidbody.addForce([0,this.upForce,0]); // Add the force to the rigidbody

            // Cap the velocity
            const velocity = this.rigidbody.velocity;
            const speed = vec3.length(velocity);
            if (speed > this.maxUpVelocity) {
                vec3.set(this.rigidbody.velocity, 0, this.maxUpVelocity, 0); // Cap the velocity
            }

            // Decrease the duration
            this.duration -= deltaTime;
            if (this.duration <= 0) {
                this.isEquipping = false;
                
                this.jumpPlatformIgnorance.enablePlayerCollider();
                this.jumpPlatformIgnorance.setEnable(true);

                this.headWearable.setEnable(false);
                this.backWearable.setEnable(false);
            }            


            // Update the rotation of wearables
            //console.log( "Wearable rotation: ", this.gameObject.transform.rotation[1], this.headWearable.transform.rotation[1], this.backWearable.transform.rotation[1])
            let frontOrBack = this.gameObject.transform.rotation[1] == 0 ? 1 : -1;
            this.headWearable.transform.position[2] = this.zOffset * frontOrBack;
            this.backWearable.transform.position[2] = this.zOffset * frontOrBack;

        }

    
    }


    public equipJetpack(maxVelocity : number, duration : number, force : number) {
        if (this.isEquipping) {
            return;
        }

        this.maxUpVelocity = maxVelocity;
        this.duration = duration;
        this.upForce = force;
        this.isEquipping = true;
        
        this.backWearable.setEnable(true);
        this.jumpPlatformIgnorance.disablePlayerCollider();
        this.jumpPlatformIgnorance.setEnable(false);
    }    


    public equipHat(maxVelocity : number, duration : number, force : number) {
        if (this.isEquipping) {
            return;
        }

        this.maxUpVelocity = maxVelocity;
        this.duration = duration;
        this.upForce = force;
        this.isEquipping = true;

        this.headWearable.setEnable(true);
        this.jumpPlatformIgnorance.disablePlayerCollider();
        this.jumpPlatformIgnorance.setEnable(false);
    }


    public clone(): Component {
        return new Player(this.headWearable, this.backWearable);    
    }
}


export default Player;