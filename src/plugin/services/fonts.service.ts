import { genericsUtils } from './utils.service'

const generateFontPaletteFrame = async (fontsArr: FontName[]) => {
    if (!fontsArr.length) return
    // Create a new frame
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Fonts'
    // Resize the frame to fit all the text nodes
    fontDisplayFrame.resize(150, fontsArr.length * 50)

    let yOffset = 0
    for (const fontNameObj of fontsArr) {
        // Create a new text node
        const textNode = figma.createText()

        // Load the font if it exists, otherwise skip it
        if (!await doesFontExist(fontNameObj)) continue

        // Set the font family, style and size
        textNode.fontName = fontNameObj
        textNode.fontSize = 16

        // Set the text content to indicate the font family
        textNode.characters = `${fontNameObj.family}, ${fontNameObj.style}`

        // Set the text color and alignment
        textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
        textNode.textAlignHorizontal = 'CENTER'
        textNode.textAlignVertical = 'CENTER'
        textNode.resize(150, 50)
        textNode.y = yOffset
        yOffset += 50

        console.log('textNode:', textNode)

        fontDisplayFrame.appendChild(textNode)
    }
    genericsUtils.createNewPageFromFrame(fontDisplayFrame)
}

export const fontsUtils = {
    generateFontPaletteFrame,
}

async function doesFontExist(fontNameObj: FontName): Promise<boolean> {
    let doesFontExist = false
    await figma.loadFontAsync(fontNameObj).then(() => {
        console.log('Font loaded:', fontNameObj)
        doesFontExist = true
    }).catch(() => {
        console.log('Font not found:', fontNameObj)
        doesFontExist = false
    })
    return doesFontExist
}

