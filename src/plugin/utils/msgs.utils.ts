import { MsgTypes } from '../../enums/MsgTypes.enum'

const postMsg = (type: MsgTypes, msg: string) => {
    figma.ui.postMessage({
        type,
        msg,
    })
}

export const msgsUtils = {
    postMsg,
}