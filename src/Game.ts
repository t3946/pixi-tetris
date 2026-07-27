import '@pixi/layout'
import { Application, isMobile } from 'pixi.js'
import { LayoutContainer } from '@pixi/layout/components'
import { GridComponent } from '@components/Grid/Grid.container.ts'

export class Game {
    app: Application
    staticResolution = { w: 9, h: 19.5 }
    mainContainer: LayoutContainer
    header: LayoutContainer
    body: LayoutContainer
    footer: LayoutContainer

    constructor(app: Application) {
        this.app = app

        const { width, height } = this.computeMainSize()

        this.mainContainer = new LayoutContainer({
            layout: {
                width,
                height,
                flexDirection: 'column',
                backgroundColor: 'white',
            },
        })

        this.header = new LayoutContainer({
            layout: {
                width: '100%',
                height: '10%',
                flexShrink: 0,
            },
        })

        this.body = new LayoutContainer({
            layout: {
                width: '100%',
                flex: 1,
                overflow: 'hidden',
            },
        })

        this.footer = new LayoutContainer({
            layout: {
                width: '100%',
                height: '10%',
                flexShrink: 0,
            },
        })

        const gridComponent = new GridComponent(app, height / 2)
        gridComponent.layout = true

        this.body.addChild(gridComponent)
        this.mainContainer.addChild(this.header, this.body, this.footer)
        this.app.stage.addChild(this.mainContainer)

        this.adoptMainContainerSize()
        this.app.renderer.on('resize', this.adoptMainContainerSize)
    }

    computeMainSize() {
        const height = this.app.canvas.height
        let width: number

        if (isMobile.phone) {
            width = this.app.canvas.width
        } else {
            const { w, h } = this.staticResolution
            width = height * (w / h)
        }

        return { width, height }
    }

    adoptMainContainerSize = () => {
        console.log('adoptMainContainerSize')
        const { width, height } = this.computeMainSize()

        this.app.stage.layout = {
            width: this.app.screen.width,
            height: this.app.screen.height,
            justifyContent: 'center',
            alignItems: 'center',
        }

        this.mainContainer.layout = {
            width,
            height,
            flexDirection: 'column',
            backgroundColor: 'white',
        }
    }
}
