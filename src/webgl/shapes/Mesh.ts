enum ColorType {
    RGB = 3,
    RGBA = 4
}


class Mesh {
    private vertices: number[];
    private indices: number[];
    private colors: number[];
    private normals: number[];
    private textureCoords: number[];
    private colorType: ColorType;

    private verticesOffset: number = 0;
    private colorsOffset: number = 0;
    private normalsOffset: number = 0;
    private textureCoordsOffset: number = 0;
    private vertexLength: number = 0;

    private data: number[] = [];

    constructor(vertices: number[], indices: number[], colors: number[], normals: number[], textureCoords : number[], colorType: ColorType = ColorType.RGBA) {
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
        this.normals = normals;
        this.textureCoords = textureCoords;

        this.colorType = colorType;

        this.verticesOffset = 3;
        this.colorsOffset = this.verticesOffset + (colorType === ColorType.RGB ? 3 : 4);
        this.normalsOffset = this.colorsOffset + 3;
        this.textureCoordsOffset = this.normalsOffset + 3;

        this.vertexLength = this.textureCoordsOffset + 2;


        for (let i = 0; i < this.vertices.length / 3; i++) {
            this.data.push(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]); // Position
            this.data.push(colors[i * 4], colors[i * 4 + 1], colors[i * 4 + 2], colors[i * 4 + 3]); // Color
            this.data.push(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]); // Normal
            this.data.push(textureCoords[i * 2], textureCoords[i * 2 + 1]); // Texture Coordinates
        }
    }

    public getVertices(): number[] {
        return this.vertices;
    }

    public getIndices(): number[] {
        return this.indices;
    }

    public getColors(): number[] {
        return this.colors;
    }

    public getNormals(): number[] {
        return this.normals;
    }

    public getTextureCoords(): number[] {
        return this.textureCoords;
    }

    public getColorType(): ColorType {
        return this.colorType;
    }

    public getVerticesOffset(): number {
        return this.verticesOffset;
    }

    public getColorsOffset(): number {
        return this.colorsOffset;
    }

    public getNormalsOffset(): number {
        return this.normalsOffset;
    }

    public getTextureCoordsOffset(): number {
        return this.textureCoordsOffset;
    }

    public getVertexLength(): number {
        return this.vertexLength;
    }

    public getData(): number[] {
        return this.data;
    }


}

export default Mesh;