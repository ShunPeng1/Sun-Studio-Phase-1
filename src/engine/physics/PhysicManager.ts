import Collider from "../components/Collider";

class PhysicManager {
    private static instance: PhysicManager;
    private colliders: Collider[] = [];
    private collisionStates: Map<string, boolean> = new Map();

    private constructor() {}

    public static getInstance(): PhysicManager {
        if (!PhysicManager.instance) {
            PhysicManager.instance = new PhysicManager();
        }
        return PhysicManager.instance;
    }

    public addCollider(collider: Collider): void {
        this.colliders.push(collider);
    }

    public removeCollider(collider: Collider): void {
        const index = this.colliders.indexOf(collider);
        if (index > -1) {
            this.colliders.splice(index, 1);
        }
    }

    public checkCollisions(): void {
        let newCollisionStates: Map<string, boolean> = new Map();

        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                let collider1 = this.colliders[i];
                let collider2 = this.colliders[j];
                let key = `${collider1.id}-${collider2.id}`;

                let isColliding = collider1.collidesWith(collider2);
                newCollisionStates.set(key, isColliding);

                if (isColliding) {
                    if (this.collisionStates.get(key)) { // Collision stay
                        collider1.onCollisionStay.emit('collision', collider2);
                        collider2.onCollisionStay.emit('collision', collider1);
                        console.log('Collision stay');
                    } else { // Collision enter
                        collider1.onCollisionEnter.emit('collision', collider2);
                        collider2.onCollisionEnter.emit('collision', collider1);
                        console.log('Collision enter');
                    }
                } else if (this.collisionStates.get(key)) { // Collision exit
                    collider1.onCollisionExit.emit('collision', collider2);
                    collider2.onCollisionExit.emit('collision', collider1);
                    console.log('Collision exit');
                }
            }
        }

        this.collisionStates = newCollisionStates;
    }
}

export default PhysicManager;