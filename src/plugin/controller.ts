import { colorsUtils } from './utils/colors.utils'

/* eslint-disable indent */
figma.showUI(__html__)
console.log('figma: ', figma)

figma.skipInvisibleInstanceChildren = true

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case 'generate-design-system':
            generateDesignSystem()
            break
        default:
            break
    }

    figma.closePlugin()
}

function generateDesignSystem() {
    const { selection } = figma.currentPage
    console.log('selection:', selection)

    const uniqueColors = new Set<string>()

    const iterateThroughAllNodes = (nodes: readonly SceneNode[]) => {
        if (!nodes.length) return
        for (const node of nodes) {

            // Gets All Colors for the Palette
            colorsUtils.getAllUniqueColors(node, uniqueColors)

            // Handles nested children nodes
            const { type } = node
            if (type === 'FRAME' ||
                type === 'COMPONENT' ||
                type === 'INSTANCE'

            ) iterateThroughAllNodes(node.children as SceneNode[])
        }
    }

    iterateThroughAllNodes(selection)
    const colorDisplayFrame = colorsUtils.generateColorPaletteFrame([...uniqueColors])

    figma.currentPage.appendChild(colorDisplayFrame)
    figma.viewport.scrollAndZoomIntoView([colorDisplayFrame])
    figma.currentPage.selection = [colorDisplayFrame]

    figma.ui.postMessage({
        type: 'generate-design-system',
        msg: 'Created design system! Rectangles',
    })
}

function createRectangles(msg: { count: number }) {
    const nodes = []

    for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle()
        rect.x = i * 150
        rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
        figma.currentPage.appendChild(rect)
        nodes.push(rect)
    }

    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)

    // This is how figma responds back to the ui
    figma.ui.postMessage({
        type: 'create-rectangles',
        message: `Created ${msg.count} Rectangles`,
    })
}
