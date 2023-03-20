
const getNodeUniqueFonts = (node: TextNode, uniqueFonts: Set<FontName | typeof figma.mixed>): Set<FontName | typeof figma.mixed> => {
    if (node.fontName !== undefined && node.fontName !== null) {
        const fontString = node.fontName
        uniqueFonts.add(fontString)
    }
    return uniqueFonts
}

export const fontsUtils = {
    getNodeUniqueFonts,
}
