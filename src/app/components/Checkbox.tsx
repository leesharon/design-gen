import React, { ChangeEvent, FunctionComponent } from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants'

interface Props {
    label: string
    checked: boolean
    isFormDisabled: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const CustomCheckbox: FunctionComponent<Props> = ({ label, checked, onChange, isFormDisabled }) => {
    return (
        <Label
            color={isFormDisabled ? Colors.GRAY_500 : Colors.BLACK}
        >
            {label}
            <Input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={isFormDisabled}
            />
            <Checkmark
                borderColor={isFormDisabled ? Colors.GRAY_500 : Colors.BLACK}
                className="checkmark" />
        </Label>
    )
}

const Label = styled.label<{ color: string }>`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  ${({ color }) => color && `color: ${color}`};

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  &:hover input ~ .checkmark {
    background-color: #ccc;
  }

`

const Input = styled.input``

const Checkmark = styled.span<{ borderColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border: ${({ borderColor }) => borderColor} solid 2px;
  border-radius: 4px;

  &:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ &:after {
    display: block;
  }

  &:after {
    left: 6px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid black;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`

export default CustomCheckbox
