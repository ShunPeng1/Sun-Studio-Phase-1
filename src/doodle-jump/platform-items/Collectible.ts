import Component from "../../engine/components/Component"
import Transform from "../../engine/components/Transform";
import Collider from "../../engine/components/physics/Collider";
import GameObject from "../../engine/gameobjects/GameObject";
import Platform from "../platforms/Platform";
import PlayerEquipment from "../player/PlayerEquipment";
import PlatformItem from "./PlatformItem";

abstract class Collectible extends PlatformItem {
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

    protected abstract onCollect(player : PlayerEquipment): void;

    protected collect(other : Collider): void{
        let player = other.gameObject.getComponent<PlayerEquipment>(PlayerEquipment);
        if (player) {
            this.onCollect(player);
            this.gameObject.destroy();
        }
    }


}


export default Collectible;