import { Application } from 'pixi.js';
import { GridComponent } from './components/Grid/Grid.container.ts';

async function init() {
    const app = new Application();
    await app.init({
        resizeTo: window,
        backgroundColor: 0x1099bb,
    });
    document.body.appendChild(app.canvas);

    const gridComponent = new GridComponent(app);
    app.stage.addChild(gridComponent);
}

init().catch(console.error);
