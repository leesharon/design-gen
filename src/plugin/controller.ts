/* eslint-disable indent */
import { MsgTypes } from '../enums/MsgTypes.enum'
import { colorsUtils } from './utils/colors.utils'
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

    const uniqueColors = new Set<string>()
    const uniqueFonts = new Set<FontName | typeof figma.mixed>()

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

            else if(type === 'TEXT') fontsUtils.getNodeUniqueFonts(node as TextNode, uniqueFonts)
        }
    }

    iterateThroughAllNodes(selection)

    colorsUtils.generateColorPaletteFrame([...uniqueColors])
    await fontsUtils.generateFontPaletteFrame([...uniqueFonts])

    console.log('Design System Generated!')

    // ? Close the plugin?
    figma.closePlugin()
}

