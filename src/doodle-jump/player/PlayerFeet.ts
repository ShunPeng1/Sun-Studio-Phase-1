import Component from "../../engine/components/Component";

class PlayerFeet extends Component{
    
    private jumpSubscribers: Array<() => void> = [];
    private jumpDuration : number;

    private isJumping : boolean = false;

    private currentJumpTime : number = 0;

    constructor(jumpDuration : number){
        super();

        this.jumpDuration = jumpDuration;
    }

    public update(time: number, deltaTime: number): void {
        if(this.isJumping){
            this.currentJumpTime += deltaTime;
            if(this.currentJumpTime >= this.jumpDuration){
                this.isJumping = false;
                this.currentJumpTime = 0;
            }
        }
    }

    public subscribeJump(callback: () => void): void {
        this.jumpSubscribers.push(callback);
    }

    public unsubscribeJump(callback: () => void): void {
        const index = this.jumpSubscribers.indexOf(callback);
        if (index !== -1) {
            this.jumpSubscribers.splice(index, 1);
        }
    }

    public jump(): void {
        // Notify all subscribers
        this.isJumping = true;
        this.currentJumpTime = 0;
        for (const callback of this.jumpSubscribers) {
            callback();
        }
    }


    public getIsJumping(): boolean {

        console.log(this.isJumping);
        return this.isJumping;
    }

    public clone(): Component {
        return new PlayerFeet(this.jumpDuration);
    }

}

export default PlayerFeet;