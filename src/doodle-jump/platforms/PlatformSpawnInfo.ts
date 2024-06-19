import GameObject from "../../engine/gameobjects/GameObject";
import Scene from "../../engine/scenes/Scene";

class PlatformSpawnInfo{
    private platformPrefab : GameObject;
    public spawnChance: number;
    public isBreakable: boolean;
    public haveItem: boolean;
    

    constructor(platformPrefab : GameObject, spawnChance : number, isBreakable : boolean = false, haveItem : boolean = false){
        this.platformPrefab = platformPrefab;
        this.spawnChance = spawnChance;
        this.isBreakable = isBreakable;
        this.haveItem = haveItem;
    }

    public clonePlatform(scene : Scene) : GameObject{
        this.platformPrefab.setScene(scene);
        return this.platformPrefab.clone();
    }
}

export default PlatformSpawnInfo;