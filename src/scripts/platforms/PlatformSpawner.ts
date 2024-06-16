import { vec2 } from "gl-matrix";
import Component from "../../engine/components/Component";
import PlatformSpawnInfo from "./PlatformSpawnInfo";


class PlatformSpawner extends Component{
    private platformSpawnInfos : PlatformSpawnInfo[];
    private accumulateY : number;
    private preemptiveSpawnHeight : number;
    private varianceX : vec2;
    private varianceY : vec2;

    private accumulateBreakableLowerY : number = 0;

    private totalChanceCount : number = 0;
    constructor(platformSpawnInfos : PlatformSpawnInfo[], preemptiveSpawnHeight : number, varianceX : vec2, varianceY : vec2) {
        super();

        this.preemptiveSpawnHeight = preemptiveSpawnHeight;
        this.varianceX = varianceX;
        this.varianceY = varianceY;

        this.platformSpawnInfos = platformSpawnInfos;

        this.platformSpawnInfos.forEach(element => {
            this.totalChanceCount += element.spawnChance;
        });
    }

    public awake(): void {
        this.accumulateY = this.transform.position[1];
    }

    public update(time: number, deltaTime: number): void {
        if (this.accumulateY - this.transform.position[1] <= this.preemptiveSpawnHeight ) {
            this.spawnPlatform();
        }
        
    }

    private getRandomPlatformSpawnInfo() : PlatformSpawnInfo {
        let random = Math.random() * this.totalChanceCount;

        let index = 0;
        let accumulatedChance = 0;
        for (let i = 0; i < this.platformSpawnInfos.length; i++) {
            accumulatedChance += this.platformSpawnInfos[i].spawnChance;
            if (random <= accumulatedChance) {
                index = i;
                break;
            }
        }

        return this.platformSpawnInfos[index];
    }

    private spawnPlatform() {
        let platformSpawnInfo : PlatformSpawnInfo = this.getRandomPlatformSpawnInfo();
        let platform = platformSpawnInfo.clonePlatform();
        platform.setScene(this.gameObject.getScene()!)
        
        platform.transform.position[0] = Math.random() * (this.varianceX[1] - this.varianceX[0]) + this.varianceX[0];
        platform.transform.position[1] = this.accumulateY + Math.random() * (this.varianceY[1] - this.varianceY[0]) + this.varianceY[0];
    
        if (!platformSpawnInfo.isBreakable){
            this.accumulateY = platform.transform.position[1];   
            //this.accumulateBreakableLowerY = 0;
        }
        else{
            
        }


    }


    public clone(): Component {
        throw new Error("Method not implemented.");
    }


}

export default PlatformSpawner;