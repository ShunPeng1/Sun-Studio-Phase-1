import Component from "../../engine/components/Component";

class TimeoutSelfDestruction extends Component{
    
    private lifeTime : number;
    constructor(lifeTime : number){
        super();

        this.lifeTime = lifeTime;

    }


    public update(time: number, deltaTime: number): void {
        this.lifeTime -= deltaTime;
        if(this.lifeTime <= 0){
            this.gameObject.destroy();
        }
    
    }

    public clone(): Component {
        return new TimeoutSelfDestruction(this.lifeTime);
    }

}

export default TimeoutSelfDestruction;