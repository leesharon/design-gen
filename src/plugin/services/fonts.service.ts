import { DESCRIPTION_TEXT_GAP, initialXOffset, initialYOffset } from '../../constants/numbers';
import { APP_PRIMARY_FONT_NAME, APP_REGULAR_FONT_NAME, APP_SECONDARY_FONT_NAME } from '../../constants/strings';
import { genericsUtils } from './generic.utils'
import { createSeparatorLineNode, createTextNode, setNodeProperties } from './textFunctions';

const generateFontPaletteFrame = async (
    fontsStrSet: Set<string>,
    fontSizes: number[],
    fontWeights: number[]
): Promise<PageNode> => {
    if (!fontsStrSet.size) return

    const fontObjectsArraySorted = sortFontsArray(transformFontsStrSetToObjectArray(fontsStrSet))
    // Create a new frame
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Typography'
    const lineHeight = 100
    let yOffset = initialYOffset
    const yIncrement = fontObjectsArraySorted[0].fontSize + 10
    const xOffset = initialXOffset
    const frameWidth = fontObjectsArraySorted[0].fontSize * getAppTextNodeTitle(fontObjectsArraySorted[0]).length + xOffset * 2
    const frameHeight = fontsStrSet.size * lineHeight + 400

    // Create a new title text node
    const pageTitleTextNode = await createTextNode({ content: fontDisplayFrame.name, fontSize: 50, font: APP_PRIMARY_FONT_NAME, x: xOffset, y: yOffset })
    fontDisplayFrame.appendChild(pageTitleTextNode)
    yOffset += pageTitleTextNode.height + 10

    // Create an underline node for the title
    const separatorLineNode = createSeparatorLineNode(frameWidth, xOffset, yOffset);
    fontDisplayFrame.appendChild(separatorLineNode)
    yOffset += separatorLineNode.height * 2 + DESCRIPTION_TEXT_GAP

    const pageDescriptionTextNode = await createTextNode({ content: 'This page contains a list of all the fonts used in this design.', fontSize: 20, font: APP_SECONDARY_FONT_NAME, x: xOffset, y: yOffset })
    fontDisplayFrame.appendChild(pageDescriptionTextNode)
    yOffset += pageDescriptionTextNode.height + DESCRIPTION_TEXT_GAP

    const pageFontWeightDescriptionTextNode = await createTextNode({ content: `Weights used : ${fontWeights.join(', ')}`, fontSize: 20, font: APP_REGULAR_FONT_NAME, x: xOffset, y: yOffset })
    fontDisplayFrame.appendChild(pageFontWeightDescriptionTextNode)
    yOffset += pageFontWeightDescriptionTextNode.height + DESCRIPTION_TEXT_GAP

    const pageFontSizesDescriptionTextNode = await createTextNode({ content: `Font sizes used : ${fontSizes.join(', ')}`, fontSize: 20, font: APP_REGULAR_FONT_NAME, x: xOffset, y: yOffset })
    fontDisplayFrame.appendChild(pageFontSizesDescriptionTextNode)
    yOffset += pageFontSizesDescriptionTextNode.height + DESCRIPTION_TEXT_GAP

    const separatorLineNode2 = createSeparatorLineNode(frameWidth, xOffset, yOffset);
    fontDisplayFrame.appendChild(separatorLineNode2)
    yOffset += separatorLineNode2.height * 2 + DESCRIPTION_TEXT_GAP

    // Resize the frame to fit all the text nodes
    fontDisplayFrame.resize(frameWidth, frameHeight)

    // Create a new text node for each font
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
        setNodeProperties(newTextNode, frameWidth, lineHeight, xOffset, yOffset, null)
        yOffset += yIncrement

        fontDisplayFrame.appendChild(newTextNode)
    }
    return genericsUtils.createNewPageFromFrame(fontDisplayFrame)
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

function getAppTextNodeTitle(appFontNode: AppFontNode): string {
    return `${appFontNode.family} / ${appFontNode.style} / ${appFontNode.fontSize}`
}

function sortFontsArray(fontsArr: AppFontNode[]) {
    const fontsArrSorted = fontsArr.sort((firstFontObj, secondFontObj) => {
        const fontSizeCompare = genericsUtils.compare2ofType(firstFontObj.fontSize, secondFontObj.fontSize, true)
        if (fontSizeCompare !== 0) return fontSizeCompare
        const fontFamilyCompare = genericsUtils.compare2ofType(firstFontObj.family, secondFontObj.family, true)
        if (fontFamilyCompare !== 0) return fontFamilyCompare
        return genericsUtils.compare2ofType(firstFontObj.style, secondFontObj.style, false)
    })
    return fontsArrSorted
}

function transformFontsStrSetToObjectArray(fontsStrArr: Set<string>) {
    const fontsObjectArr: AppFontNode[] = []
    for (const fontStr of fontsStrArr) {
        const fontObj: AppFontNode = JSON.parse(fontStr)
        fontsObjectArr.push(fontObj)
    }
    return fontsObjectArr
}

export const fontsUtils = {
    generateFontPaletteFrame,
}

