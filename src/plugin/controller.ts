/* eslint-disable indent */
import { Strings } from '../constants'
import { MsgTypes } from '../enums/MsgTypes.enum'
import { colorsUtils } from './utils/colors.utils'
import { msgsUtils } from './utils/msgs.utils'

figma.showUI(__html__)

figma.skipInvisibleInstanceChildren = true

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case MsgTypes.GENERATE_DESIGN_SYSTEM:
            generateDesignSystem()
            break
        default:
            break
    }
}

function generateDesignSystem() {
    const { selection } = figma.currentPage
    if (!selection.length)
        return msgsUtils.postMsg(MsgTypes.NO_SELECTION, Strings.NO_SELECTION)

    const uniqueColors = new Set<string>()

    const iterateThroughAllNodes = (nodes: readonly SceneNode[]) => {
        if (!nodes.length) return
        for (const node of nodes) {
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
        }
    }

    iterateThroughAllNodes(selection)

    colorsUtils.generateColorPaletteFrame(uniqueColors)

    msgsUtils.postMsg(MsgTypes.GENERATE_DESIGN_SYSTEM, Strings.GENERATE_DESIGN_SYSTEM)

    figma.closePlugin()
}