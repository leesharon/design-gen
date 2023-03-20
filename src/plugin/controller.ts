/* eslint-disable indent */
import { Strings } from '../constants'
import { MsgTypes } from '../enums/MsgTypes.enum'
import { colorsUtils } from './utils/colors.utils'
import { msgsUtils } from './utils/msgs.utils'
import { fontsUtils } from './utils/fonts.utils'

figma.showUI(__html__)

figma.skipInvisibleInstanceChildren = true

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case MsgTypes.GENERATE_DESIGN_SYSTEM:
            generateDesignSystem()
            return
        case MsgTypes.CLOSE_PLUGIN:
            figma.closePlugin()
            return
        default:
            console.log('Unknown message type:', msg.type)
            return
    }
}

async function generateDesignSystem() {
    console.log('Generating Design System...')

    const { selection } = figma.currentPage
    if (!selection.length)
        return msgsUtils.postMsg(MsgTypes.NO_SELECTION, Strings.NO_SELECTION)

    const uniqueColors = new Set<string>()
    const uniqueFonts = new Array<FontName>()
    const uniqueFontsJSON = new Array<string>()

    const iterateThroughAllNodes = (nodes: readonly SceneNode[]) => {
        if (!nodes.length) return
        for (const node of nodes) {
            // Gets All Colors for the Palette
            colorsUtils.getAllUniqueColors(node, uniqueColors)

            const { type } = node

            // Handles nested children nodes
            if ((type === 'FRAME' ||
                type === 'COMPONENT' ||
                type === 'INSTANCE' ||
                type === 'GROUP') &&
                node.children.length

            ) iterateThroughAllNodes(node.children as SceneNode[])

            else if (type === 'TEXT' &&
                node.fontName &&
                node.fontName !== figma.mixed &&
                !uniqueFontsJSON.includes(JSON.stringify(node.fontName))) {
                uniqueFonts.push(node.fontName)
                uniqueFontsJSON.push(JSON.stringify(node.fontName))
            }
        }
    }

    iterateThroughAllNodes(selection)

    colorsUtils.generateColorPaletteFrame(uniqueColors)
    await fontsUtils.generateFontPaletteFrame(uniqueFonts)

    msgsUtils.postMsg(MsgTypes.GENERATE_DESIGN_SYSTEM, Strings.GENERATE_DESIGN_SYSTEM)

    console.log('Design System Generated!')

    figma.closePlugin()
}
