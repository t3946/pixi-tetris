import { NextTetrominoes } from '@components/GameDashboard/NextTetrominoes.tsx'
import { Panel } from '@components/ui/Panel.tsx'

export const GameDashboard = function () {
    return (
        <layoutContainer
            layout={{
                gap: '2%',
                padding: '0',
                paddingStart: '7%',
                paddingEnd: '7%',
                height: '80',
            }}
        >
            <Panel title="Рядов" layout={{ width: '25%', height: '100%' }} />

            <Panel title="Счёт" layout={{ width: '50%', height: '100%' }} />

            <Panel title="Далее" layout={{ width: '25%', height: '100%' }}>
                <NextTetrominoes />
            </Panel>
        </layoutContainer>
    )
}
