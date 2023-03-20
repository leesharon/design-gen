/* eslint-disable indent */
import { genericsUtils } from './utils.service'

const generateColorPaletteFrame = (colors: Set<string>) => {
    if (!colors.size) return
    const colorDisplayFrame = figma.createFrame()
    colorDisplayFrame.name = 'Colors'
    colorDisplayFrame.resize(150, colors.size * 50)

    let yOffset = 0
    colors.forEach((colorString) => {
        const colorArray = colorString.split(',').map(parseFloat)
        const [r, g, b] = colorArray
        const color: RGB = { r, g, b }

        const rectangle = figma.createRectangle()
        rectangle.name = genericsUtils.decimalRgbToHex(r, g, b)
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
            switch (paint.type) {
                case 'SOLID':
                    addRgbToSet(paint.color, uniqueColors)
            }
        }
    }
    if ('strokes' in node && Array.isArray(node.strokes)) {
        for (const paint of node.strokes) {
            switch (paint.type) {
                case 'SOLID':
                    addRgbToSet(paint.color, uniqueColors)
            }
        }
    }
}

function addRgbToSet(rgb: RGB, uniqueColors: Set<string>) {
    const { r, g, b } = rgb
    const colorString = `${r.toFixed(3)},${g.toFixed(3)},${b.toFixed(3)}`
    uniqueColors.add(colorString)
}

export const colorsUtils = {
    generateColorPaletteFrame,
    getAllUniqueColors,
}
