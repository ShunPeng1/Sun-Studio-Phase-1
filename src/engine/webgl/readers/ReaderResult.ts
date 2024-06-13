import Mesh from "../shapes/Mesh";

class ReaderResult{
    public meshes: Mesh[] = [];
    public error: any;
    public success: boolean;

    constructor(error: any) {
        this.error = error;
        this.success = !error;
    }

    public addMesh(mesh: Mesh) {
        this.meshes.push(mesh);
    }


}

export default ReaderResult;