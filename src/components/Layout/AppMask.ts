import {Graphics} from "pixi.js";

export class AppMask extends Graphics {
    constructor(...args: any[]) {
        super(...args)
        this.resize(10, 10)
    }

    resize(w: number, h: number) {
        this.clear()
        this.beginFill(0xffffff);
        this.drawRect(0, 0, w, h);
        this.endFill();
    }
}