import React, { Dispatch, FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import CustomCheckbox from './Checkbox'
import { FlexColumn, FlexRow, Heading3 } from './Generics'
import comingSoon from '../../assets/coming-soon.svg'

interface Props {
    isFormDisabled: boolean
    setIsElementsSelected: Dispatch<any>
}

const MainForm: FunctionComponent<Props> = ({ isFormDisabled, setIsElementsSelected }) => {

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
        setIsElementsSelected(null)
    }

    return (
        <FormContainer color={isFormDisabled ? Colors.BLACK : Colors.BLACK}>
            <FormTitle fontSize={'15px'}>Generate custom elements based on your design:</FormTitle>
            <Form onSubmit={onCreate}>
                <InputsContainer gap={5}>
                    <CustomCheckbox
                        disabled={isFormDisabled}
                        label='Colors'
                        checked={colorsChecked}
                        onChange={(ev) => {
                            setColorsChecked(ev.target.checked)
                        }}
                    />
                    <CustomCheckbox
                        disabled={isFormDisabled}
                        label='Fonts'
                        checked={fontsChecked}
                        onChange={(ev) => {
                            setFontsChecked(ev.target.checked)
                        }}
                    />
                    <CheckboxContainer>
                        <CustomCheckbox
                            disabled={true}
                            label='Icons'
                            checked={true}
                            onChange={() => {
                                console.log('disabled!')
                            }}
                        />
                        <ComingSoonImg src={comingSoon} />
                    </CheckboxContainer>
                    <CheckboxContainer>
                        <CustomCheckbox
                            disabled={true}
                            label='Buttons'
                            checked={true}
                            onChange={() => {
                                console.log('disabled!')
                            }}
                        />
                        <ComingSoonImg src={comingSoon} />
                    </CheckboxContainer>
                </InputsContainer>
                <Button
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
    line-height: 1.3;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: space-between;
`

const InputsContainer = styled(FlexColumn)`
    align-self: center;
    padding-inline-start: 55px;
    width: 100%;
`

const CheckboxContainer = styled(FlexRow)`
    position: relative;
`

const ComingSoonImg = styled.img`
    position: absolute;
    right: 0;
    top: 1;
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

export default MainForm