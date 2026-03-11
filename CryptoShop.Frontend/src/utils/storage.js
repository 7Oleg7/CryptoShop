class Storage {
    constructor() {
        this.storage = typeof window !== 'undefined' ? window.localStorage : null;
        this.memoryStorage = new Map();
    }

    set(key, value) {
        const stringValue = JSON.stringify(value);
        if (this.storage) {
            this.storage.setItem(key, stringValue);
        } else {
            this.memoryStorage.set(key, stringValue);
        }
    }

    get(key) {
        let value;
        if (this.storage) {
            value = this.storage.getItem(key);
        } else {
            value = this.memoryStorage.get(key);
        }
        try {
            return value ? JSON.parse(value) : null;
        } catch {
            return value;
        }
    }

    remove(key) {
        if (this.storage) {
            this.storage.removeItem(key);
        } else {
            this.memoryStorage.delete(key);
        }
    }

    clear() {
        if (this.storage) {
            this.storage.clear();
        } else {
            this.memoryStorage.clear();
        }
    }
}

export default new Storage();