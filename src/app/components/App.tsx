import React, { useEffect } from 'react'
import styled from 'styled-components'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import logo from '../assets/logo.svg'
import '../styles/ui.css'
import '../styles/global.css'
import { Heading1, ScreenContainer } from './Generics'

function App() {

    const onCreate = () => {
        parent.postMessage({ pluginMessage: { type: MsgTypes.GENERATE_DESIGN_SYSTEM } }, '*')
    }

    const onClose = () => {
        parent.postMessage({ pluginMessage: { type: MsgTypes.CLOSE_PLUGIN } }, '*')
    }

    useEffect(() => {
        window.onmessage = (event) => {
            const { type, msg } = event.data.pluginMessage
            if (type === MsgTypes.GENERATE_DESIGN_SYSTEM)
                console.log(`Figma Says: ${msg}`)
        }
        window.onmessage = (event) => {
            const { type, msg } = event.data.pluginMessage
            if (type === MsgTypes.NO_SELECTION)
                console.log(`Figma Says: ${msg}`)
        }
    }, [])

    return (
        <ScreenContainer>
            <Image src={logo} alt={'logo'} />
            <Heading1>DesignGen</Heading1>
            <Button id="create" onClick={onCreate}>
                Create
            </Button>
            <Button onClick={onClose}>Close</Button>
        </ScreenContainer>
    )
}

const Image = styled.img``

const Button = styled.button``

export default App
