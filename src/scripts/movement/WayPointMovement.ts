import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import Transform from "../../engine/components/Transform";

class WayPointMovement extends Component {
    private wayPoints: Transform[] = [];
    private currentWayPoint: Transform;
    private nextWayPoint: Transform;
    private currentIndex: number;
    private speed: number;
    private isLoopingNorReverse: boolean;
    private currentTime: number = 0;
    constructor(speed: number, isLoopingNorReverse: boolean) {
        super();
    
        this.speed = speed;
        this.isLoopingNorReverse = isLoopingNorReverse;
    }

    public start() {
        if (this.wayPoints.length === 0){
            console.error("WayPointMovement: No WayPoints added");
            return;
        }

        this.currentWayPoint = this.wayPoints[0];
        this.currentIndex = 0;
        this.nextWayPoint = this.getNextWayPoint();
    }


    public update(time: number, deltaTime: number) {

        if (this.wayPoints.length === 0){
            return;
        }
        
        let t = this.speed * deltaTime;
        this.currentTime += t;
        if (this.currentTime >= 1) {
            this.currentWayPoint = this.nextWayPoint;
            this.nextWayPoint = this.getNextWayPoint();
            this.currentTime = 0;

            vec3.copy(this.transform.position, this.currentWayPoint.position);
        }
        else{
            vec3.lerp(this.transform.position, this.currentWayPoint.position, this.nextWayPoint.position, this.currentTime);
        }

       
    }
    
    private getNextWayPoint(): Transform {
        
        if (this.isLoopingNorReverse){

            let nextIndex = (this.currentIndex + 1) % this.wayPoints.length;
            this.currentIndex = nextIndex;
            return this.wayPoints[nextIndex];
        }
        else{
            let nextIndex : number;
            if (this.currentIndex === this.wayPoints.length - 1){
                this.wayPoints.reverse();
                nextIndex = 1;
            }
            else{
                nextIndex = (this.currentIndex + 1) % this.wayPoints.length;
                
            }
            this.currentIndex = nextIndex;
            return this.wayPoints[nextIndex];
        }
    }

    public addWayPoint(wayPoint: Transform) {
        this.wayPoints.push(wayPoint);
    }

    public clone(): Component {
        return new WayPointMovement(this.speed, this.isLoopingNorReverse);
    }

}

export default WayPointMovement;

