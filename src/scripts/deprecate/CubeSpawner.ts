import { vec3 } from "gl-matrix";
import Component from "../../engine/components/Component";
import GameObject from "../../engine/scenes/GameObject";

class CubeSpawner extends Component {
    private cubePrefab : GameObject; 

    private spawnPlace : GameObject;
    private maxSpawn : number;

    constructor(cubePrefab : GameObject, spawnPlace : GameObject, maxSpawn : number) {
        super();
        
        this.cubePrefab = cubePrefab;
        this.spawnPlace = spawnPlace;
        this.maxSpawn = maxSpawn;
    }

    public spawnCube() {
        
        let cube = this.cubePrefab.clone();
        vec3.copy(cube.transform.position, this.spawnPlace.transform.position);

    }


    public clone(): Component {
        throw new Error("Method not implemented.");
    }
}

export default CubeSpawner;