import { Strings } from '../constants'
import { MsgTypes } from '../enums/MsgTypes.enum'
import { colorsUtils } from './services/colors.service'
import { msgsUtils } from './services/msgs.utils'
import { fontsUtils } from './services/fonts.service'

figma.showUI(__html__)

const { selection } = figma.currentPage
setTimeout(() => {
    msgsUtils.postMsg(
        MsgTypes.IS_ELEMENTS_SELECTED,
        selection.length ? Strings.ELEMENTS_SELECTED : Strings.NO_ELEMENTS_FOUND,
        !!selection.length
    )
}, 500)

figma.on('selectionchange', () => {
    const { selection } = figma.currentPage
    msgsUtils.postMsg(
        MsgTypes.IS_ELEMENTS_SELECTED,
        selection.length ? Strings.ELEMENTS_SELECTED : Strings.NO_ELEMENTS_FOUND,
        !!selection.length
    )
})

figma.ui.resize(240, 300)

figma.skipInvisibleInstanceChildren = true

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case MsgTypes.GENERATE_DESIGN_SYSTEM:
            const { withColors, withFonts } = msg.data
            generateDesignSystem(withColors, withFonts)
            return
        case MsgTypes.CLOSE_PLUGIN:
            figma.closePlugin()
            return
        default:
            console.log('Unknown message type:', msg.type)
            return
    }
}

async function generateDesignSystem(withColors: boolean, withFonts: boolean) {
    console.log('Generating Design System...')
    const { selection } = figma.currentPage

    if (!selection.length)
        return msgsUtils.postMsg(MsgTypes.NO_SELECTION, Strings.NO_SELECTION)

    const uniqueColors = new Set<string>()
    const uniqueFonts = new Set<string>()
    const fontSizes = new Set<number>()
    const fontWeights = new Set<number>()

    const iterateThroughAllNodes = (nodes: readonly SceneNode[]) => {
        if (!nodes.length) return

        for (const node of nodes) {
            // ! skip icons for now
            if (node.name.toLocaleLowerCase().includes('icon')) continue

            // Gets All Colors for the Palette
            withColors && colorsUtils.getAllUniqueColors(node, uniqueColors)

            // Handles nested children nodes
            const { type } = node
            if ((type === 'FRAME' ||
                type === 'COMPONENT' ||
                type === 'INSTANCE' ||
                type === 'GROUP') &&
                node.children.length

            ) iterateThroughAllNodes(node.children as SceneNode[])

            else if (withFonts && type === 'TEXT' && node.fontName) {
                // If the fontName is not mixed, add it to the array
                if (node.fontName !== figma.mixed && node.fontSize !== figma.mixed && node.fontWeight !== figma.mixed) {
                    fontSizes.add(node.fontSize);
                    (typeof node.fontWeight === 'number') && fontWeights.add(node.fontWeight)
                    const { fontName } = node

                    const appTextNode: AppFontNode = {
                        fontName: fontName,
                        family: fontName.family,
                        style: fontName.style,
                        fontSize: +node.fontSize.toFixed(1),
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

    setTimeout(async () => {
        let newCreatedPage: PageNode

        // Generate the according figma elements and display them
        withColors && (newCreatedPage = await colorsUtils.generateColorPaletteFrame(uniqueColors))
        withFonts && (newCreatedPage = await fontsUtils.generateFontPaletteFrame(
            uniqueFonts,
            [...fontSizes].sort((a, b) => a - b),
            [...fontWeights].sort((a, b) => a - b))
        )

        if (uniqueColors.size || uniqueFonts.size) {
            console.log(Strings.DESIGN_SYSTEM_GENERATED)
            msgsUtils.postMsg(MsgTypes.GENERATE_DESIGN_SYSTEM, Strings.DESIGN_SYSTEM_GENERATED)

            figma.currentPage = newCreatedPage
            figma.closePlugin()
        } else {
            console.log(Strings.NO_ELEMENTS_FOUND)
            msgsUtils.postMsg(MsgTypes.NO_ELEMENTS_FOUND, Strings.NO_ELEMENTS_FOUND)
        }
    }, 1000);
}

