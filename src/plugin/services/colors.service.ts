import { colorSortingService } from './color-sorting.service';
/* eslint-disable indent */
import { genericsUtils } from './generic.utils'

const generateColorPaletteFrame = (colors: Set<string>): PageNode => {
    if (!colors.size) return
    const colorDisplayFrame = figma.createFrame()
    colorDisplayFrame.name = 'Colors'
    colorDisplayFrame.resize(400, colors.size * 50)

    let sortedColors = colorSortingService.sortColorsByHueAndLuminance([...colors])
    sortedColors = colorSortingService.filterDuplicateColors(sortedColors)

    let yOffset = 0
    sortedColors.forEach((colorString) => {
        const colorArray = colorString.split(',').map(parseFloat)
        const [r, g, b] = colorArray
        const color: RGB = { r, g, b }

        const rectangle = figma.createRectangle()
        rectangle.name = genericsUtils.decimalRgbToHex(r, g, b)
        rectangle.resize(240, 32)
        rectangle.cornerRadius = 4
        rectangle.y = yOffset
        yOffset += 40

        rectangle.fills = [{ type: 'SOLID', color }]
        colorDisplayFrame.appendChild(rectangle)
    })
    return genericsUtils.createNewPageFromFrame(colorDisplayFrame)
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