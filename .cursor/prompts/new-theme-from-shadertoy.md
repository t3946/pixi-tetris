# Промпт: новая игровая тема из Shadertoy

Скопируй блок ниже в чат агента. Подставь пути/название/цвет. Исходник Shadertoy лучше положить рядом как `*.shadertoy.frag` и указать через `@`.

---

```
Нужно сделать новую игровую тему из скачанного Shadertoy-шейдера.

## Входные данные
- Исходник: @[ПУТЬ_К_SHADERTOY.frag]
- Папка темы (kebab-case): src/shaders/game-backgrounds/[имя-папки]/
- Имя enum (PascalCase / camelCase id): [OceanUnder] / [oceanUnder]
- Русское название темы: «[Название]»
- Accent hex (под цвет шейдера): #[RRGGBB]
- Progress в UserContext: 10 (сразу доступна в коллекциях), если не скажу иное
- introFadeDuration: по умолчанию 4.0; для простых/ярких водных/каустик-подобных можно 1.0
- Нужен ли quality low/high (если шейдер тяжёлый / я прошу оптимизацию): да/нет

## Что сделать (по аналогии с существующими темами)

### 1. Порт шейдера под PixiJS Filter
Создай:
- `[имя].frag` — рабочий GLSL ES 3.00
- `[имя].filter.js` — Pixi `Filter` + `GlProgram`, vertex: `@shaders/basic/flat.vert`
- исходник Shadertoy оставь как есть (`*.shadertoy.frag`) для справки

Порт обязан:
1. `#version 300 es`, при необходимости `precision highp float`
2. `iTime` → `uniform float uTime` + глобальный `float t` (`t = mod(uTime, 1000.0)` в `main`)
3. `mainImage` принимать `(vec4 fragColor, vec2 fragCoord, vec3 iResolution)` и возвращать `vec4`
4. Обязательный intro-fade (как у всех фонов):
   - uniforms: `uIntroFade`, `uIntroFadeDuration`
   - `col *= mix(1.0, smoothstep(0.0, uIntroFadeDuration, t - abs(q.y)), uIntroFade);`
   - где `q = fragCoord / iResolution.xy` (0..1). Если оси свапнуты (как crystal-squares) — взять ось, соответствующую вертикали экрана
5. Pixi `main`:
   ```glsl
   vec2 fragCoord = vTextureCoord * uInputSize.xy;
   vec3 resolution = vec3(uOutputFrame.z, uOutputFrame.w, 1.0);
   ```
   - НЕ использовать `(1.0 - vTextureCoord) * uInputSize` — ломает центр, когда input texture ≠ output frame (см. neonwave-sunrise)
   - Если картинка вниз головой (Shadertoy bottom-left vs Pixi): flip **только в output-space**, сохраняя центр:
     - только Y: `fragCoord.y = uOutputFrame.w - fragCoord.y;`
     - или 180°: `fragCoord = uOutputFrame.zw - fragCoord;`
6. `iChannelN` / `texture(...)`: нет буферов Shadertoy — замени на процедурный шум/хэш по смыслу канала (как `channelNoise` в ocean-under), либо явно скажи если нужен ассет
7. Убери audio/FFT/mouse, если есть
8. filter.js принимает `{ introFade = false, introFadeDuration = 4.0 }` и кладёт их в `timeUniforms` (`f32`)

Ориентиры: `wading-water-caustic`, `neonwave-sunrise`, `ocean-under`.

### 2. Регистрация
- `EBackgroundShaderId` — новый id
- `backgroundFilter.ts` — `createBackgroundFilter` + `tickBackgroundFilter` (типичный шаг времени: `time + 0.02 * deltaTime`, если нет своего speed)
- `EGameTheme` — новая тема
- `GameTheme.ts` — конфиг + запись в `GameThemesList`
- `UserContext.tsx` — `progress.gameTheme[EGameTheme.Xxx] = 10` (или что укажу)

### 3. Quality (настройки игры)
В проекте уже есть глобальные настройки качества фонов:
- `EShaderQuality` (`high` | `low`) в `../../src/shaders/game-backgrounds/EShaderQuality.ts`
- UI: `ShaderQualityDivision` → `user.settings.shaderQuality`
- В игре `Background` уже прокидывает `quality: shaderQuality` в `createBackgroundFilter` вместе с `introFade: true`

Если шейдер тяжёлый (raymarch и т.п.) или я прошу low/high:
1. Сделай кастомную оптимизацию **в этом шейдере** по образцу `ocean-under`:
   - дефолт / `high` = полная fidelity как в порте Shadertoy
   - `low` = урезанные шаги/октавы/и т.д. (узнаваемый вид, дешевле на GPU)
   - uniform вроде `uLowQuality` (0/1), ветки через early-break в циклах с константным MAX
2. filter.js принимает `quality` (`'high'|'low'`, дефолт high) → выставляет uniform
3. В `backgroundFilter.ts` для этого шейдера прокинь `shadingOptions?.quality` (как у OceanUnder)
4. **Не** хардкодь `quality: 'low'` в `GameTheme` — качество берётся из настроек пользователя через `Background`

Лёгким шейдерам quality не обязателен: параметр из настроек можно игнорировать, пока оптимизация не нужна.

### 4. Не делать без просьбы
- Не коммитить
- Не ломать картинку ради оптимизации: low — опциональный пресет, high должен выглядеть как нормальный порт

### 5. Проверка
Кратко перечисли созданные/изменённые файлы. Если ориентация или центр сомнительны — напиши, что проверить в игре/коллекциях (introFade в коллекциях выключен: его включает только `Background` через `introFade: true`). Если есть quality — напомнить переключить «Высоко/Низко» в настройках.
```

---

## Быстрый шаблон одной строкой

```
Новая тема из @[path/to/xxx.shadertoy.frag]: папка xxx, enum Xxx / xxx, название «…», accent #……, progress 10. Порт в Pixi как остальные game-backgrounds (introFade, правильный fragCoord через uInputSize/uOutputFrame, без (1-v)*uInputSize). Зарегистрируй id/тему/filter/tick + UserContext. [Если тяжёлый:] сразу low/high как ocean-under и прокинь quality из shadingOptions (Background уже отдаёт user.settings.shaderQuality).
```
