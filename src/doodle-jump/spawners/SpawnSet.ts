import { vec2 } from "gl-matrix";
import ObstacleSpawnInfo from "./ObstacleSpawnInfo";
import PlatformItemSpawnInfo from "./PlatformItemSpawnInfo";
import PlatformSpawnInfo from "./PlatformSpawnInfo";

class SpawnSet{
    public setChance : number;

    public minHeight: number;
    public maxHeight: number;
    public varianceX : vec2;
    public varianceY : vec2;

    public platformSpawnInfos: PlatformSpawnInfo[];
    public platformSpawnChance: number;
    public totalNonBreakableChanceCount : number = 0;
    public totalPlatformChanceCount : number = 0;
    
    public obstacleSpawnInfos: ObstacleSpawnInfo[];
    public totalObstacleChanceCount : number = 0;
    public obstacleSpawnChance: number;
    
    public platformItemSpawnInfos : PlatformItemSpawnInfo[];
    public totalItemChanceCount : number = 0;
    public baseNoItemChance : number;


    constructor(setChance : number, minHeight: number, maxHeight: number, varianceX : vec2, varianceY : vec2, platformSpawnInfos: PlatformSpawnInfo[], platformSpawnChance : number, obstacleSpawnInfos: ObstacleSpawnInfo[], obstacleSpawnChance: number, platformItemSpawnInfos : PlatformItemSpawnInfo[], baseNoItemChance : number) {
        this.setChance = setChance;
        
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.varianceX = varianceX;
        this.varianceY = varianceY;

        this.platformSpawnInfos = platformSpawnInfos;
        this.platformSpawnChance = platformSpawnChance;

        this.obstacleSpawnInfos = obstacleSpawnInfos;
        this.obstacleSpawnChance = obstacleSpawnChance;

        this.platformItemSpawnInfos = platformItemSpawnInfos;
        this.baseNoItemChance = baseNoItemChance;
    
    
    
        this.platformSpawnInfos.forEach(element => {
            this.totalPlatformChanceCount += element.spawnChance;
        
            if (!element.isBreakable){
                this.totalNonBreakableChanceCount += element.spawnChance;
            }
        });

        this.obstacleSpawnInfos.forEach(element => {
            this.totalObstacleChanceCount += element.spawnChance;
        });

        this.platformItemSpawnInfos.forEach(element => {
            this.totalItemChanceCount += element.spawnChance;
        });



    }

    

}

export default SpawnSet;