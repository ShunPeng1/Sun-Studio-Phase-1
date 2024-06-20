import { vec2, vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import GameObject from "../../engine/gameobjects/GameObject";
import InputManager from "../../engine/inputs/InputManager";

class PlayerTrunk extends Component{
    private playerTrunk : GameObject;
    private bulletOffset : vec3;
    private bulletPrefab : GameObject;
    private bulletVelocity : number;

    private originalPosition : vec3 ;

    constructor(playerTrunk : GameObject, bulletPrefab : GameObject, bulletOffset : vec3, bulletVelocity : number){
        super();
    
        this.playerTrunk = playerTrunk;
        
        this.bulletOffset = bulletOffset;
        this.bulletPrefab = bulletPrefab;
        this.bulletVelocity = bulletVelocity;

        this.originalPosition = vec3.clone(this.playerTrunk.transform.position);
    }

    public awake(): void {
    
        this.playerTrunk.setEnable(false);

        this.bulletPrefab.setScene(this.gameObject.getScene()!);
    }



    public shoot(angle : number = Math.PI/2) {
    
        const bullet = this.bulletPrefab.clone();
        
        vec3.scaleAndAdd(bullet.transform.position, this.playerTrunk.transform.position, this.bulletOffset, 1);
        
        this.playerTrunk.setEnable(true);
        this.playerTrunk.transform.rotation[2] = -angle + Math.PI/2 ;
        
        this.playerTrunk.transform.position[0] = -Math.cos(angle) * 0.75 ;
        this.playerTrunk.transform.position[1] = this.originalPosition[1] - Math.abs(Math.cos(angle)) * 0.45;

        console.log(Math.cos(angle),  Math.cos(Math.PI /2 - angle));
        // Randomize the angle
        
        bullet.transform.rotation[1] = angle;
    }

    public clone(): Component {
        return new PlayerTrunk(this.playerTrunk, this.bulletPrefab, this.bulletOffset, this.bulletVelocity);
    }

}

export default PlayerTrunk;