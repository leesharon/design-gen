figma.showUI(__html__)
console.log('figma: ', figma)

figma.skipInvisibleInstanceChildren = true

const selection = figma.currentPage.selection
console.log('selection:', selection)

const generateColorPalette = (colors: string[]) => {
    // Create a new FrameNode
    const colorDisplayFrame = figma.createFrame()
    colorDisplayFrame.name = 'Colors'
    colorDisplayFrame.resize(150, colors.length * 50) // Adjust the size based on the number of unique colors

    // Create RectangleNodes for each unique color and add them to the FrameNode
    let yOffset = 0
    colors.forEach((colorString) => {
        const colorArray = colorString.split(',').map(parseFloat)
        const color: RGB = { r: colorArray[0], g: colorArray[1], b: colorArray[2] }

        const rectangle = figma.createRectangle()
        rectangle.name = `Color: ${colorString}`
        rectangle.resize(150, 50)
        rectangle.y = yOffset
        yOffset += 50 // Adjust the offset for the next rectangle

        rectangle.fills = [{ type: 'SOLID', color }]
        colorDisplayFrame.appendChild(rectangle)
    })

    // Add the FrameNode to the current page
    figma.currentPage.appendChild(colorDisplayFrame)
    figma.viewport.scrollAndZoomIntoView([colorDisplayFrame])
}

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
    generateColorPalette([...uniqueColors])
}

const getFillColors = (paint: any) => {
    if (paint.type === 'SOLID') {
        const { r, g, b } = paint.color
        const colorString = `${r},${g},${b}`
        uniqueColors.add(colorString)
    }
}

const uniqueColors = new Set<string>()
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
