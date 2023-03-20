import { genericsUtils } from './generic.utils'

const getNodeUniqueFonts = (node: TextNode, uniqueFonts: Array<FontName | typeof figma.mixed>): Array<FontName> => {
    if (node.fontName !== undefined 
        && node.fontName !== null 
        && node.fontName !== figma.mixed) { 
        uniqueFonts.push(node.fontName)
    }
    return uniqueFonts as Array<FontName>
}

const generateFontPaletteFrame = async (fontsArr: FontName[]) => {
    if (!fontsArr.length) return
    // Create a new frame
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Fonts'
    // Resize the frame to fit all the text nodes
    fontDisplayFrame.resize(150, fontsArr.length * 50)

    await loadFontsFromArray(fontsArr)
    
    let yOffset = 0
    for (const fontNameObj of fontsArr) {
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

async function loadFontsFromArray(filteredFontsArr: FontName[]) {
    for (const fontNameObj of filteredFontsArr) {
        console.log('Loading font:', fontNameObj)
        figma.loadFontAsync(fontNameObj)
        console.log('Font loaded')
        
    }
}

