import { vec2, vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import GameObject from "../../engine/gameobjects/GameObject";
import InputManager from "../../engine/inputs/InputManager";

class PlayerTrunk extends Component{
    
    private playerTrunk : GameObject;
    private bulletOffset : vec3;
    private bulletPrefab : GameObject;
    private bulletVelocity : number;

    private shootAngle : number = 0;
    private originalPosition : vec3 ;
    private trunkZOffset : number = 0.1;

    private currentTrunkShowTime : number = 0;
    private trunkShowDuration : number;

    constructor(playerTrunk : GameObject, bulletPrefab : GameObject, bulletOffset : vec3, bulletVelocity : number, trunkShowDuration : number, trunkZOffset : number = 0.1){
        super();
    
        this.playerTrunk = playerTrunk;
        
        this.bulletOffset = bulletOffset;
        this.bulletPrefab = bulletPrefab;
        this.bulletVelocity = bulletVelocity;
        this.trunkZOffset = trunkZOffset;
        
        this.trunkShowDuration = trunkShowDuration;

        this.originalPosition = vec3.clone(this.playerTrunk.transform.position);

    }

    public awake(): void {
    
        this.playerTrunk.setEnable(false);

        this.bulletPrefab.setScene(this.gameObject.getScene()!);
    }

    public update(time: number, deltaTime: number): void {
        if ( this.playerTrunk.getEnable() ){
            this.currentTrunkShowTime += deltaTime;
            
            this.updateTrunkPosition();

            if(this.currentTrunkShowTime >= this.trunkShowDuration){
                this.playerTrunk.setEnable(false);
                this.currentTrunkShowTime = 0;
            }
        }

    }

    public shoot(angle : number = Math.PI/2) {
    
        this.shootAngle = angle;
        this.currentTrunkShowTime = 0;

        const bullet = this.bulletPrefab.clone();
        vec3.add(bullet.transform.position, this.playerTrunk.transform.getWorldPosition(), this.bulletOffset); 
        bullet.transform.rotation[2] = -angle + Math.PI;
        
        
        this.playerTrunk.setEnable(true);
        this.playerTrunk.transform.setWorldRotation(0, 0,-angle + Math.PI/2);
        //this.playerTrunk.transform.rotation[2] =  -angle + Math.PI/2 ;
        
        this.updateTrunkPosition();
        
    }

    private updateTrunkPosition(){
        let frontOrBack = this.gameObject.transform.rotation[1] == 0 ? 1 : -1;
        this.playerTrunk.transform.position[2] = this.trunkZOffset * frontOrBack;

        
        this.playerTrunk.transform.setWorldRotation(0, 0,-this.shootAngle + Math.PI/2);

        
        this.playerTrunk.transform.position[0] = -Math.cos(this.shootAngle) * 0.75 * frontOrBack;
        this.playerTrunk.transform.position[1] = this.originalPosition[1] - Math.abs(Math.cos(this.shootAngle)) * 0.45;

    
    }

    public getIsShooting(): boolean {
        return this.playerTrunk.getEnable();
    }

    public clone(): Component {
        return new PlayerTrunk(this.playerTrunk, this.bulletPrefab, this.bulletOffset, this.bulletVelocity, this.trunkShowDuration, this.trunkZOffset);
    }

}

export default PlayerTrunk;