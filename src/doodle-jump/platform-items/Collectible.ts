import Component from "../../engine/components/Component"
import Transform from "../../engine/components/Transform";
import Collider from "../../engine/components/physics/Collider";
import GameObject from "../../engine/gameobjects/GameObject";
import Platform from "../platforms/Platform";
import Player from "../player/Player";
import PlatformItem from "./PlatformItem";

abstract class Collectible extends Component implements PlatformItem {
    platform: Platform;
    
    protected collider : Collider;

    
    public awake(): void {
        super.awake();
        this.collider = this.gameObject.getComponent<Collider>(Collider)!;

        this.collect = this.collect.bind(this);
    }

    public setPlatform(platform: Platform): void {
        this.platform = platform;
        this.gameObject.transform.setParent(platform.gameObject.transform);
    }
    

    public start(): void {
        this.collider.subcribeToCollisionEnter(this.collect);

    }

    public destroy(): void {
        this.collider.unsubcribeToCollisionEnter(this.collect);
    }

    protected abstract onCollect(player : Player): void;

    protected collect(other : Collider): void{
        let player = other.gameObject.getComponent<Player>(Player);
        if (player) {
            this.onCollect(player);
        }
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }

}


export default Collectible;