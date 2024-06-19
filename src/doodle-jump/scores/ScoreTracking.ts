import Component from "../../engine/components/Component";
import ScoreManager from "../ScoreManager";
import MaxFollowerMovement from "../movement/MaxFollowerMovement";

class ScoreTracking extends Component {
    private maxFollwerMovement: MaxFollowerMovement;
    private modifer: number;
    private yOffSet: number = 0;
    private currentScore: number = 0;

    constructor(maxFollwerMovement : MaxFollowerMovement, modifer: number = 1) {
        super();

        this.maxFollwerMovement = maxFollwerMovement;
        this.modifer = modifer;
    }

    public start(): void {
        this.yOffSet = this.maxFollwerMovement.transform.position[1];

        this.currentScore = 0;

        ScoreManager.getInstance().resetScore();
    }

    public update(time: number, deltaTime: number): void {
        // Add the score modifier to the score
        
        this.currentScore = Math.floor(Math.max(this.maxFollwerMovement.transform.position[1] - this.yOffSet, this.currentScore));
        ScoreManager.getInstance().setScore(this.currentScore * this.modifer);

    }
    
    public end(): void {
        ScoreManager.getInstance().saveHighScore();
    }

    public clone(): Component {
        throw new Error("Method not implemented.");
    }
    
}

export default ScoreTracking;