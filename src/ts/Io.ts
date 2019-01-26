
export class Io {

    private keys = new Set<string>();

    constructor() {
        window.addEventListener('keydown', event => {
            this.keys.add(event.code);
        });

        window.addEventListener('keyup', event => {
            this.keys.delete(event.code);
        });
    }

    has(key: string): boolean {
        return this.keys.has(key);
    }
}