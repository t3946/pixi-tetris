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
            <layoutContainer
                layout={{
                    width: '25%',
                    backgroundColor: 'white',
                }}
            />

            <layoutContainer
                layout={{
                    width: '50%',
                    backgroundColor: 'white',
                }}
            />

            <layoutContainer
                layout={{
                    width: '25%',
                    backgroundColor: 'white',
                }}
            />
        </layoutContainer>
    )
}