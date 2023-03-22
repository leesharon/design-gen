import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import CustomCheckbox from './Checkbox'
import { FlexColumn, Heading3 } from './Generics'

interface Props {
    isFormDisabled: boolean
}

const MainForm: FunctionComponent<Props> = ({ isFormDisabled }) => {

    const [colorsChecked, setColorsChecked] = useState(false)
    const [fontsChecked, setFontsChecked] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)

    useEffect(() => {
        if (colorsChecked || fontsChecked)
            setIsFormValid(true)
        else setIsFormValid(false)

    }, [colorsChecked, fontsChecked])

    const onCreate = () => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: MsgTypes.GENERATE_DESIGN_SYSTEM, data: {
                        withColors: colorsChecked,
                        withFonts: fontsChecked
                    }
                }
            },
            '*'
        )
    }

    return (
        <FormContainer color={isFormDisabled ? Colors.BLACK : Colors.BLACK}>
            <FormTitle fontSize={'14px'}>Generate custom elements based on your design:</FormTitle>
            <Form>
                <InputsContainer>
                    <CustomCheckbox
                        isFormDisabled={isFormDisabled}
                        label='Colors'
                        checked={colorsChecked}
                        onChange={(ev) => {
                            setColorsChecked(ev.target.checked)
                        }}
                    />
                    <CustomCheckbox
                        isFormDisabled={isFormDisabled}
                        label='Fonts'
                        checked={fontsChecked}
                        onChange={(ev) => {
                            setFontsChecked(ev.target.checked)
                        }}
                    />
                </InputsContainer>
                <Button
                    onClick={onCreate}
                    disabled={!isFormValid}
                    backgroundColor={isFormValid ? Colors.BLUE_PRIMARY : Colors.GRAY_500}
                >
                    Generate
                </Button>
            </Form>
        </FormContainer>
    )
}

const FormContainer = styled.div<{ color: string }>`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 30px;
    ${({ color }) => color && `color: ${color}`};
`

const FormTitle = styled(Heading3)`
    text-align: center;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: space-between;
`

const InputsContainer = styled(FlexColumn)``

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

export default MainForm