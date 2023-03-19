import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import '../styles/ui.css'
import { Heading1 } from './Generics'

function App() {
    const textbox = useRef<HTMLInputElement>(undefined)

    const countRef = useCallback((element: HTMLInputElement) => {
        if (element) element.value = '5'
        textbox.current = element
    }, [])

    const onCreate = () => {
        parent.postMessage({ pluginMessage: { type: 'generate-design-system' } }, '*')
    }

    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
    }

    useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const { type, msg } = event.data.pluginMessage
            if (type === 'generate-design-system')
                console.log(`Figma Says: ${msg}`)
        }
    }, [])

    return (
        <div>
            <Image src={logo} alt={'logo'} />
            <Heading1>Rectangle Creator</Heading1>
            <Text>
                Count: <Input ref={countRef} />
            </Text>
            <Button id="create" onClick={onCreate}>
                Create
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
        </div>
    )
}

const Image = styled.img``

const Text = styled.p``

const Input = styled.input``

const Button = styled.button``

export default App
