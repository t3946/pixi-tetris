import { Application } from 'pixi.js'
import { Container, Graphics } from 'pixi.js'
import {filterShadingInOut} from "../../shaders/linear-black-in-out/filter-shading-in-out";

export class GridComponent extends Container {
    // Размеры стакана
    app: Application
    verticalCells = 20
    horizontalCells = 10
    size = 300
    gridAlpha = 0.5

    constructor(app: Application) {
        super() // Превращаем класс в контейнер PixiJS

        this.app = app
        this.renderDynamicBackground()
        this.renderGrid()
    }

    // draw dynamic background
    renderDynamicBackground() {
        this.app.ticker.add((ticker) => {
            filterShadingInOut.resources.timeUniforms.uniforms.uTime += 0.04 * ticker.deltaTime;
            filterBgBlueFilter.resources.timeUniforms.uniforms.uTime += 0.02 * ticker.deltaTime;
        });
    }

    // draw grid
    renderGrid() {
        const cellSize = this.size / 10
        const width = this.horizontalCells * cellSize
        const height = this.verticalCells * cellSize

        const graphics = new Graphics()

        // shadow background
        graphics
            .rect(0, 0, width, height)
            .fill({ color: 0x222222, alpha: this.gridAlpha })

        //[start] draw lines
        for (let i = 0; i <= this.horizontalCells; i++) {
            const x = i * cellSize
            graphics.moveTo(x, 0).lineTo(x, height)
        }

        for (let j = 0; j <= this.verticalCells; j++) {
            const y = j * cellSize
            graphics.moveTo(0, y).lineTo(width, y)
        }

        graphics.stroke({ color: 0x666666, width: 1, alpha: this.gridAlpha })
        //[end]

        this.addChild(graphics)
    }
}
