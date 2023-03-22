import React, { ChangeEvent, FunctionComponent } from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants'

interface Props {
    label: string
    checked: boolean
    disabled: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const CustomCheckbox: FunctionComponent<Props> = ({ label, checked, onChange, disabled }) => {
    return (
        <Label
            color={disabled ? Colors.GRAY_500 : Colors.BLACK}
        >
            {label}
            <Input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            <Checkmark
                borderColor={disabled ? Colors.GRAY_500 : Colors.BLACK}
                className="checkmark" />
        </Label>
    )
}

const Label = styled.label<{ color: string }>`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  margin-bottom: 10px;
  padding-top: 2px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  ${({ color }) => color && `color: ${color}`};

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    border-radius: 4px;
  }

  &:hover input:enabled ~ .checkmark {
    background-color: ${Colors.BLUE_PRIMARY};
  }
`

const Input = styled.input`
`

const Checkmark = styled.span<{ borderColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border: ${Colors.BLUE_PRIMARY} solid 2px;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  &:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ &:after {
    display: block;
  }

  &:after {
    left: 5px;
    top: 2px;
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input:checked ~ & {
    background-color: #2196f3;
  }

  input:disabled ~ & {
    background-color: ${Colors.GRAY_500};
    border-color: ${Colors.GRAY_500};
  }
`

export default CustomCheckbox
