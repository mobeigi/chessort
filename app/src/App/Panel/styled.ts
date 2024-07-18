import { styled } from 'styled-components'

export const PanelContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
  align-items: center;
  justify-content: center;
	gap: 1em;
`

export const DescriptionWrapper = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0;
	margin: 0;
  gap: 0.2em;

	p {
		margin: 0;
		padding: 0;
	}
`
