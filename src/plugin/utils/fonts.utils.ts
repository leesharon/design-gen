import { genericsUtils } from './generic.utils'

const getNodeUniqueFonts = (node: TextNode, uniqueFonts: Set<FontName | typeof figma.mixed>): Set<FontName | typeof figma.mixed> => {
    if (node.fontName !== undefined && node.fontName !== null) {
        const fontString = node.fontName
        uniqueFonts.add(fontString)
    }
    return uniqueFonts
}

const generateFontPaletteFrame = async (fontsArr: Array<FontName | typeof figma.mixed>) => {
    if (!fontsArr.length) return

    // Create a new frame
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Fonts'
    // Resize the frame to fit all the text nodes
    fontDisplayFrame.resize(150, fontsArr.length * 50)

    let yOffset = 0
    for (const fontNameObj of fontsArr) {
        if (fontNameObj === figma.mixed) {
            console.log('Skipping mixed font:', fontNameObj)
            continue
        }

        // Load the relevant font
        await figma.loadFontAsync(fontNameObj)

        // Create a new text node
        const textNode = figma.createText()

        // Set the font family, style and size
        textNode.fontName = fontNameObj
        textNode.fontSize = 16

        // Set the text content to indicate the font family
        textNode.characters = fontNameObj.family

        // Set the text color and alignment
        textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
        textNode.textAlignHorizontal = 'CENTER'
        textNode.textAlignVertical = 'CENTER'
        textNode.resize(150, 50)
        textNode.y = yOffset
        yOffset += 50

        fontDisplayFrame.appendChild(textNode)
    }
    genericsUtils.createNewPageFromFrame(fontDisplayFrame)
}

export const fontsUtils = {
    getNodeUniqueFonts,
    generateFontPaletteFrame,
}

