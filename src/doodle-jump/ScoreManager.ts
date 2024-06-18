class ScoreManager {
    
    private static instance: ScoreManager;
    private score: number;
    private highScore: number;

    private constructor() {
        this.score = 0;
        this.loadHighScore();
    }

    public static getInstance(): ScoreManager {
        if (!ScoreManager.instance) {
            ScoreManager.instance = new ScoreManager();
        }
        return ScoreManager.instance;
    }

    public addScore(score: number) {
        this.score += score;
    }

    public resetScore() {
        this.score = 0;
    }
    
    setScore(score: number) {
        this.score = score;
    }

    public getScore(){
        return this.score;
    }

    public saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            // Save the new high score to local storage
            localStorage.setItem('highScore', this.highScore.toString());
        }
    }

    public loadHighScore() {
        const highScore = localStorage.getItem('highScore');
        if (highScore) {
            this.highScore = parseInt(highScore);
        } else {
            this.highScore = 0;
        }
    }

    public getHighScore() {
        return this.highScore;
    }

    
}

export default ScoreManager;