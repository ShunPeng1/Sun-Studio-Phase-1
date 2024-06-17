import IStatePredicate from "../../state_machines/IStatePredicate";

class AnimationPredicate implements IStatePredicate{
    private readonly predicate: () => boolean;
    
    constructor(predicate: () => boolean) {
        this.predicate = predicate;
    }

    public evaluate(): boolean {
        return this.predicate();
    }

}


export default AnimationPredicate;