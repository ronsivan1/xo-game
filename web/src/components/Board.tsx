import styled from "styled-components";

const StyledBoard = styled.div`
  position: relative;
  display: grid;
  grid-template: ${`repeat(3, 20vmin) / repeat(3, 20vmin)`};
  background: #653821;
  justify-content: center;
  min-width: 450px;
  min-height: 450px;
`

export default StyledBoard;
