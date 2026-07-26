import { Container, Graphics } from 'pixi.js';

export class GridComponent extends Container {
    // Размеры стакана
    verticalCells = 20;
    horizontalCells = 10;
    cellSize = 30;
    gridAlpha = 0.5;

    constructor() {
        super(); // Превращаем класс в контейнер PixiJS

        // Инициализируем отрисовку визуальной части
        this.renderGrid();
    }

    renderGrid() {
        const width = this.horizontalCells * this.cellSize;
        const height = this.verticalCells * this.cellSize;

        const graphics = new Graphics();

        // shadow background
        graphics
            .rect(0, 0, width, height)
            .fill({ color: 0x222222, alpha: this.gridAlpha });

        //[start] draw lines
        for (let i = 0; i <= this.horizontalCells; i++) {
            const x = i * this.cellSize;
            graphics.moveTo(x, 0).lineTo(x, height);
        }

        for (let j = 0; j <= this.verticalCells; j++) {
            const y = j * this.cellSize;
            graphics.moveTo(0, y).lineTo(width, y);
        }

        graphics.stroke({ color: 0x666666, width: 1, alpha: this.gridAlpha });
        //[end]

        this.addChild(graphics);
    }
}
