import { vec2 } from "gl-matrix";
import Component from "../../engine/components/Component";
import PlatformSpawnInfo from "./PlatformSpawnInfo";


class PlatformSpawner extends Component{
    private platformSpawnInfos : PlatformSpawnInfo[];
    private accumulateY : number;
    private accumulateNonBreakableY : number;
    private preemptiveSpawnHeight : number;
    private varianceX : vec2;
    private varianceY : vec2;

    private totalChanceCount : number = 0;
    private totalNonBreakableChanceCount : number = 0;
    private canSpawnBreakable : boolean = true;
    constructor(platformSpawnInfos : PlatformSpawnInfo[], preemptiveSpawnHeight : number, varianceX : vec2, varianceY : vec2) {
        super();

        this.preemptiveSpawnHeight = preemptiveSpawnHeight;
        this.varianceX = varianceX;
        this.varianceY = varianceY;

        this.platformSpawnInfos = platformSpawnInfos;

        this.platformSpawnInfos.forEach(element => {
            this.totalChanceCount += element.spawnChance;
        
            if (!element.isBreakable){
                this.totalNonBreakableChanceCount += element.spawnChance;
            }
        });
        
    }

    public awake(): void {
        this.accumulateY = this.transform.position[1];
        this.accumulateNonBreakableY = this.transform.position[1];
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

    private getRandomNonBreakablePlatformSpawnInfo() : PlatformSpawnInfo {
        let random = Math.random() * this.totalNonBreakableChanceCount;

        let index = 0;
        let accumulatedChance = 0;
        for (let i = 0; i < this.platformSpawnInfos.length; i++) {
            if (!this.platformSpawnInfos[i].isBreakable){
                accumulatedChance += this.platformSpawnInfos[i].spawnChance;
                if (random <= accumulatedChance) {
                    index = i;
                    break;
                }
            }
        }

        return this.platformSpawnInfos[index];
    }

    private spawnPlatform() {
        let platformSpawnInfo : PlatformSpawnInfo 

        if (this.canSpawnBreakable){
            platformSpawnInfo = this.getRandomPlatformSpawnInfo();
        }
        else{
            platformSpawnInfo = this.getRandomNonBreakablePlatformSpawnInfo();
        }
        
        let platform = platformSpawnInfo.clonePlatform(this.gameObject.getScene());
        
        platform.transform.position[0] = Math.random() * (this.varianceX[1] - this.varianceX[0]) + this.varianceX[0];
        platform.transform.position[1] = this.accumulateY + Math.random() * ((this.accumulateNonBreakableY - this.accumulateY + this.varianceY[1] ) - this.varianceY[0]) + this.varianceY[0];
    
        if (platformSpawnInfo.isBreakable){

            this.accumulateY = platform.transform.position[1];
        
        }
        else{
            this.accumulateY = platform.transform.position[1];    
            this.accumulateNonBreakableY = this.accumulateY;
        }

        
        if (this.accumulateNonBreakableY - this.accumulateY + this.varianceY[1] > this.varianceY[0] * 2){
            this.canSpawnBreakable = true;
        }
        else{
            this.canSpawnBreakable = false;
        }

    }


    public clone(): Component {
        throw new Error("Method not implemented.");
    }


}

export default PlatformSpawner;