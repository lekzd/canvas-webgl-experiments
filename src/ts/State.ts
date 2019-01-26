
export class State {
    top = 0;
    x = 0;
    y = 0;
    impulse = 0;
    heroX = 250;
    heroY = 300;
    bullets = new Set<{x: number, y: number}>();
    enemies = new Set<{x: number, y: number}>();
    effects = new Set<{x: number, y: number, size: number}>();

    points = 0;
    damaged = false;
}