import { genericsUtils } from './generic.utils'

const generateColorPaletteFrame = (colors: string[]) => {
    const colorDisplayFrame = figma.createFrame()
    colorDisplayFrame.name = 'Colors'
    colorDisplayFrame.resize(150, colors.length * 50)

    // Create RectangleNodes for each unique color and add them to the FrameNode
    let yOffset = 0
    colors.forEach((colorString) => {
        const colorArray = colorString.split(',').map(parseFloat)
        const [r, g, b] = colorArray
        const color: RGB = { r, g, b }

        const rectangle = figma.createRectangle()
        rectangle.name = `Color: ${genericsUtils.decimalRgbToHex(r, g, b)}`
        rectangle.resize(150, 50)
        rectangle.y = yOffset
        yOffset += 50

        rectangle.fills = [{ type: 'SOLID', color }]
        colorDisplayFrame.appendChild(rectangle)
    })
    genericsUtils.createNewPageFromFrame(colorDisplayFrame)
}


const getAllUniqueColors = (node: SceneNode, uniqueColors: Set<string>) => {
    if ('fills' in node && Array.isArray(node.fills)) {
        for (const paint of node.fills) {
            if (paint.type === 'SOLID') {
                const { r, g, b } = paint.color
                const colorString = `${r},${g},${b}`
                uniqueColors.add(colorString)
            }
        }
    }
}

export const colorsUtils = {
    generateColorPaletteFrame,
    getAllUniqueColors,
}
