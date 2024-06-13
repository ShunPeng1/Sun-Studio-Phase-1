import Component from "../engine/components/Component";
import GameObject from "../engine/scenes/GameObject";

class ParalaxMovement extends Component{
    private gameObject1: GameObject;
    private gameObject2: GameObject;
    private speed: number;

    private maxDistance: number;
    private distanceTravelled: number = 0;
    private defaultPosition: number;

    constructor(gameObject1: GameObject, gameObject2: GameObject, speed: number, maxDistance: number, defaultPosition : number = 0){
        super();
        this.gameObject1 = gameObject1;
        this.gameObject2 = gameObject2;
        this.speed = speed;
        this.maxDistance = maxDistance;
        this.defaultPosition = defaultPosition;
    }
    
    public update(time: number, deltaTime: number){
        this.gameObject1.transform.position[0] += this.speed * deltaTime;
        this.gameObject2.transform.position[0] += this.speed * deltaTime;
        this.distanceTravelled += Math.abs(this.speed * deltaTime);

        if (this.distanceTravelled >= this.maxDistance){

            this.distanceTravelled = 0;

            this.gameObject2.transform.position[0] = this.defaultPosition;

            // Swap the positions of gameObject1 and gameObject2
            let tempPosition = this.gameObject1.transform.position[0];
            this.gameObject1.transform.position[0] = this.gameObject2.transform.position[0];
            this.gameObject2.transform.position[0] = tempPosition;


        
        }
            
    }

    public clone(): Component {
        return new ParalaxMovement(this.gameObject1, this.gameObject2, this.speed, this.maxDistance);
    }
    
}

export default ParalaxMovement;