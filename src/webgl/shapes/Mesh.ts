enum ColorType {
    RGB = 3,
    RGBA = 4
}


class Mesh {
    private positions: number[];
    private indices: number[];
    private colors: number[];
    private normals: number[];
    private textureCoords: number[];
    private colorType: ColorType;

    private positionLenght: number = 3;
    private colorLenght: number = 4;
    private normalLength: number = 3;
    private textureCoordsLength: number = 2;

    private positionsOffset: number = 0;
    private colorsOffset: number = 0;
    private normalsOffset: number = 0;
    private textureCoordsOffset: number = 0;

    private vboData: number[] = [];
    private vertexLength: number = 0;
    private indicesLength: number = 0;

    constructor(positions: number[], indices: number[], colors: number[], normals: number[], textureCoords : number[], colorType: ColorType = ColorType.RGBA) {
        this.positions = positions;
        this.indices = indices;
        this.colors = colors;
        this.normals = normals;
        this.textureCoords = textureCoords;

        this.colorType = colorType;
        this.colorLenght = colorType;

        this.positionsOffset = 0;
        this.colorsOffset = this.positionsOffset + this.positionLenght;
        this.normalsOffset = this.colorsOffset + this.colorLenght;
        this.textureCoordsOffset = this.normalsOffset + this.normalLength;
        this.vertexLength = this.positionLenght + this.colorLenght + this.normalLength + this.textureCoordsLength;

        this.indicesLength = indices.length;

        for (let i = 0; i < this.positions.length / 3; i++) {
            this.vboData.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]); // Position
            this.vboData.push(colors[i * 4], colors[i * 4 + 1], colors[i * 4 + 2], colors[i * 4 + 3]); // Color
            this.vboData.push(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]); // Normal
            this.vboData.push(textureCoords[i * 2], textureCoords[i * 2 + 1]); // Texture Coordinates
        }
    }

    public getPositions(): number[] {
        return this.positions;
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

    public getPositionsOffset(): number {
        return this.positionsOffset;
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

    public getVboData(): number[] {
        return this.vboData;
    }

    public getEboData(): number[] {
        return this.indices;
    }

    public getPositionLength(): number {
        return this.positionLenght;
    }

    public getColorLength(): number {
        return this.colorLenght;
    }

    public getNormalLength(): number {
        return this.normalLength;
    }

    public getTextureCoordsLength(): number {
        return this.textureCoordsLength;
    }

    public getPositionsLength(): number {
        return this.positions.length / this.positionLenght;
    }

    public getIndicesLength(): number {
        return this.indices.length;
    }


}

export default Mesh;