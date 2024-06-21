import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import PlayerEquipment from "./PlayerEquipment";

class Player extends Component {
    private deathSubscribers: Array<() => void> = [];
    private stunSubscribers: Array<(duration: number) => void> = [];



    constructor() {
        super();
    }

    public awake(): void {
    
    }
    
    
    public stun(duration: number) {
        this.notifyStunSubscribers(duration);
    }

    public die(){
        this.notifyDeathSubscribers();
    }

    
    public subscribeDeath(callback: () => void): void {
        this.deathSubscribers.push(callback);
    }

    public unsubscribeDeath(callback: () => void): void {
        const index = this.deathSubscribers.indexOf(callback);
        if (index !== -1) {
            this.deathSubscribers.splice(index, 1);
        }
    }

    private notifyDeathSubscribers(): void {
        for (const callback of this.deathSubscribers) {
            callback();
        }
    }

    public subscribeStun(callback: (duration: number) => void): void {
        this.stunSubscribers.push(callback);
    }

    public unsubscribeStun(callback: (duration: number) => void): void {
        const index = this.stunSubscribers.indexOf(callback);
        if (index !== -1) {
            this.stunSubscribers.splice(index, 1);
        }
    }

    private notifyStunSubscribers(duration: number): void {
        for (const callback of this.stunSubscribers) {
            callback(duration);
        }
    }
    
    
    
    public clone(): Component {
        return new Player();
    }

}


export default Player;