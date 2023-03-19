figma.showUI(__html__)
console.log('figma: ', figma)

figma.skipInvisibleInstanceChildren = true

const selection = figma.currentPage.selection
console.log('selection:', selection)

const getNodesUniqueColors = (nodes: readonly SceneNode[]) => {
    if (!nodes.length) return
    for (const node of nodes) {
        if ((!('fills' in node)) || !(Array.isArray(node.fills))) continue

        for (const paint of node.fills) {
            getFillColors(paint)
        }
        const { type } = node
        if (
            type === 'FRAME' ||
            type === 'COMPONENT' ||
            type === 'INSTANCE'
        ) {
            getNodesUniqueColors(node.children as SceneNode[])
        }
    }
}

const getFillColors = (paint: any) => {
    if (paint.type === 'SOLID') {
        const { r, g, b } = paint.color
        const colorString = `${r},${g},${b}`
        uniqueColors.add(colorString)
    }
}

const uniqueColors = new Set()
getNodesUniqueColors(selection)

const allColors = [...uniqueColors]
console.log(`All colors in selection: ${allColors.join(', ')}`)

figma.ui.onmessage = (msg) => {
    if (msg.type === 'create-rectangles') {
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

    figma.closePlugin()
}
