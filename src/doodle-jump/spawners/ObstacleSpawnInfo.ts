import GameObject from "../../engine/gameobjects/GameObject";

class ObstacleSpawnInfo {

    private obstaclePrefab : GameObject;
    public spawnChance: number;
    

    constructor(obstaclePrefab : GameObject, spawnChance : number){
        this.obstaclePrefab = obstaclePrefab;
        this.spawnChance = spawnChance;

    }

}

export default ObstacleSpawnInfo;