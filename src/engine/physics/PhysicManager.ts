import Collider from "../components/physics/Collider";
import Ray from "./Ray";

class PhysicManager {
    private static instance: PhysicManager;
    private colliders: Collider[] = [];
    private collisionStates: Map<Collider[], boolean> = new Map();
    private ignoreCollisionSet: Set<string> = new Set();

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
            this.removeCollisionMapAndSet(collider);
        }
        else{
            console.error("Collider not found");
        }
    }

    private removeCollisionMapAndSet(collider: Collider): void {
        for (let key of this.collisionStates.keys()) {
            if (key.includes(collider)) {
                this.collisionStates.delete(key);
            }
        }

        for (let key of this.ignoreCollisionSet) {
            let keyArray = key.split('-');
            if (keyArray.includes(collider.id.toString())) {
                this.ignoreCollisionSet.delete(key);
            }
            
        }
    }

    public checkCollisions(): void {
        let newCollisionStates: Map<Collider[], boolean> = new Map();

        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                let collider1 = this.colliders[i];
                let collider2 = this.colliders[j];
                let key = [collider1, collider2].sort();
                let keyString = [collider1.id, collider2.id].sort().join('-');

                // Skip the collision check if the pair is in the ignore map
                if (this.ignoreCollisionSet.has(keyString)) {
                    continue;
                }

                let isColliding = collider1.collidesWith(collider2);
                newCollisionStates.set(key, isColliding);

                if (isColliding) {
                    if (this.collisionStates.get(key)) { // Collision stay
                        collider1.invokeCollisionStay(collider2);
                        collider2.invokeCollisionStay(collider1);
                        //console.log('Collision stay');
                    } else { // Collision enter
                        collider1.invokeCollisionEnter(collider2);
                        collider2.invokeCollisionEnter(collider1);
                        //console.log('Collision enter');
                    }
                } else if (this.collisionStates.get(key)) { // Collision exit
                    collider1.invokeCollisionExit(collider2);
                    collider2.invokeCollisionExit(collider1);
                    //console.log('Collision exit');
                }
            }
        }

        this.collisionStates = newCollisionStates;
    }

    public raycast(ray: Ray): Collider | null {
        for (let collider of this.colliders) {
            if (collider.intersectsRay(ray)) { // Assuming Collider has an intersectsRay method
                return collider;
            }
        }
        return null;
    }

    public actionOnAllColliders(action : (collider : Collider) => void){
        this.colliders.forEach(action);
    }

    public queryColliders(filterFunction : (collider : Collider) => boolean) : Collider[] {
        return this.colliders.filter(filterFunction);
    }

    public ignoreCollisions(collider1: Collider, collider2: Collider): void {
        let key = [collider1.id, collider2.id].sort().join('-');
        this.ignoreCollisionSet.add(key);
    }
    
    public unignoreCollisions(collider1: Collider, collider2: Collider): void {
        let key = [collider1.id, collider2.id].sort().join('-');
        this.ignoreCollisionSet.delete(key);
    }

}

export default PhysicManager;