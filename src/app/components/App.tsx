import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import logo from '../assets/logo.svg'
import '../styles/global.css'
import { FlexColumn, Heading3, ScreenContainer } from './Generics'
import MainForm from './MainForm'
import { Colors } from '../../constants'

function App() {
    const [isValid, setIsValid] = useState(false)

    const onCreate = () => {
        parent.postMessage({ pluginMessage: { type: MsgTypes.GENERATE_DESIGN_SYSTEM } }, '*')
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
        <ScreenContainer gap={50} justify={'space-between'} align='center'>
            <ImgContainer align='center'>
                <Img src={logo} alt={'logo'} />
                <Heading3>Select elements to get started</Heading3>
            </ImgContainer>
            <MainForm />
            <Button
                onClick={onCreate}
                disabled={!isValid}
                backgroundColor={isValid ? Colors.PURPLE_PRIMARY : Colors.GRAY_500}
            >
                Generate a Design System
            </Button>
        </ScreenContainer>
    )
}

const ImgContainer = styled(FlexColumn)`

`

const Img = styled.img`
    width: 116px;
    height: 116px;
    margin-bottom: 16px;
`

const Button = styled.button<{
    backgroundColor: string
}>`
    width: 100%;
    height: 40px;
    color: ${Colors.WHITE};
    ${({ backgroundColor }) => backgroundColor && `background: ${backgroundColor}`};
`

export default App
