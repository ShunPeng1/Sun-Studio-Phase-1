import GameObject from "../../engine/gameobjects/GameObject";
import Scene from "../../engine/scenes/Scene";

class PlatformSpawnInfo{
    private platformPrefab : GameObject;
    public spawnChance: number;
    public isBreakable: boolean;
    

    constructor(platformPrefab : GameObject, spawnChance : number, isBreakable : boolean = false){
        this.platformPrefab = platformPrefab;
        this.spawnChance = spawnChance;
        this.isBreakable = isBreakable;
    }

    public clonePlatform(scene : Scene) : GameObject{
        this.platformPrefab.setScene(scene);
        return this.platformPrefab.clone();
    }
}

export default PlatformSpawnInfo;