import {Application} from "pixi.js";
import { GridComponent } from '@components/Grid/Grid.container.ts';

export class Game {
    app: Application;
    staticResolution = {w: 9, h: 19.5}

    constructor(app: Application) {
        this.app = app;

        console.log()

        // сложность в том, что здесь соотношения сторон должны быть строго 1 к 2, что нарушает логику работы экранов, т.к.
        const gridComponent = new GridComponent(app, this.app.canvas.height / 2);
        app.stage.addChild(gridComponent);
    }
}