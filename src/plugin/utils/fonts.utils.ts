import { genericsUtils } from './generic.utils'

const getNodeUniqueFonts = (node: TextNode, uniqueFonts: Set<FontName | typeof figma.mixed>): Set<FontName | typeof figma.mixed> => {
    if (node.fontName !== undefined && node.fontName !== null) {
        const fontString = node.fontName
        uniqueFonts.add(fontString)
    }
    return uniqueFonts
}

const generateFontPaletteFrame = async (fontObjs: Array<FontName | typeof figma.mixed>) => {
    console.log('fontObjs:', fontObjs)
    
    
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Fonts'
    fontDisplayFrame.resize(150, max(fontObjs.length * 50, 400))
    
    let yOffset = 0
    for (const fontObj of fontObjs) {
        if(fontObj === figma.mixed) {
            console.log('Skipping mixed font:', fontObj)
            continue
        }

        await figma.loadFontAsync(fontObj)
        
        // Create a new text node
        const textNode = figma.createText()
        
        // Set the text content
        textNode.fontName = fontObj
        textNode.characters = fontObj.family
        console.log(fontObjs[0])
        
        // Set the font family and size
        // textNode.fontName = fontObj
        textNode.fontSize = 16

        // Set the text color and alignment
        textNode.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
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
function max(arg0: number, arg1: number): number {
    return arg0 > arg1 ? arg0 : arg1
}

