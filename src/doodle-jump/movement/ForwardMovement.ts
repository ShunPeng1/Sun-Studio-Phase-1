import Component from "../../engine/components/Component";

class ForwardMovement extends Component {
    private speed: number = 0.1;

    constructor(speed : number) {
        super();
    
        this.speed = speed;
    }
    
    public update(time: number, deltaTime: number): void {
        const rotation = this.gameObject.transform.rotation[2]; 
        this.gameObject.transform.position[0] += this.speed * Math.cos(rotation) * deltaTime;
        this.gameObject.transform.position[1] += this.speed * Math.sin(rotation) * deltaTime;
    }

    public clone(): Component {
        return new ForwardMovement(this.speed);
    }
}


export default ForwardMovement;

