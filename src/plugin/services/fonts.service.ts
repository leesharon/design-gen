import { APP_PRIMARY_FONT_NAME, APP_SECONDARY_FONT_NAME, DESCRIPTION_TEXT_GAP } from '../../constants/strings';
import { genericsUtils } from './generic.utils'

const generateFontPaletteFrame = async (fontsStrSet: Set<string>) => {
    if (!fontsStrSet.size) return
    const fontObjectsArraySorted = sortFontsArray(transformFontsStrSetToObjectArray(fontsStrSet))
    // Create a new frame
    const fontDisplayFrame = figma.createFrame()
    fontDisplayFrame.name = 'Fonts'
    const lineHeight = 100
    const frameWidth = 2000
    const frameHeight = fontsStrSet.size * lineHeight
    // Resize the frame to fit all the text nodes
    fontDisplayFrame.resize(frameWidth, frameHeight)
    let yOffset = 100
    const yIncrement = fontObjectsArraySorted[0].fontSize + 10
    const xOffset = 100

    // Create a new title text node
    const pageTitleTextNode = await createTextNode({ content: 'Typography', fontSize: 50, font: APP_PRIMARY_FONT_NAME, x: xOffset, y: yOffset })
    fontDisplayFrame.appendChild(pageTitleTextNode)
    yOffset += pageTitleTextNode.height + 10

    // Create an underline node for the title
    const separatorLineNode = createSeparatorLineNode(frameWidth, xOffset, yOffset);
    fontDisplayFrame.appendChild(separatorLineNode)
    yOffset += separatorLineNode.height * 2 + DESCRIPTION_TEXT_GAP

    const pageDescriptionTextNode = await createTextNode({ content: 'Fonts we are using in the system', fontSize: 20, font: APP_SECONDARY_FONT_NAME, x: xOffset, y: yOffset })
    fontDisplayFrame.appendChild(pageDescriptionTextNode)
    yOffset += pageDescriptionTextNode.height + DESCRIPTION_TEXT_GAP

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
        setNodeProperties(newTextNode, frameWidth, lineHeight, yOffset, xOffset)
        yOffset += yIncrement

        fontDisplayFrame.appendChild(newTextNode)
    }
    genericsUtils.createNewPageFromFrame(fontDisplayFrame)
}

function createSeparatorLineNode(frameWidth: number, xOffset: number, yOffset: number) {
    const separatorLineNode = figma.createLine();
    separatorLineNode.resize(frameWidth - (xOffset * 2), 0);
    console.log('here');
    separatorLineNode.x = xOffset;
    separatorLineNode.y = yOffset + 10;
    separatorLineNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    separatorLineNode.strokeWeight = 5;
    console.log('here');
    return separatorLineNode;
}

function setNodeProperties(newTextNode: TextNode, frameWidth: number, lineHeight: number, y: number, x: number): void {
    newTextNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    newTextNode.textAlignHorizontal = 'LEFT'
    newTextNode.textAlignVertical = 'CENTER'
    newTextNode.resize(frameWidth, lineHeight)
    newTextNode.y = y
    newTextNode.x = x
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
async function createTextNode(params: { content: string, font: FontName, fontSize: number, x: number, y: number }): Promise<TextNode> {
    // Create a new text node
    const newTextNode = figma.createText()
    await figma.loadFontAsync(params.font)
    newTextNode.fontName = params.font
    newTextNode.fontSize = params.fontSize
    newTextNode.characters = params.content
    newTextNode.x = params.x
    newTextNode.y = params.y

    return newTextNode
}

