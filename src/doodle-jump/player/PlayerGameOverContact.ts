import Component from "../../engine/components/Component";
import Collider from "../../engine/components/physics/Collider";
import SceneManager from "../../engine/scenes/SceneManager";
import ScoreManager from "../ScoreManager";
import Player from "./Player";

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
        if (other.gameObject.getComponent<Player>(Player))
        {
            SceneManager.getInstance().setNextSceneByName('gameover');
            ScoreManager.getInstance().saveHighScore();
        }
    }

    public destroy(): void {
        this.collider.unsubcribeToCollisionEnter(this.boundLoseGame);
    }
    
    
    public clone(): Component {
        return new PlayerGameOverContact();
    }

}

export default PlayerGameOverContact;