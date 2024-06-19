import DoodleJumpSceneCollection from "./doodle-jump/scenes/DoodleJumpSceneCollection";
import ShunGameEngine from "./engine/games/ShunGameEngine";

class Game {
   
    constructor() {
        let shunGameEngine = new ShunGameEngine(new DoodleJumpSceneCollection(),600,800);
        
    }
}

new Game()
