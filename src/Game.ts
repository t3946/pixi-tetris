import {Application, Container, isMobile} from "pixi.js";
import {FlatBackground} from '@components/Layout/FlatBackground.ts';
import {GridComponent} from '@components/Grid/Grid.container.ts';

export class Game {
    app: Application;
    staticResolution = {w: 9, h: 19.5}
    mainContainer: Container<any>
    background: FlatBackground

    constructor(app: Application) {
        this.app = app

        // make main container
        this.mainContainer = new Container()
        this.background = new FlatBackground()
        this.mainContainer.addChild(this.background)
        app.stage.addChild(this.mainContainer)
        this.adoptMainContainerSize()

        const gridComponent = new GridComponent(app, this.app.canvas.height / 2)

        this.mainContainer.addChild(gridComponent)
        this.mainContainer.addChild(this.background)
    }

    adoptMainContainerSize() {
        const height = this.app.canvas.height
        let width

        if (isMobile.phone) {
            width = this.app.canvas.width
        } else {
            const {w, h} = this.staticResolution
            const resolution = w / h
            width = height * resolution
        }

        this.background.resize(width, height)
        this.mainContainer.width = width
        this.mainContainer.height = height
    }
}