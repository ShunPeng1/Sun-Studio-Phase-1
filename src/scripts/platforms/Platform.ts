import Component from "../../engine/components/Component";

class Platform extends Component{
    public clone(): Component {
        return new Platform();
    }

    

}

export default Platform;