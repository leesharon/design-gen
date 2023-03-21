import React, { FunctionComponent } from "react"
import styled from 'styled-components'
import Lottie from 'lottie-react'
import loadingAnimation from '../../assets/loader.json'

const Loader: FunctionComponent = () => {

    return (
        <LoaderContainer>
            <Lottie animationData={loadingAnimation} />
        </LoaderContainer>
    )
}

const LoaderContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default Loader