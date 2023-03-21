import { genericsUtils } from './generic.utils'

const generateFontPaletteFrame = async (fontsStrSet: Set<string>) => {
    if (!fontsStrSet.size) return
    // Create a new frame
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Fonts'
    const frameWidth = 2000
    const lineHeight = 100
    const frameHeight = fontsStrSet.size * lineHeight

    const fontObjectsArraySorted = sortFontsArray(transformFontsStrSetToObjectArray(fontsStrSet))

    // Resize the frame to fit all the text nodes
    fontDisplayFrame.resize(frameWidth, frameHeight)

    let yOffset = 0
    for (const appTextNode of fontObjectsArraySorted) {
        // Create a new text node
        const newTextNode = figma.createText()

        // Load the font if it exists, otherwise skip it
        if (!await doesFontExist(appTextNode.fontName)) continue

        // Set the font family, style and size
        newTextNode.fontName = appTextNode.fontName
        newTextNode.fontSize = appTextNode.fontSize

        // Set the text content to indicate the font family
        newTextNode.characters = getAppTextNodeTitle(appTextNode)

        // Set the text color and alignment
        newTextNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
        newTextNode.textAlignHorizontal = 'LEFT'
        newTextNode.textAlignVertical = 'CENTER'
        newTextNode.resize(frameWidth, lineHeight)
        newTextNode.y = yOffset
        yOffset += 50

        fontDisplayFrame.appendChild(newTextNode)
    }
    genericsUtils.createNewPageFromFrame(fontDisplayFrame)
}

async function doesFontExist(fontNameObj: FontName): Promise<boolean> {
    let doesFontExist = false
    await figma.loadFontAsync(fontNameObj).then(() => {
        doesFontExist = true
    }).catch(() => {
        console.log('Font not found:', fontNameObj)
        doesFontExist = false
    })
    return doesFontExist
}

function getAppTextNodeTitle(appFontNode: AppTextNode): string {
    return `${appFontNode.fontFamily} / ${appFontNode.fontStyle} / ${appFontNode.fontSize}`
}

function sortFontsArray(fontsArr: AppTextNode[]) {
    const fontsArrSorted = fontsArr.sort((firstFontObj, secondFontObj) => {
        const fontSizeCompare = genericsUtils.compare2ofType(firstFontObj.fontSize, secondFontObj.fontSize, true)
        if (fontSizeCompare !== 0) return fontSizeCompare
        const fontFamilyCompare = genericsUtils.compare2ofType(firstFontObj.fontFamily, secondFontObj.fontFamily, true)
        if (fontFamilyCompare !== 0) return fontFamilyCompare
        return genericsUtils.compare2ofType(firstFontObj.fontStyle, secondFontObj.fontStyle, false)
    })
    return fontsArrSorted
}

function transformFontsStrSetToObjectArray(fontsStrArr: Set<string>) {
    const fontsObjectArr: AppTextNode[] = []
    for (const fontStr of fontsStrArr) {
        const fontObj: AppTextNode = JSON.parse(fontStr)
        fontsObjectArr.push(fontObj)
    }
    return fontsObjectArr
}

export const fontsUtils = {
    generateFontPaletteFrame,
}
