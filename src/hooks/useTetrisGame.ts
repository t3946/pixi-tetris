/**
 * Хук useTetrisGame — «мозг» игры на стороне React.
 *
 * Задача: связать три вещи между собой:
 *  1. Состояние игры (поле, фигура, game over) — через useReducer
 *  2. Автоматическое падение фигур — через useTick (игровой цикл Pixi)
 *  3. Управление с клавиатуры — через useEffect + addEventListener
 *
 * Сама логика тетриса (коллизии, поворот, очистка линий) живёт в @src/tetris/engine.ts.
 * Здесь мы только решаем КОГДА вызвать ту или иную функцию из engine.
 */
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useTick } from '@pixi/react'
import {
    createInitialState,
    createSandboxState,
    hardDrop,
    moveDown,
    moveHorizontal,
    restart,
    rotate,
    tick,
    togglePause,
    type Board,
    type GameState,
} from '@src/tetris/engine'
import {
    BaseClearIterator,
    ClearIterator,
    ClearEffect,
    ShrinkClearEffect,
    getMonominoView,
    type ClearApi,
} from '@src/tetris/clear'

/** Обычная скорость падения: фигура смещается вниз раз в 600 мс */
const DROP_INTERVAL_MS = 600

/** Ускоренное падение при зажатой стрелке ↓: раз в 50 мс */
const SOFT_DROP_INTERVAL_MS = 50

/**
 * EAction — типы игровых событий.
 *
 * - Tick — автоматический шаг падения по таймеру
 * - Move — сдвиг фигуры влево (−1) или вправо (+1)
 * - SoftDrop — ускоренное падение на одну клетку (зажата ↓)
 * - HardDrop — мгновенное опускание до упора и фиксация (Пробел)
 * - Rotate — поворот фигуры (↑)
 * - Pause — пауза / снятие паузы (P)
 * - Restart — перезапуск игры (R)
 * - SetBoard — прямая подмена поля (очистка линии через ClearIterator/ClearEffect)
 */
enum EAction {
    Tick = 'TICK',
    Move = 'MOVE',
    SoftDrop = 'SOFT_DROP',
    HardDrop = 'HARD_DROP',
    Rotate = 'ROTATE',
    Pause = 'PAUSE',
    Restart = 'RESTART',
    SetBoard = 'SET_BOARD',
}

/**
 * Action — описание «события», которое произошло в игре.
 *
 * В React reducer-подходе мы не меняем state напрямую, а отправляем action,
 * а reducer решает, как на него отреагировать и вернуть новый state.
 *
 * Union type (|) означает: action может быть одним из нескольких вариантов.
 * Поле `type` — дискриминатор: по нему switch понимает, что именно случилось.
 */
type Action =
    | { type: EAction.Tick }
    | { type: EAction.Move; direction: -1 | 1 }
    | { type: EAction.SoftDrop }
    | { type: EAction.HardDrop }
    | { type: EAction.Rotate }
    | { type: EAction.Pause }
    | { type: EAction.Restart; rows: number; cols: number }
    | { type: EAction.SetBoard; board: Board }

/**
 * Reducer — чистая функция (state + action) → newState.
 *
 * Аналогия: state — текущее фото игры, action — команда игрока/таймера,
 * return — новое фото после выполнения команды.
 *
 * Важно: reducer не должен мутировать старый state и не делает побочных эффектов
 * (не трогает DOM, не ставит таймеры). Только вычисляет новое состояние.
 */
function gameReducer(state: GameState, action: Action, cols: number): GameState {
    switch (action.type) {
        case EAction.Tick:
            // Автоматический шаг вниз (вызывается таймером каждые DROP_INTERVAL_MS)
            return tick(state, cols)
        case EAction.Move:
            return moveHorizontal(state, action.direction)
        case EAction.SoftDrop:
            // Ускоренное падение: тот же шаг вниз, но чаще
            return moveDown(state, cols)
        case EAction.HardDrop:
            // Мгновенное опускание до упора и фиксация фигуры
            return hardDrop(state, cols)
        case EAction.Rotate:
            return rotate(state)
        case EAction.Pause:
            return togglePause(state)
        case EAction.Restart:
            return restart(action.rows, action.cols)
        case EAction.SetBoard:
            return { ...state, board: action.board }
        default:
            return state
    }
}

