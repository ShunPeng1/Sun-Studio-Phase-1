import Component from "../engine/components/Component";
import Transform from "../engine/components/Transform";
import InputManager from "../inputs/InputManager";

class Movement extends Component {
    private speed: number;
    
    
    constructor(speed : number) {
        super();
        this.speed = speed;
    }


    update(time: number, deltaTime : number) {
        this.gameObject.transform.position[0] += this.speed * deltaTime;
        
        console.log(this.gameObject.name, this.gameObject.transform.position[0]);
    }

    public clone(): Component {
        return new Movement(this.speed);
    }
    
}

export default Movement;