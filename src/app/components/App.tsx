import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import '../styles/global.css'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import { Heading3, ScreenContainer } from './Generics'
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
        <>
            <ScreenContainer gap={50} justify={'space-between'} align='center'>
                {
                    (isElementsSelected === null)
                        ? <Loader />
                        : <>
                            {isElementsSelected
                                ? <>
                                    <MainForm isFormDisabled={!isElementsSelected} setIsFormValid={setIsFormValid} />
                                    <Button
                                        onClick={onCreate}
                                        disabled={!isFormValid}
                                        backgroundColor={isFormValid ? Colors.BLUE_PRIMARY : Colors.GRAY_500}
                                    >
                                        Generate
                                    </Button>
                                </>
                                : <SelectElementsText>Please select some elements to get started.</SelectElementsText>
                            }
                        </>
                }
            </ScreenContainer>
        </>
    )
}

const SelectElementsText = styled(Heading3)`
    margin-top: 40%;
    color: ${Colors.GRAY_500};
    text-align: center;
    line-height: 1.3;
`

const Button = styled.button<{
    backgroundColor: string
}>`
    width: 100%;
    height: 32px;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
    border-radius: 6px;
    color: ${Colors.WHITE};
    ${({ backgroundColor }) => backgroundColor && `background: ${backgroundColor}`};
`

export default App
