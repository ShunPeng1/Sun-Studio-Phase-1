
enum TextureType {
    TEXTURE_2D = WebGLRenderingContext.TEXTURE_2D,
    TEXTURE_CUBE_MAP = WebGLRenderingContext.TEXTURE_CUBE_MAP
}

enum TextureWrap {
    CLAMP_TO_EDGE = WebGLRenderingContext.CLAMP_TO_EDGE,
    MIRRORED_REPEAT = WebGLRenderingContext.MIRRORED_REPEAT,
    REPEAT = WebGLRenderingContext.REPEAT
}

enum TextureFilter {
    LINEAR = WebGLRenderingContext.LINEAR,
    NEAREST = WebGLRenderingContext.NEAREST
}

export {TextureType, TextureWrap, TextureFilter};
