class InputManager{
    private static instance: InputManager;
    private keydownInputMap: { [key: string]: Array<() => void> } = {};
    private keypressInputMap: { [key: string]: Array<() => void> } = {};
    private keyupInputMap: { [key: string]: Array<() => void> } = {};

    private constructor() {
        window.addEventListener('keydown', (event) => {
            const callbacks = this.keydownInputMap[event.key];
            if (callbacks) {
                callbacks.forEach(callback => callback());
            }
            
            console.log('Key pressed: ' + event.key);
        });

        window.addEventListener('keypress', (event) => {
            const callbacks = this.keypressInputMap[event.key];
            if (callbacks) {
                callbacks.forEach(callback => callback());
            }
            
            console.log('Key continuously pressed: ' + event.key);
        });

        window.addEventListener('keyup', (event) => {
            const callbacks = this.keyupInputMap[event.key];
            if (callbacks) {
                callbacks.forEach(callback => callback());
            }
            
            console.log('Key released: ' + event.key);
        });
    }

    public static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    public subscribeKeyDown(key: string, callback: () => void) {
        if (!this.keydownInputMap[key]) {
            this.keydownInputMap[key] = [];
        }
        this.keydownInputMap[key].push(callback);
    }

    public subscribeKeyPress(key: string, callback: () => void) {
        if (!this.keypressInputMap[key]) {
            this.keypressInputMap[key] = [];
        }
        this.keypressInputMap[key].push(callback);
    }

    public subscribeKeyUp(key: string, callback: () => void) {
        if (!this.keyupInputMap[key]) {
            this.keyupInputMap[key] = [];
        }
        this.keyupInputMap[key].push(callback);
    }

    public unsubscribeKeyDown(key: string, callback: () => void) {
        const callbacks = this.keydownInputMap[key];
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    
}

export default InputManager;