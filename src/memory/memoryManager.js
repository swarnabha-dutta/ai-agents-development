class MemoryManager {
    constructor(limit = 10) {
        this.limit = limit;
        this.messages = [];
    }

    add(role, content) {
        this.messages.push({
            role,
            content,
        });

        if (this.messages.length > this.limit) {
            this.messages.shift();
        }
    }

    getHistory() {
        return this.messages;
    }

    clear() {
        this.messages = [];
    }
}

export default MemoryManager;