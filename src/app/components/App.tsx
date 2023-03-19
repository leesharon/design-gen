import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import '../styles/ui.css'

function App() {
    const textbox = useRef<HTMLInputElement>(undefined)

    const countRef = useCallback((element: HTMLInputElement) => {
        if (element) element.value = '5'
        textbox.current = element
    }, [])

    const onCreate = () => {
        const count = parseInt(textbox.current.value, 10)
        parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
    }

    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
    }

    useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const { type, message } = event.data.pluginMessage
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`)
            }
        }
    }, [])

    return (
        <div>
            <img src={logo} />
            <Heading>Rectangle Creator</Heading>
            <p>
                Count: <input ref={countRef} />
            </p>
            <button id="create" onClick={onCreate}>
                Create
            </button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    )
}

const Heading = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: blue;
`

export default App
