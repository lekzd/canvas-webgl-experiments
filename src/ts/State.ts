
export class State {
    top = 0;
    x = 0;
    y = 0;
    impulse = 0;
    heroX = 250;
    heroY = 300;
    bullets = new Set<{x: number, y: number}>();
}