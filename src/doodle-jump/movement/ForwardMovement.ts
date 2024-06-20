import Component from "../../engine/components/Component";

class ForwardMovement extends Component {
    private speed: number = 0.1;

    constructor(speed : number) {
        super();
    
        this.speed = speed;
    }
    
    public update(time: number, deltaTime: number): void {
        const speed = 0.1;
        const rotation = this.gameObject.transform.rotation[2]; 
        this.gameObject.transform.position[0] += speed * Math.cos(rotation);
        this.gameObject.transform.position[1] += speed * Math.sin(rotation);
    }

    public clone(): Component {
        return new ForwardMovement(this.speed);
    }
}


export default ForwardMovement;

