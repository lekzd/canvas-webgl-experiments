import './webglUtils';
import {Inject} from "./helpers/InjectDectorator";
import {State} from "./State";
import {Io} from "./Io";
import {BackgroundLayer} from "./views/BackgroundLayer";
import {BulletsLayer} from "./views/BulletsLayer";
import {clamp} from "./helpers/clamp";
import {distance} from "./helpers/distance";
import {EffectsLayer} from "./views/EffectsLayer";
import {Render} from "./render/Render";
import {UiLayer} from "./views/UiLayer";

declare global {
    interface Window {
        webglUtils: any;
    }
}

class App {
    @Inject(Render) private render: Render;
    @Inject(State) private state: State;
    @Inject(Io) private io: Io;

    constructor() {
        const background = new BackgroundLayer();
        const bullets = new BulletsLayer();
        const effects = new EffectsLayer();
        const ui = new UiLayer();

        this.render.init([
            background, bullets, effects, ui
        ]);

        const velocity = 15;

        setInterval(() => {
           this.state.top = (this.state.top + 5) % 500;

           if (this.io.has('KeyW')) {
               this.state.heroY -= velocity;
           }

           if (this.io.has('KeyS')) {
               this.state.heroY += velocity;
           }

           if (this.io.has('KeyA')) {
               this.state.heroX -= velocity;
           }

           if (this.io.has('KeyD')) {
               this.state.heroX += velocity;
           }

           if (this.io.has('Space')) {
               const bullet = {
                   x: this.state.heroX,
                   y: this.state.heroY - 20
               };

               this.state.bullets.add(bullet);

               setTimeout(() => {
                   this.state.bullets.delete(bullet);
               }, 200);
           }

           this.state.bullets.forEach(bullet => bullet.y -= 10 * Math.floor(Math.random() * 10));

           if (this.state.enemies.size < 10) {
               this.state.enemies.add({
                   x: clamp((Math.random() * 500) | 0, 20, 480),
                   y: -(Math.random() * 500) | 0
               });
           }

           this.state.enemies.forEach(enemy => {
               enemy.y += 8;

               if (enemy.y > 510) {
                   this.state.enemies.delete(enemy);
               }

               this.state.bullets.forEach(bullet => {
                   if (distance(enemy.x, enemy.y, bullet.x, bullet.y) < 14) {
                       this.state.enemies.delete(enemy);

                       const effect = {
                           ...enemy,
                           size: 5
                       };

                       this.state.effects.add(effect);

                       setTimeout(() => {
                           this.state.effects.delete(effect);
                       }, 500);

                       this.state.points++;
                   }
               });

               if (distance(enemy.x, enemy.y, this.state.heroX, this.state.heroY) < 14) {
                   this.state.damaged = true;

                   setTimeout(() => {
                       this.state.damaged = false;
                   }, 300);
               }
           });

           this.state.effects.forEach(effect => {
               effect.size += 5;
           });

        }, 50);
    }
}

new App;