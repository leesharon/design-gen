import { genericsUtils } from './utils.service'

const generateFontPaletteFrame = async (fontsSet: Set<string>) => {
    if (!fontsSet.size) return
    // Create a new frame
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Fonts'

    // Resize the frame to fit all the text nodes
    fontDisplayFrame.resize(150, fontsSet.size * 50)

    let yOffset = 0
    for (const appTextNodeStr of fontsSet) {
        const appTextNode: AppTextNode = JSON.parse(appTextNodeStr)

        // Create a new text node
        const newTextNode = figma.createText()

        // Load the font if it exists, otherwise skip it
        if (!await doesFontExist(appTextNode.fontName)) continue

        // Set the font family, style and size
        newTextNode.fontName = appTextNode.fontName
        newTextNode.fontSize = appTextNode.fontSize

        // Set the text content to indicate the font family
        newTextNode.characters = genericsUtils.getAppTextNodeTitle(appTextNode)

        // Set the text color and alignment
        newTextNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
        newTextNode.textAlignHorizontal = 'LEFT'
        newTextNode.textAlignVertical = 'CENTER'
        newTextNode.resize(150, 50)
        newTextNode.y = yOffset
        yOffset += 50

        console.log('textNode:', newTextNode)

        fontDisplayFrame.appendChild(newTextNode)
    }
    genericsUtils.createNewPageFromFrame(fontDisplayFrame)
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

export const fontsUtils = {
    generateFontPaletteFrame,
}