/** Удаляет пустой ряд `line` и добавляет пустой сверху (блоки «падают»). */
function removeLine(board: Board, line: number): Board {
    const cols = board[0]?.length ?? 0
    const next = board.filter((_, index) => index !== line)
    next.unshift(Array(cols).fill(0))
    return next
}

/**
 * Кастомный хук — функция, имя которой начинается с «use».
 * Её можно вызывать только внутри React-компонентов или других хуков.
 *
 * @param rows — число строк поля (vertica из GameField)
 * @param cols — число столбцов (horizontal из GameField)
 * @param options.sandbox — песочница: пустое поле, без фигуры, на паузе
 * @returns текущее состояние игры; GameField читает его для отрисовки
 */
export function useTetrisGame(
    rows: number,
    cols: number,
    options?: { sandbox?: boolean },
) {
    /**
     * useReducer — альтернатива useState для сложного состояния.
     *
     * Возвращает кортеж [state, dispatch]:
     *  - state  — текущее состояние (board, piece, gameOver, …)
     *  - dispatch — функция отправки action: dispatch({ type: EAction.Rotate })
     *
     * Аргuments useReducer:
     *  1) reducer-функция
     *  2) начальное значение (здесь null — не используется, см. пункт 3)
     *  3) init-функция: вызывается один раз при монтировании и создаёт реальный state
     *
     * Зачем init-функция? Чтобы начальное состояние зависело от rows/cols
     * без лишней логики в теле компонента.
     */
    const sandbox = options?.sandbox === true

    const [state, dispatchBase] = useReducer(
        (currentState: GameState, action: Action) => gameReducer(currentState, action, cols),
        null,
        () => (sandbox ? createSandboxState(rows, cols) : createInitialState(rows, cols)),
    )

    /**
     * useCallback возвращает стабильную ссылку на функцию между ре-рендерами.
     *
     * Без useCallback dispatchBase менялся бы каждый рендер, и useEffect ниже
     * переподписывался бы на клавиатуру заново при каждом падении фигуры.
     *
     * Зависимости [] — функция создаётся один раз за жизнь компонента.
     * dispatchBase от React стабилен, поэтому это безопасно.
     */
    const dispatch = useCallback((action: Action) => dispatchBase(action), [])

    /**
     * useRef — «коробочка» с полем .current, значение сохраняется между ре-рендерами.
     *
     * Отличие от useState: изменение .current НЕ вызывает ре-рендер.
     * Идеально для таймеров, флагов и накопителей времени в игровом цикле.
     */
    const dropAccumulatorRef = useRef(0) // сколько миллисекунд прошло с последнего падения
    const softDropRef = useRef(false) // true, пока зажата стрелка ↓
    /** Актуальный state для clearLine (без устаревшего замыкания). */
    const stateRef = useRef(state)
    stateRef.current = state

    /**
     * Очищает один ряд через итератор мономино и эффект удаления.
     * По умолчанию: BaseClearIterator + ShrinkClearEffect.
     */
    const clearLine = useCallback(
        async (
            line: number,
            iterator: ClearIterator = new BaseClearIterator(),
            effect: ClearEffect = new ShrinkClearEffect(),
        ) => {
            const workingBoard = stateRef.current.board.map((row) => [...row])

            if (line < 0 || line >= workingBoard.length) {
                return
            }

            const commitBoard = (board: Board) => {
                const next = board.map((row) => [...row])
                dispatch({ type: EAction.SetBoard, board: next })
                // Сразу обновляем ref — иначе следующий clearLine увидит старый board.
                stateRef.current = { ...stateRef.current, board: next }
            }

            const api: ClearApi = {
                getBoard: () => workingBoard,
                clearCell: (x, y) => {
                    if (y < 0 || y >= workingBoard.length) {
                        return
                    }

                    const row = workingBoard[y]
                    if (x < 0 || x >= row.length) {
                        return
                    }

                    workingBoard[y] = [...row]
                    workingBoard[y][x] = 0
                    commitBoard(workingBoard)
                },
                getView: (x, y) => getMonominoView(x, y),
            }

            await iterator.iterate(line, workingBoard, effect, api)
            commitBoard(removeLine(workingBoard, line))
        },
        [dispatch],
    )

    const setBoard = useCallback(
        (board: Board) => {
            const next = board.map((row) => [...row])
            dispatch({ type: EAction.SetBoard, board: next })
            stateRef.current = { ...stateRef.current, board: next }
        },
        [dispatch],
    )

    /**
     * useTick — хук из @pixi/react, колбэк вызывается каждый кадр Pixi (~60 fps).
     * Это наш игровой цикл для автоматического падения фигур.
     *
     * ticker.deltaMS — сколько миллисекунд прошло с прошлого кадра.
     * Мы копим их в dropAccumulatorRef и, когда набирается interval, делаем TICK.
     */
    useTick((ticker) => {
        if (state.gameOver || state.paused) {
            return
        }

        dropAccumulatorRef.current += ticker.deltaMS
        const interval = softDropRef.current ? SOFT_DROP_INTERVAL_MS : DROP_INTERVAL_MS

        // while, а не if: если вкладка «лагала», за один кадр может накопиться
        // несколько интервалов — обработаем все, чтобы фигура не «зависала»
        while (dropAccumulatorRef.current >= interval) {
            dropAccumulatorRef.current -= interval
            dispatch({ type: softDropRef.current ? EAction.SoftDrop : EAction.Tick })
        }
    })

    /**
     * useEffect — побочные эффекты: подписки, DOM, таймеры, fetch.
     * Выполняется ПОСЛЕ отрисовки компонента на экран.
     *
     * Возвращаемая cleanup-функция вызывается:
     *  - перед следующим запуском effect (если изменились зависимости)
     *  - при размонтировании компонента
     *
     * Здесь: подписываемся на keydown/keyup при монтировании,
     * отписываемся при размонтировании — иначе утечка памяти и «залипшие» обработчики.
     *
     * Зависимости [cols, dispatch, rows]:
     * effect перезапустится, если изменится размер поля или ссылка на dispatch.
     */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowLeft':
                    event.preventDefault() // не скроллить страницу стрелками
                    dispatch({ type: EAction.Move, direction: -1 })
                    break
                case 'ArrowRight':
                    event.preventDefault()
                    dispatch({ type: EAction.Move, direction: 1 })
                    break
                case 'ArrowDown':
                    event.preventDefault()
                    softDropRef.current = true
                    dropAccumulatorRef.current = SOFT_DROP_INTERVAL_MS
                    dispatch({ type: EAction.SoftDrop })
                    break
                case 'ArrowUp':
                    event.preventDefault()
                    dispatch({ type: EAction.Rotate })
                    break
                case 'Space':
                    event.preventDefault()
                    dispatch({ type: EAction.HardDrop })
                    dropAccumulatorRef.current = 0
                    break
                case 'KeyP':
                    event.preventDefault()
                    dispatch({ type: EAction.Pause })
                    dropAccumulatorRef.current = 0
                    softDropRef.current = false
                    break
                case 'KeyR':
                    dispatch({ type: EAction.Restart, rows, cols })
                    dropAccumulatorRef.current = 0
                    break
                default:
                    break
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'ArrowDown') {
                // Отпустили ↓ — возвращаем обычную скорость падения
                softDropRef.current = false
                dropAccumulatorRef.current = 0
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [cols, dispatch, rows])

    // Компонент GameField получает state и перерисовывает поле при каждом изменении
    const togglePauseGame = useCallback(() => {
        dispatch({ type: EAction.Pause })
        dropAccumulatorRef.current = 0
        softDropRef.current = false
    }, [dispatch])

    return { state, togglePause: togglePauseGame, clearLine, setBoard }
}
