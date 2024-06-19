import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Transform from "../../engine/components/Transform";
import Rigidbody from "../../engine/components/physics/Rigidbody";
import GameObject from "../../engine/gameobjects/GameObject";
import JumpPlatformIgnorance from "./JumpPlatformIgnorance";

class Player extends Component{
    
    private headTransform : GameObject;
    private backTransform : GameObject;
    
    private isEquipping : boolean = false;
    private rigidbody : Rigidbody;
    private jumpPlatformIgnorance : JumpPlatformIgnorance ;

    private maxUpVelocity : number = 10;
    private upForce : number = 10;
    private duration : number = 0;
    
    constructor(headTransform : GameObject, backTransform : GameObject) {
        super();
        this.headTransform = headTransform;
        this.backTransform = backTransform;
    }

    public awake(): void {
        this.rigidbody = this.gameObject.getComponent<Rigidbody>(Rigidbody)!;
        this.jumpPlatformIgnorance = this.gameObject.getComponent<JumpPlatformIgnorance>(JumpPlatformIgnorance)!;
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
            }            

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

        
        this.jumpPlatformIgnorance.disablePlayerCollider();
        this.jumpPlatformIgnorance.setEnable(false);
    }


    public clone(): Component {
        return new Player(this.headTransform, this.backTransform);    
    }
}


export default Player;