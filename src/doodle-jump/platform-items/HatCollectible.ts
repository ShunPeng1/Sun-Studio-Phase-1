import PlayerEquipment from "../player/PlayerEquipment";
import Collectible from "./Collectible";

class HatCollectible extends Collectible {
    private maxVelocity: number;
    private duration: number;
    private force: number;

    constructor(maxVelocity : number, duration : number, force : number) {
        super();
    
        this.maxVelocity = maxVelocity;
        this.duration = duration;
        this.force = force;
    }


    public onCollect(player : PlayerEquipment): void {
        player.equipHat(this.maxVelocity, this.duration, this.force);

    }

    public clone(): HatCollectible {
        return new HatCollectible(this.maxVelocity, this.duration, this.force);
    }

}

export default HatCollectible;