import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants'
import CustomCheckbox from './Checkbox'
import { Heading3, Heading5 } from './Generics'

interface Props {
    isFormDisabled: boolean
    setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>
}

const MainForm: FunctionComponent<Props> = ({ isFormDisabled, setIsFormValid }) => {

    const [colorsChecked, setColorsChecked] = useState(false)
    const [fontsChecked, setFontsChecked] = useState(false)

    useEffect(() => {
        if (colorsChecked || fontsChecked)
            setIsFormValid(true)
        else setIsFormValid(false)

    }, [colorsChecked, fontsChecked])

    return (
        <FormContainer color={isFormDisabled ? Colors.BLACK : Colors.BLACK}>
            <FormTitle fontSize={'14px'}>Generate custom elements based on your design:</FormTitle>
            <Form>
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
            </Form>
        </FormContainer>
    )
}

const FormContainer = styled.div<{ color: string }>`
    display: flex;
    flex-direction: column;
    gap: 30px;
    ${({ color }) => color && `color: ${color}`};
`

const FormTitle = styled(Heading3)`
    text-align: center;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`

export default MainForm