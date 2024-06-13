import Component from "../engine/components/Component";
import InputManager from "../inputs/InputManager";
import CubeSpawner from "./CubeSpawner";

class PlayerBehavior extends Component {
    private cubeSpawner : CubeSpawner;
    
    constructor() {
        super();
        this.spawnCube = this.spawnCube.bind(this);
    }
    public awake(): void {
        this.cubeSpawner = this.gameObject.getComponent<CubeSpawner>(CubeSpawner)!;
        
        InputManager.getInstance().subscribe(" " , this.spawnCube);
        InputManager.getInstance().subscribe("MouseUp" , this.spawnCube);
    }
    
    public spawnCube(){

        this.cubeSpawner.spawnCube();

    }

    public update(time : number, deltaTime : number) {
        
        
    }
    
    public  clone() {
        return new PlayerBehavior();
    }
}

export default PlayerBehavior;