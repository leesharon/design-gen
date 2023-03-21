import { MsgTypes } from '../../enums/MsgTypes.enum'

const postMsg = (type: MsgTypes, msg: string, data?: any) => {
    figma.ui.postMessage({
        type,
        msg,
        data
    })
}

export const msgsUtils = {
    postMsg,
}