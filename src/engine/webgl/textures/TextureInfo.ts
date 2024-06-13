import { TextureType, TextureWrap, TextureFilter } from "./TextureEnum";

class TextureInfo {
    public isFlipY: boolean;
    public textureType: TextureType;
    public textureWrapS: TextureWrap;
    public textureWrapT: TextureWrap;
    public textureMinFilter: TextureFilter;
    public textureMagFilter: TextureFilter;


    constructor(isFlipY: boolean = false,
        textureType: TextureType = TextureType.TEXTURE_2D,
        textureWrapS: TextureWrap = TextureWrap.CLAMP_TO_EDGE,
        textureWrapT: TextureWrap = textureWrapS,
        textureMinFilter: TextureFilter = TextureFilter.LINEAR,
        textureMagFilter: TextureFilter = TextureFilter.LINEAR) {
    
        this.isFlipY = isFlipY;
        this.textureType = textureType;
        this.textureWrapS = textureWrapS;
        this.textureWrapT = textureWrapT;
        this.textureMinFilter = textureMinFilter;
        this.textureMagFilter = textureMagFilter;
    
    }
}

export default TextureInfo;