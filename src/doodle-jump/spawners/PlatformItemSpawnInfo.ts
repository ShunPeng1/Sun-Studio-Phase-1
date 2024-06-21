import { vec2 } from "gl-matrix";
import GameObject from "../../engine/gameobjects/GameObject";
import Scene from "../../engine/scenes/Scene";
import PlatformItem from "../platform-items/PlatformItem";


class PlatformItemSpawnInfo{
    private platformItemPrefab : GameObject;
    public spawnChance: number;
    public varianceX : vec2;
    public offsetY : number;

    constructor(platformItemPrefab : GameObject, spawnChance : number, varianceX : vec2, offsetY : number){
        this.platformItemPrefab = platformItemPrefab;
        this.spawnChance = spawnChance;
        this.varianceX = varianceX;
        this.offsetY = offsetY;

    }

    public clonePlatformItem(scene : Scene) : PlatformItem{
        this.platformItemPrefab.setScene(scene);
        return this.platformItemPrefab.clone().getComponent<PlatformItem>(PlatformItem)!;
    }
}

export default PlatformItemSpawnInfo;