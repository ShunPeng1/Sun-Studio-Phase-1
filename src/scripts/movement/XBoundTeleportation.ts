import Component from "../../engine/components/Component";
import GameObject from "../../engine/scenes/GameObject";

class XBoundTeleportation extends Component{
    private xOffset : number;
    private xWidth : number;
    private teleportGameObject : GameObject;

    constructor(teleportGameObject : GameObject, xOffset : number, xWidth : number ){
        super();
        this.teleportGameObject = teleportGameObject;
        this.xOffset = xOffset;
        this.xWidth = xWidth;
    }

    public update(time: number, deltaTime: number): void {
        if(this.teleportGameObject.transform.position[0] > this.transform.position[0] + this.xOffset + this.xWidth){
            this.teleportGameObject.transform.position[0] = this.transform.position[0] + this.xOffset - this.xWidth
        }
        else if(this.teleportGameObject.transform.position[0] < this.transform.position[0] + this.xOffset - this.xWidth){
            this.teleportGameObject.transform.position[0] = this.transform.position[0] + this.xOffset + this.xWidth
        }
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }

}

export default XBoundTeleportation;