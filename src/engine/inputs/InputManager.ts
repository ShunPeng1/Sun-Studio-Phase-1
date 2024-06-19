class InputManager{
    private static instance: InputManager;
    private keydownInputMap: { [key: string]: Array<() => void> } = {};
    private keypressInputMap: { [key: string]: Array<() => void> } = {};
    private keyupInputMap: { [key: string]: Array<() => void> } = {};

    private mouseClickInputMap: Array<(event : MouseEvent) => void> = [];
    private mouseDownInputMap: Array<(event : MouseEvent) => void> = [];
    private mouseUpInputMap: Array<(event : MouseEvent) => void> = [];
    private mouseMoveInputMap: Array<(event : MouseEvent) => void> = [];


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

        window.addEventListener('click', (event) => {
            this.mouseClickInputMap.forEach(callback => callback(event));
            console.log('Mouse clicked at position:', event.clientX, event.clientY);
        });
        
        window.addEventListener('mousedown', (event) => {
            this.mouseDownInputMap.forEach(callback => callback(event));
            console.log('Mouse down at position:', event.clientX, event.clientY);
        });
        
        window.addEventListener('mouseup', (event) => {
            this.mouseUpInputMap.forEach(callback => callback(event));
            console.log('Mouse up at position:', event.clientX, event.clientY);
        });
        
        window.addEventListener('mousemove', (event) => {
            this.mouseMoveInputMap.forEach(callback => callback(event));
            console.log('Mouse moved to position:', event.clientX, event.clientY);
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

    public subscribeMouseClick(callback: (event : MouseEvent) => void) {
        this.mouseClickInputMap.push(callback);
    }

    public subscribeMouseDown(callback: (event : MouseEvent) => void) {
        this.mouseDownInputMap.push(callback);
    }

    public subscribeMouseUp(callback: (event : MouseEvent) => void) {
        this.mouseUpInputMap.push(callback);
    }

    public subscribeMouseMove(callback: (event : MouseEvent) => void) {
        this.mouseMoveInputMap.push(callback);
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

    public unsubscribeKeyPress(key: string, callback: () => void) {
        const callbacks = this.keypressInputMap[key];
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    public unsubscribeKeyUp(key: string, callback: () => void) {
        const callbacks = this.keyupInputMap[key];
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    public unsubscribeMouseClick(callback: (event : MouseEvent) => void) {
        const index = this.mouseClickInputMap.indexOf(callback);
        if (index > -1) {
            this.mouseClickInputMap.splice(index, 1);
        }
    }

    public unsubscribeMouseDown(callback: (event : MouseEvent) => void) {
        const index = this.mouseDownInputMap.indexOf(callback);
        if (index > -1) {
            this.mouseDownInputMap.splice(index, 1);
        }
    }

    public unsubscribeMouseUp(callback: (event : MouseEvent) => void) {
        const index = this.mouseUpInputMap.indexOf(callback);
        if (index > -1) {
            this.mouseUpInputMap.splice(index, 1);
        }
    }

    public unsubscribeMouseMove(callback: (event : MouseEvent) => void) {
        const index = this.mouseMoveInputMap.indexOf(callback);
        if (index > -1) {
            this.mouseMoveInputMap.splice(index, 1);
        }
    }
}

export default InputManager;