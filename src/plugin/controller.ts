import { Strings } from '../constants'
import { MsgTypes } from '../enums/MsgTypes.enum'
import { colorsUtils } from './services/colors.service'
import { msgsUtils } from './services/msgs.service'
import { fontsUtils } from './services/fonts.service'

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
    const uniqueFonts = new Set<string>()

    const iterateThroughAllNodes = (nodes: readonly SceneNode[]) => {
        if (!nodes.length) return

        for (const node of nodes) {
            // ! skip icons for now
            if (node.name.toLocaleLowerCase().includes('icon')) continue

            // Gets All Colors for the Palette
            colorsUtils.getAllUniqueColors(node, uniqueColors)

            // Handles nested children nodes
            const { type } = node
            if ((type === 'FRAME' ||
                type === 'COMPONENT' ||
                type === 'INSTANCE' ||
                type === 'GROUP') &&
                node.children.length

            ) iterateThroughAllNodes(node.children as SceneNode[])

            else if (type === 'TEXT' && node.fontName) {
                // If the fontName is not mixed, add it to the array
                if (node.fontName !== figma.mixed && node.fontSize !== figma.mixed) {
                    const appTextNode: AppTextNode = {
                        fontName: node.fontName,
                        fontFamily: node.fontName.family,
                        fontStyle: node.fontName.style,
                        fontSize: node.fontSize,
                    }
                    uniqueFonts.add(JSON.stringify(appTextNode))
                    // If the fontName is mixed, log it to the console
                } else {
                    // TODO: Handle mixed fonts
                    console.log('FontName is mixed!');
                }
            }
        }
    }

    iterateThroughAllNodes(selection)

    colorsUtils.generateColorPaletteFrame(uniqueColors)
    await fontsUtils.generateFontPaletteFrame(uniqueFonts)

    if (uniqueColors.size || uniqueFonts.size) {
        console.log(Strings.DESIGN_SYSTEM_GENERATED)
        msgsUtils.postMsg(MsgTypes.GENERATE_DESIGN_SYSTEM, Strings.DESIGN_SYSTEM_GENERATED)

        figma.closePlugin()
    } else {
        console.log(Strings.NO_ELEMENTS_FOUND)
        msgsUtils.postMsg(MsgTypes.NO_ELEMENTS_FOUND, Strings.NO_ELEMENTS_FOUND)
    }
}

