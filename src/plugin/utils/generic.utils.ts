function rgbToHex(r: number, g: number, b: number) {
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

function decimalRgbToHex(r, g, b) {
    const rInt = Math.round(r * 255)
    const gInt = Math.round(g * 255)
    const bInt = Math.round(b * 255)
    return rgbToHex(rInt, gInt, bInt)
}

export const genericsUtils = {
    rgbToHex,
    decimalRgbToHex
}