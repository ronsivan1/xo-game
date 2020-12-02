import React from 'react';
import styled from "styled-components";
import {
   ApplicationState, withApplicationState, Box
} from "../state";
import { handleCellClick } from "../gameLogic";

interface CellsProps {
   className?: string,
   state: ApplicationState,
   dispatch: ({ type } : { type: string, payload?: any, board?: Box[][], winnerPlayer?: Player } )  => void
}

type Player = { id: string, symbol: Box }

function Cells(props: CellsProps) {
   const { className, state } = props

   return (
      <div className={className} >
         {state.board.map((row, rowIndex) =>
            row.map((boxString: Box, columnIndex) => {
               return <div
                     key={`${rowIndex}-${columnIndex}`}
                     style={{
                        cursor: "pointer",
                        gridColumn: `${ columnIndex + 1 }`,
                        gridRow: `${ rowIndex + 1 }`,
                        border: '2px solid #abab49',
                        minWidth: '150px',
                        minHeight: '150px'
                     }}
                     onClick={ () => handleCellClick({ columnIndex, rowIndex, props }) }
                  >
                     <div className='cell-wrapper'>
                        <p>{boxString}</p>
                     </div>
                  </div>
            }

            )
         )}
      </div>
   );
}

const StyledCells = styled(Cells)`
  position: absolute;
  display: grid;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  
  .cell-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cell-wrapper p {
    font-size: 12vmin
  }
  
`

export default withApplicationState(StyledCells);
