import styled from 'styled-components'

const ScreenContainer = styled.div<{
    gap?: number;
    justify?: string;
    align?: string;
}>`
  display: flex;
  flex-direction: column;
  padding: 28px 20px 20px;
  height: 100%;
  ${({ gap }) => gap && `gap: ${gap}px`};
  ${({ justify }) => justify && `justify-content: ${justify}`};
  ${({ align }) => align && `align-items: ${align}`};
`

const FlexRow = styled.div<{
    gap?: number;
    justify?: string;
    align?: string;
}>`
  display: flex;
  ${({ gap }) => gap && `gap: ${gap}px`};
  ${({ justify }) => justify && `justify-content: ${justify}`};
  ${({ align }) => align && `align-items: ${align}`};
`

const FlexColumn = styled.div<{
    gap?: number;
    justify?: string;
    align?: string;
}>`
  display: flex;
  flex-direction: column;
  ${({ gap }) => gap && `gap: ${gap}px`};
  ${({ justify }) => justify && `justify-content: ${justify}`};
  ${({ align }) => align && `align-items: ${align}`};
`

const Heading1 = styled.h1<{ align?: string; fontSize?: string; weight?: number; mb?: number }>`
  ${({ weight = 500 }) => `font-weight: ${weight}`};
  ${({ fontSize = 20 }) => `font-size: ${fontSize}`};
  ${({ align }) => align && `text-align: ${align}`};
  ${({ mb }) => mb && `margin-bottom: ${mb}px`};
`

const Heading3 = styled.h3<{ align?: string; fontSize?: string; weight?: number }>`
  ${({ weight = 500 }) => `font-weight: ${weight}`};
  ${({ fontSize = 16 }) => `font-size: ${fontSize}`};
  ${({ align }) => align && `text-align: ${align}`};
`

const Heading5 = styled.h5<{ align?: string; fontSize?: string; weight?: number }>`
  ${({ weight = 500 }) => `font-weight: ${weight}`};
  ${({ fontSize = 20 }) => `font-size: ${fontSize}`};
  ${({ align }) => align && `text-align: ${align}`};
`

const PrimaryButton = styled.button<{ width?: string }>`
  font-weight: bold;
  text-align: center;
  transition: background-color 200ms ease-in-out, border 200ms ease-in-out,
  transform 200ms ease-in-out, color 200ms ease-in-out;
  font-size: 14px;
  border-radius: 9999px;
  padding: 10px 0;
`

export {
    PrimaryButton,
    FlexRow,
    FlexColumn,
    ScreenContainer,
    Heading1,
    Heading3,
    Heading5,
}
