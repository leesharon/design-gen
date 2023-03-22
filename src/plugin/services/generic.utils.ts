function rgbToHex(r: number, g: number, b: number): string {
    return (
        '#' +
        [r, g, b]
            .map((x) => {
                const hex = x.toString(16)
                return hex.length === 1 ? '0' + hex : hex
            })
            .join('')
    )
}

function hexStringColorToRGB(colorString: string) {
    const colorArray = colorString.split(',').map(parseFloat)
    const [r, g, b] = colorArray
    const rgbColor: RGB = { r, g, b }
    console.log('rgbColor in function', rgbColor);

    return rgbColor
}

function decimalRgbToHex(r: number, g: number, b: number): string {
    const rInt = Math.round(r * 255)
    const gInt = Math.round(g * 255)
    const bInt = Math.round(b * 255)
    return rgbToHex(rInt, gInt, bInt)
}

function createNewPageFromFrame(frame: FrameNode): PageNode {
    const newPage = figma.createPage()
    newPage.name = frame.name
    newPage.appendChild(frame)
    figma.root.appendChild(newPage)
    return newPage
}

function compare2ofType<T>(a: T, b: T, isReverse = false): number {
    const reverse = isReverse ? -1 : 1
    if (a > b) return 1 * reverse
    if (a < b) return -1 * reverse
    return 0
}

function isColorOnTheBrightSide(hexColor: string): boolean {
    // Convert hex color to RGB values
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // Calculate relative luminance using sRGB color space formula
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Return 'black' for dark colors, 'white' for light colors
    return luminance < 128
}


export const genericsUtils = {
    rgbToHex,
    hexStringColorToRGB,
    decimalRgbToHex,
    createNewPageFromFrame,
    compare2ofType,
    isColorOnTheBrightSide
}
