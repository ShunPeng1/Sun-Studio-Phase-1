import { vec2, vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import PlatformSpawnInfo from "./PlatformSpawnInfo";
import PlatformItemSpawnInfo from "../platform-items/PlatformItemSpawnInfo";


class PlatformSpawner extends Component{
    private platformSpawnInfos : PlatformSpawnInfo[];
    private accumulateY : number;
    private accumulateNonBreakableY : number;
    private preemptiveSpawnHeight : number;
    private varianceX : vec2;
    private varianceY : vec2;

    private platformItemSpawnInfos : PlatformItemSpawnInfo[];
    private baseNoItemChance : number;


    private totalPlatformChanceCount : number = 0;
    private totalNonBreakableChanceCount : number = 0;
    private canSpawnBreakable : boolean = true;

    private totalItemChanceCount : number = 0;
    
    
    constructor(platformSpawnInfos : PlatformSpawnInfo[], preemptiveSpawnHeight : number, varianceX : vec2, varianceY : vec2, platformItemSpawnInfos : PlatformItemSpawnInfo[], baseNoItemChance : number) {
        super();

        this.preemptiveSpawnHeight = preemptiveSpawnHeight;
        this.varianceX = varianceX;
        this.varianceY = varianceY;

        this.platformSpawnInfos = platformSpawnInfos;
        this.platformItemSpawnInfos = platformItemSpawnInfos;

        this.baseNoItemChance = baseNoItemChance;

        this.platformSpawnInfos.forEach(element => {
            this.totalPlatformChanceCount += element.spawnChance;
        
            if (!element.isBreakable){
                this.totalNonBreakableChanceCount += element.spawnChance;
            }
        });


        this.platformItemSpawnInfos.forEach(element => {
            this.totalItemChanceCount += element.spawnChance;
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
        let random = Math.random() * this.totalPlatformChanceCount;

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

    private getRandomItemSpawnInfo() : PlatformItemSpawnInfo | null{
        let random = Math.random() * (this.totalItemChanceCount + this.baseNoItemChance);

        if (random < this.baseNoItemChance) {
            return null;
        }
    
        let index = 0;
        let accumulatedChance = this.baseNoItemChance;
        for (let i = 0; i < this.platformItemSpawnInfos.length; i++) {
            accumulatedChance += this.platformItemSpawnInfos[i].spawnChance;
            if (random <= accumulatedChance) {
                index = i;
                break;
            }
        }
    
        return this.platformItemSpawnInfos[index];
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
        platform.transform.position[2] = 0;
        if (platformSpawnInfo.isBreakable){

            this.accumulateY = platform.transform.position[1];
        
        }
        else{
            this.accumulateY = platform.transform.position[1];    
            this.accumulateNonBreakableY = this.accumulateY;
        }

        if (platformSpawnInfo.haveItem){

            let itemInfo = this.getRandomItemSpawnInfo();

            if (itemInfo != null){
                let platformItem = itemInfo.clonePlatformItem(this.gameObject.getScene());
                //platformItem.transform.position[0] = platform.transform.position[0] + Math.random() * (itemInfo.varianceX[1] - itemInfo.varianceX[0]) + itemInfo.varianceX[0];
                //platformItem.transform.position[1] = platform.transform.position[1] + itemInfo.offsetY;
                
                platformItem.gameObject.transform.setParent(platform.transform);
                //vec3.set(platformItem.transform.position,  platform.transform.position[0] + Math.random() * (itemInfo.varianceX[1] - itemInfo.varianceX[0]) + itemInfo.varianceX[0], platform.transform.position[1] + itemInfo.offsetY, 2)
                vec3.set(platformItem.transform.position,  Math.random() * (itemInfo.varianceX[1] - itemInfo.varianceX[0]) + itemInfo.varianceX[0], itemInfo.offsetY, 2)
                
                vec3.set(platformItem.transform.scale, platformItem.transform.scale[0]/ platform.transform.scale[0] ,platformItem.transform.scale[1]/ platform.transform.scale[1], 0.01);
                
            }
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