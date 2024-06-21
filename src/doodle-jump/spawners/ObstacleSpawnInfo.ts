import GameObject from "../../engine/gameobjects/GameObject";
import Scene from "../../engine/scenes/Scene";

class ObstacleSpawnInfo {

    private obstaclePrefab : GameObject;
    public spawnChance: number;
    

    constructor(obstaclePrefab : GameObject, spawnChance : number){
        this.obstaclePrefab = obstaclePrefab;
        this.spawnChance = spawnChance;

    }


    public cloneObstacle(scene : Scene) : GameObject{
        this.obstaclePrefab.setScene(scene);
        return this.obstaclePrefab.clone();
    }
}

export default ObstacleSpawnInfo;