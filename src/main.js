import { Application, Sprite, Texture } from 'pixi.js';
import {filterShadingInOut} from "./shaders/linear-black-in-out/filter-shading-in-out.js";
import {filterBgBlue} from "./shaders/bg-blue/bg-blue.filter.js"

async function init() {
    // 1. Создаем приложение PixiJS v8 на весь экран
    const app = new Application();
    await app.init({
        resizeTo: window,
        backgroundColor: 0x1099bb // Красивый голубой фон холста
    });
    document.body.appendChild(app.canvas);

    // 2. Создаем спрайт-квадрат (используем встроенную белую текстуру 16x16)
    const square = new Sprite(Texture.WHITE);
    const filterBgBlueFilter = filterBgBlue(150, 150)

    square.filters = [filterBgBlueFilter];

    // Задаем размеры квадрата (например, 150x150 пикселей)
    square.width = 150;
    square.height = 150;

    // Переносим точку привязки (pivot/anchor) в самый центр квадрата.
    // По умолчанию она находится в левом верхнем углу (0, 0). Значение 0.5 — это центр.
    square.anchor.set(0.5);

    // 3. Позиционируем квадрат ровно по центру экрана
    square.x = app.screen.width / 2;
    square.y = app.screen.height / 2;

    // 4. Добавляем его на сцену
    app.stage.addChild(square);

    // Дополнительно: автоматически центрируем квадрат при ресайзе окна
    app.renderer.on('resize', () => {
        square.x = app.screen.width / 2;
        square.y = app.screen.height / 2;
    });

    app.ticker.add((ticker) => {
      filterShadingInOut.resources.timeUniforms.uniforms.uTime += 0.04 * ticker.deltaTime;
      filterBgBlueFilter.resources.timeUniforms.uniforms.uTime += 0.02 * ticker.deltaTime;
    });
}

init().catch(console.error);
