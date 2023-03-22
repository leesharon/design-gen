import { DESCRIPTION_TEXT_GAP, initialXOffset, initialYOffset } from '../../constants/numbers';
import { APP_PRIMARY_FONT_NAME, APP_SECONDARY_FONT_NAME } from '../../constants/strings';
import { colorSortingService } from './color-sorting.service';
import { genericsUtils } from './generic.utils'
import { createSeparatorLineNode, createTextNode, setNodeProperties } from './textFunctions';

const generateColorPaletteFrame = async (colors: Set<string>): Promise<PageNode> => {
    if (!colors.size) return
    const blackRGB: RGB = { r: 0, g: 0, b: 0 }
    const whiteRGB: RGB = { r: 1, g: 1, b: 1 }

    // Set the width and height of a color rectangle
    const rectangleWidth = 400;
    const rectangleHeight = 64;

    const itemsPerRow = 10
    const gap = 20
    const minFrameWidth = 720
    const lineHeight = rectangleHeight + gap
    const columnWidth = rectangleWidth + gap

    // Create a frame to hold the color palette
    const colorDisplayFrame = figma.createFrame()
    colorDisplayFrame.name = 'Color Palette'

    let sortedColors = colorSortingService.sortColorsByHueAndLuminance([...colors])
    sortedColors = colorSortingService.filterDuplicateColors(sortedColors)

    let yOffset = initialYOffset
    let xOffset = initialXOffset
    const yIncrement = lineHeight
    const xIncrement = columnWidth

    // Calculate the frame width
    const frameWidth = Math.max(columnWidth * (Math.floor(colors.size / itemsPerRow) + 1) + initialXOffset * 2 - gap, minFrameWidth)
    // Create a new title text node
    const pageTitleTextNode = await createTextNode({ content: colorDisplayFrame.name, fontSize: 50, font: APP_PRIMARY_FONT_NAME, x: xOffset, y: yOffset })
    yOffset += pageTitleTextNode.height + DESCRIPTION_TEXT_GAP

    // Create an underline node for the title
    const separatorLineNode = createSeparatorLineNode(frameWidth, xOffset, yOffset);
    yOffset += separatorLineNode.height + DESCRIPTION_TEXT_GAP

    const pageDescriptionTextNode = await createTextNode({ content: 'This page contains a list of all the colors used in this design.', fontSize: 20, font: APP_SECONDARY_FONT_NAME, x: xOffset, y: yOffset })
    yOffset += pageDescriptionTextNode.height + DESCRIPTION_TEXT_GAP

    // Calculate the frame height
    let frameHeight = yOffset + initialYOffset;
    if (colors.size < itemsPerRow) {
        frameHeight += (rectangleHeight + gap) * colors.size
    } else {
        frameHeight += (rectangleHeight + gap) * itemsPerRow
    }

    // Resize the frame
    colorDisplayFrame.resize(frameWidth, frameHeight)

    colorDisplayFrame.appendChild(pageTitleTextNode)
    colorDisplayFrame.appendChild(separatorLineNode)
    colorDisplayFrame.appendChild(pageDescriptionTextNode)

    const heightOfHeader = yOffset

    let colorIndex = 0

    // Create a new rectangle for each color
    for (const colorString of sortedColors) {
        // Add a new row of rectangles if the current row is full
        if (colorIndex % itemsPerRow === 0 && colorIndex !== 0) {
            xOffset += xIncrement
            yOffset = heightOfHeader
        }

        // Convert the color string to an RGB object
        const color = genericsUtils.hexStringColorToRGB(colorString)
        const colorHexValue = genericsUtils.decimalRgbToHex(color.r, color.g, color.b)

        const hexTextColor = genericsUtils.isColorOnTheBrightSide(colorHexValue) ? blackRGB : whiteRGB

        // Create rectangle node
        const rectangle = figma.createRectangle()
        rectangle.name = colorHexValue
        rectangle.resize(rectangleWidth, rectangleHeight)
        rectangle.cornerRadius = 8
        rectangle.y = yOffset
        rectangle.x = xOffset

        // Add the color to the rectangle
        rectangle.fills = [{ type: 'SOLID', color }]
        colorDisplayFrame.appendChild(rectangle)

        // Create a text node for the color hex value
        const colorHexValueTextNode = await createTextNode({ content: colorHexValue, fontSize: 22, font: APP_SECONDARY_FONT_NAME, x: xOffset, y: yOffset })
        setNodeProperties(colorHexValueTextNode, rectangleWidth - gap, rectangleHeight, rectangle.x, rectangle.y, 'RIGHT')

        // Add the color to the text node
        colorHexValueTextNode.fills = [{ type: 'SOLID', color: hexTextColor }]
        colorDisplayFrame.appendChild(colorHexValueTextNode)

        // Increment iteration variables
        colorIndex++
        yOffset += yIncrement
    }
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
