import GameObject from "../gameobjects/GameObject";
import IGameSceneCollection from "./IGameSceneCollection";

interface ISceneContent {
    sceneCollection : IGameSceneCollection

    download(): Promise<any>[];

    create(): GameObject[];

}

export default ISceneContent;