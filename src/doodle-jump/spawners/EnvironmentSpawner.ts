import { vec2, vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import PlatformSpawnInfo from "./PlatformSpawnInfo";
import PlatformItemSpawnInfo from "./PlatformItemSpawnInfo";
import SpawnSet from "./SpawnSet";



class EnvironmentSpawner extends Component{
    
    private accumulateY : number;
    private accumulateNonBreakableY : number;
    private preemptiveSpawnHeight : number;
    


    private totalPlatformChanceCount : number = 0;
    private totalNonBreakableChanceCount : number = 0;
    private canSpawnBreakable : boolean = true;

    private totalItemChanceCount : number = 0;
    
    
    private spawnSets: SpawnSet[];
    private currentSet: SpawnSet;
    private setTimer: number;
    
    constructor(spawnSets: SpawnSet[], preemptiveSpawnHeight : number) {
        super();

        this.preemptiveSpawnHeight = preemptiveSpawnHeight;

        
        this.spawnSets = spawnSets;
        this.currentSet = this.getRandomSpawnSet();
        this.setTimer = this.currentSet.setDuration;

    
    }



    private getRandomSpawnSet(): SpawnSet {
        let totalChance = this.spawnSets.reduce((sum, set) => sum + set.setChance, 0);
        let random = Math.random() * totalChance;

        let accumulatedChance = 0;
        for (let set of this.spawnSets) {
            accumulatedChance += set.setChance;
            if (random <= accumulatedChance) {
                return set;
            }
        }

        // If no set is selected (due to floating point precision issues), return the last one
        return this.spawnSets[this.spawnSets.length - 1];
    }



    public awake(): void {
        this.accumulateY = this.transform.position[1];
        this.accumulateNonBreakableY = this.transform.position[1];
    }

    public update(time: number, deltaTime: number): void {
        this.updateSetTimer(deltaTime);

        if (this.accumulateY - this.transform.position[1] <= this.preemptiveSpawnHeight ) {
            this.spawnPlatform();
        }
        
    }

    
    private updateSetTimer(deltaTime: number): void {
        this.setTimer -= deltaTime;
        if (this.setTimer <= 0) {
            this.currentSet = this.getRandomSpawnSet();
            this.setTimer = this.currentSet.setDuration;
        }
    }

    private getRandomPlatformSpawnInfo() : PlatformSpawnInfo {
        let random = Math.random() * this.totalPlatformChanceCount;

        let index = 0;
        let accumulatedChance = 0;
        for (let i = 0; i < this.currentSet.platformSpawnInfos.length; i++) {
            accumulatedChance += this.currentSet.platformSpawnInfos[i].spawnChance;
            if (random <= accumulatedChance) {
                index = i;
                break;
            }
        }

        return this.currentSet.platformSpawnInfos[index];
    }

    private getRandomItemSpawnInfo() : PlatformItemSpawnInfo | null{
        let random = Math.random() * (this.totalItemChanceCount + this.currentSet.baseNoItemChance);

        if (random < this.currentSet.baseNoItemChance) {
            return null;
        }
    
        let index = 0;
        let accumulatedChance = this.currentSet.baseNoItemChance;
        for (let i = 0; i < this.currentSet.platformItemSpawnInfos.length; i++) {
            accumulatedChance += this.currentSet.platformItemSpawnInfos[i].spawnChance;
            if (random <= accumulatedChance) {
                index = i;
                break;
            }
        }
    
        return this.currentSet.platformItemSpawnInfos[index];
    }


    private getRandomNonBreakablePlatformSpawnInfo() : PlatformSpawnInfo {
        let random = Math.random() * this.totalNonBreakableChanceCount;

        let index = 0;
        let accumulatedChance = 0;
        for (let i = 0; i < this.currentSet.platformSpawnInfos.length; i++) {
            if (!this.currentSet.platformSpawnInfos[i].isBreakable){
                accumulatedChance += this.currentSet.platformSpawnInfos[i].spawnChance;
                if (random <= accumulatedChance) {
                    index = i;
                    break;
                }
            }
        }

        return this.currentSet.platformSpawnInfos[index];
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
        
        platform.transform.position[0] = Math.random() * (this.currentSet.varianceX[1] - this.currentSet.varianceX[0]) + this.currentSet.varianceX[0];
        platform.transform.position[1] = this.accumulateY + Math.random() * ((this.accumulateNonBreakableY - this.accumulateY + this.currentSet.varianceY[1] ) - this.currentSet.varianceY[0]) + this.currentSet.varianceY[0];
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
                vec3.set(platformItem.transform.position,  Math.random() * (itemInfo.varianceX[1] - itemInfo.varianceX[0]) + itemInfo.varianceX[0], itemInfo.offsetY, -0.1)
                
                vec3.set(platformItem.transform.scale, platformItem.transform.scale[0]/ platform.transform.scale[0] ,platformItem.transform.scale[1]/ platform.transform.scale[1], 1);
                
            }
        }
        
        if (this.accumulateNonBreakableY - this.accumulateY + this.currentSet.varianceY[1] > this.currentSet.varianceY[0] * 2){
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

export default EnvironmentSpawner;