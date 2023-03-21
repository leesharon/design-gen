import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { FlexColumn, Heading5 } from './Generics'

interface Props {
}

const MainForm: FunctionComponent<Props> = () => {

    const [colorsChecked, setColorsChecked] = useState(false)
    const [fontsChecked, setFontsChecked] = useState(false)
    const [selectAllChecked, setSelectAllChecked] = useState(false)

    const handleSelectAllChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = ev.target
        setSelectAllChecked(checked)
        setColorsChecked(checked)
        setFontsChecked(checked)
    }

    const handleSingleCheckboxChange = () => {
        setSelectAllChecked(colorsChecked && fontsChecked)
    }


    return (
        <FormContainer>
            <Heading5 fontSize={'14px'}>Select elements to generate</Heading5>
            <ElementsForm>
                <Label>
                    <Checkbox
                        type="checkbox"
                        checked={colorsChecked}
                        onChange={() => {
                            setColorsChecked(prevState => !prevState)
                            handleSingleCheckboxChange()
                        }}
                    />
                    Colors
                </Label>
                <Label>
                    <Checkbox
                        type="checkbox"
                        checked={fontsChecked}
                        onChange={() => {
                            setFontsChecked(prevState => !prevState)
                            handleSingleCheckboxChange()
                        }}
                    />
                    Fonts
                </Label>
                <Label>
                    <Checkbox
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={(ev) => {
                            setSelectAllChecked(prevState => !prevState)
                            handleSelectAllChange(ev)
                        }}
                    />
                    Select all
                </Label>
            </ElementsForm>
        </FormContainer>
    )
}

const FormContainer = styled(FlexColumn)`
    padding: 0 80px;
`

const ElementsForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Label = styled.label``

const Checkbox = styled.input``

export default MainForm