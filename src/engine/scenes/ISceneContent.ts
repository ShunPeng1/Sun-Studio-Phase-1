import GameObject from "../gameobjects/GameObject";

interface ISceneContent {

    download(): Promise<any>[];

    create(): GameObject[];

}

export default ISceneContent;