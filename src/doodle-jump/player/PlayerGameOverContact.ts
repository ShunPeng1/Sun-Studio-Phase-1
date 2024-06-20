import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import SceneManager from "../../engine/scenes/SceneManager";
import ScoreManager from "../ScoreManager";
import DoodleJumpSceneCollection from "../scenes/DoodleJumpSceneCollection";
import PlayerEquipment from "./PlayerEquipment";

class PlayerGameOverContact extends Component{
    private collider: Collider;

    private boundLoseGame: (event: Collider) => void;

    constructor(){
        super();

        this.boundLoseGame = this.loseGame.bind(this);
    }

    public awake(): void {
        this.collider = this.gameObject.getComponent<Collider>(Collider)!;
    }

    public start(): void {
        this.collider.subcribeToCollisionEnter(this.boundLoseGame);
    }

    private loseGame(other : Collider): void {
        if (other.gameObject.getComponent<PlayerEquipment>(PlayerEquipment))
        {
            SceneManager.getInstance().setNextSceneByName(DoodleJumpSceneCollection.GAME_OVER_SCENE_NAME);
            ScoreManager.getInstance().saveHighScore();
        }
    }

    protected destroy(): void {
        this.collider.unsubcribeToCollisionEnter(this.boundLoseGame);
    }
    
    
    public clone(): Component {
        return new PlayerGameOverContact();
    }

}

export default PlayerGameOverContact;