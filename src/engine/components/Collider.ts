import { EventEmitter } from 'events';

import Component from "./Component";
import PhysicManager from '../physics/PhysicManager';
import Transform from './Transform';

let idCounter = 0;

class Collider extends Component{
    public onCollisionEnter: EventEmitter = new EventEmitter();
    public onCollisionStay: EventEmitter = new EventEmitter();
    public onCollisionExit: EventEmitter = new EventEmitter();
    public id: number;
    
    constructor(){
        super();
        this.id = idCounter++;
    }
    
    
    public awake(): void {
        PhysicManager.getInstance().addCollider(this);
    }
    
    public collidesWith(other: Collider) : boolean {
        return false;
    }
    

    public clone(): Component {
        // Add your implementation here
        return new Collider();
    }

}

export default Collider;