import React, { useEffect } from 'react'
import styled from 'styled-components'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import logo from '../assets/logo.svg'
import '../styles/ui.css'
import '../styles/global.css'
import { Heading3, Heading5, ScreenContainer } from './Generics'

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
        <ScreenContainer gap={50} justify={'space-around'}>
            <ImgContainer>
                <Img src={logo} alt={'logo'} />
                <Heading3>Select screens to get started</Heading3>
            </ImgContainer>
            <Heading5>Select elements to generate</Heading5>
            <Button id="create" onClick={onCreate}>
                Create
            </Button>
        </ScreenContainer>
    )
}

const ImgContainer = styled.div`

`

const Img = styled.img`
    width: 116px;
    height: 116px;
    margin-bottom: 16px;
`

const Button = styled.button``

export default App
