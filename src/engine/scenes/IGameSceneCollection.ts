import ISceneContent from "./ISceneContent";
import Scene from "./Scene";

interface IGameSceneCollection {

    createScenes(): Scene[];

    setStartScene(): Scene;

}

export default IGameSceneCollection;