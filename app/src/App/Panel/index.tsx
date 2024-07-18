import { PanelContainer, DescriptionWrapper } from './styled'

const Panel = () => {
  return (
    <PanelContainer>
      <DescriptionWrapper>
        <p><strong>Puzzle: </strong> TODO</p>
        <p><strong>Difficulty: </strong> Hidden</p>
      </DescriptionWrapper>

      <button>Submit</button> 
    </PanelContainer>
  )
}

export default Panel
