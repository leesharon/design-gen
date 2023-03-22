
type ColorString = string
type Color = [number, number, number]

function parseColorString(colorString: ColorString): Color {
    const colorComponents = colorString.split(',').map(parseFloat)
    return [colorComponents[0], colorComponents[1], colorComponents[2]]
}

function rgbToHsv(color: Color): [number, number, number] {
    let r = color[0], g = color[1], b = color[2]
    let max = Math.max(r, g, b), min = Math.min(r, g, b)
    let d = max - min
    let h = 0
    let s = max === 0 ? 0 : d / max
    let v = max

    if (max === min) {
        h = 0
    } else {
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0)
        } else if (max === g) {
            h = (b - r) / d + 2
        } else if (max === b) {
            h = (r - g) / d + 4
        }
        h /= 6
    }

    return [h, s, v]
}

function sortColorsByHueAndLuminance(colors: ColorString[]): ColorString[] {
    return colors.sort((colorA, colorB) => {
        const [h1, , v1] = rgbToHsv(parseColorString(colorA))
        const [h2, , v2] = rgbToHsv(parseColorString(colorB))

        if (h1 < h2) {
            return -1
        } else if (h1 > h2) {
            return 1
        } else {
            // If hues are equal, sort by luminance (dark to light)
            return v2 - v1
        }
    })
}

export const colorSortingService = {
    sortColorsByHueAndLuminance,
}
