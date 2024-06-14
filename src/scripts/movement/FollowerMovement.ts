import Component from "../../engine/components/Component";
import GameObject from "../../engine/gameobjects/GameObject";

class MaxFollowerMovement extends Component{
    private gameObjectFollowing: GameObject;
    private isFollowX: boolean;
    private isFollowY: boolean;
    private isFollowZ: boolean;

    constructor(gameObjectFollowing: GameObject, isFollowX: boolean = true, isFollowY: boolean = true, isFollowZ: boolean = true){
        super();
        this.gameObjectFollowing = gameObjectFollowing;
        this.isFollowX = isFollowX;
        this.isFollowY = isFollowY;
        this.isFollowZ = isFollowZ;
    
    }

    public update(time: number, deltaTime: number): void {

        if (this.isFollowX) {
            if (this.gameObjectFollowing.transform.position[0] > this.gameObject.transform.position[0]) {
                this.gameObject.transform.position[0] = this.gameObjectFollowing.transform.position[0];
            }
            
        }
        if (this.isFollowY) {
            if (this.gameObjectFollowing.transform.position[1] > this.gameObject.transform.position[1]) {
                this.gameObject.transform.position[1] = this.gameObjectFollowing.transform.position[1];
            }
        }
        if (this.isFollowZ) {
            if (this.gameObjectFollowing.transform.position[2] > this.gameObject.transform.position[2]) {
                this.gameObject.transform.position[2] = this.gameObjectFollowing.transform.position[2];
            }
        }

        
    }
    
    
    public clone(): Component {
        throw new Error("Method not implemented.");
    }

}

export default MaxFollowerMovement;