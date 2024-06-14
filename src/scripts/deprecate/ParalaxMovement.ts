import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import GameObject from "../../engine/scenes/GameObject";

class ParalaxMovement extends Component{
    private gameObject1: GameObject;
    private gameObject2: GameObject;
    private speed: vec3;

    private maxDistance: number;
    private distanceTravelled: number = 0;
    private defaultPosition: vec3;

    constructor(gameObject1: GameObject, gameObject2: GameObject, speed: vec3, maxDistance: number, defaultPosition : vec3 = [0,0,0]){
        super();
        this.gameObject1 = gameObject1;
        this.gameObject2 = gameObject2;
        this.speed = speed;
        this.maxDistance = maxDistance;
        this.defaultPosition = defaultPosition;
    }
    
    public update(time: number, deltaTime: number){
        let deltaPosition = vec3.create();
        vec3.scale(deltaPosition, this.speed, deltaTime);
        vec3.add(this.gameObject1.transform.position, this.gameObject1.transform.position, deltaPosition);
        vec3.add(this.gameObject2.transform.position, this.gameObject2.transform.position, deltaPosition);

        this.distanceTravelled += Math.abs(vec3.length(deltaPosition));

        if (this.distanceTravelled >= this.maxDistance){

            this.distanceTravelled = 0;

            // Reset the position of gameObject1
            vec3.copy(this.gameObject1.transform.position, this.defaultPosition);

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