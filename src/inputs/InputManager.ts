class InputManager{
    private static instance: InputManager;
    private keydownInputMap: { [key: string]: Array<() => void> } = {};


    private constructor() {
        window.addEventListener('keydown', (event) => {
            const callbacks = this.keydownInputMap[event.key];
            if (callbacks) {
                callbacks.forEach(callback => callback());
            }
        });
    }

    public static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    public subscribe(key: string, callback: () => void) {
        if (!this.keydownInputMap[key]) {
            this.keydownInputMap[key] = [];
        }
        this.keydownInputMap[key].push(callback);
    }
}

export default InputManager;