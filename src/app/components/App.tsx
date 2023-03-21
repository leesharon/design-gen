import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import '../styles/global.css'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import logo from '../assets/logo.svg'
import { FlexColumn, Heading3, ScreenContainer } from './Generics'
import MainForm from './MainForm'
import { Colors } from '../../constants'
import Loader from './Loader'

function App() {
    const [isElementsSelected, setIsElementsSelected] = useState(null)
    const [isFormValid, setIsFormValid] = useState(false)

    const onCreate = () => {
        parent.postMessage({ pluginMessage: { type: MsgTypes.GENERATE_DESIGN_SYSTEM } }, '*')
    }

    useEffect(() => {
        window.onmessage = (ev) => {
            const { type, msg, data } = ev.data.pluginMessage

            switch (type) {
                case MsgTypes.IS_ELEMENTS_SELECTED:
                    console.log(`Figma Says: ${msg}`)
                    setIsElementsSelected(data)
                    break;
                case MsgTypes.GENERATE_DESIGN_SYSTEM:
                    console.log(`Figma Says: ${msg}`)
                case MsgTypes.NO_SELECTION:
                    console.log(`Figma Says: ${msg}`)
                default:
                    break;
            }
        }
    }, [])

    return (
        <ScreenContainer gap={50} justify={'space-between'} align='center'>
            {
                (isElementsSelected === null)
                    ? <Loader />
                    : <>
                        {isElementsSelected
                            ? <Heading3 fontSize='14px'>Selected elements</Heading3>
                            : <ImgContainer align='center'>
                                <Img src={logo} alt={'logo'} />
                                <Heading3>Select elements to get started</Heading3>
                            </ImgContainer>
                        }
                        <MainForm isFormDisabled={!isElementsSelected} setIsFormValid={setIsFormValid} />
                        <Button
                            onClick={onCreate}
                            disabled={!isFormValid}
                            backgroundColor={isFormValid ? Colors.PURPLE_PRIMARY : Colors.GRAY_500}
                        >
                            Generate a Design System
                        </Button>
                    </>
            }
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
