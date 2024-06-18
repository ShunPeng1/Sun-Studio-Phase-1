import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import SceneManager from "../../engine/scenes/SceneManager";
import Player from "./Player";

class PlayerGameOverContact extends Component{
    private collider: Collider;
    constructor(){
        super();
    }

    public awake(): void {
        this.collider = this.gameObject.getComponent<Collider>(Collider)!;
    }

    public start(): void {
        this.collider.subcribeToCollisionEnter(this.loseGame.bind(this));
    }

    private loseGame(other : Collider): void {
        if (other.gameObject.getComponent<Player>(Player))
        {
            SceneManager.getInstance().loadSceneByName('gameover');
        }
    }

    public destroy(): void {
        this.collider.unsubcribeToCollisionEnter(this.loseGame.bind(this));
    }
    
    
    public clone(): Component {
        return new PlayerGameOverContact();
    }

}

export default PlayerGameOverContact;