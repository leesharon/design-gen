import React, { useEffect } from 'react'
import styled from 'styled-components'
import { MsgTypes } from '../../enums/MsgTypes.enum'
import logo from '../assets/logo.svg'
import '../styles/ui.css'
import { Heading1 } from './Generics'

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
    }, [])

    return (
        <div>
            <Image src={logo} alt={'logo'} />
            <Heading1>DesignGen</Heading1>
            <Button id="create" onClick={onCreate}>
                Create
            </Button>
            <Button onClick={onClose}>Close</Button>
        </div>
    )
}

const Image = styled.img``

const Button = styled.button``

export default App
