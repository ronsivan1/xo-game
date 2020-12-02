import {ApplicationState, Box, EMIT_SET_WINNER, myID, Player} from "./state";

interface CellsProps {
   state: ApplicationState,
   dispatch: ({ type } : { type: string, payload?: any, board?: Box[][], winnerPlayer?: Player } )  => void
}

export function handleCellClick({ columnIndex: x, rowIndex: y, props } :
                            { columnIndex: number, rowIndex: number, props: CellsProps }) {
   const { state, dispatch } = props
   const board = state.board
   if(state.winnerPlayer.id !== '') return // there's already a winner
   if(state.currentTurnId !== myID) return // not ur turn
   if(board[y][x] !== '') return // this cell is already taken
   if(state.players.length !== 2) return // game hasn't started yet
   const players = state.players.filter(v => v.id === myID )
   board[y][x] = players[0].symbol
   dispatch({ type: 'game/UPDATE_BOARD', board })
   dispatch({ type: 'game/SWITCH_TURN', payload: myID })
   checkForWinner(board, props)
}

export function checkForWinner(board: Box[][], props: CellsProps) {
   const { state, dispatch } = props
   function handleSetWinner(sum: string): boolean {
      const winnerSymbol = sum === 'XXX' ? 'X' : sum === 'OOO' ? 'O' : ''

      if(winnerSymbol !== '') {
         const winnerPlayer = state.players.find(player => player.symbol === winnerSymbol)
         dispatch({ type: EMIT_SET_WINNER, winnerPlayer: winnerPlayer  })
         return true
      }
      return false
   }
   for(var i = 0; i<3;i++){
      const rowSum = board[i].join('')
      if(handleSetWinner(rowSum)) return
   }
   for(var i = 0; i<3;i++){
      var colSum = '';
      for(var j = 0; j<3;j++){
         colSum += board[j][i];
      }
      if(colSum.length === 3) {
         if(handleSetWinner(colSum)) return
      }

   }
   const diagonal = board[0][0] + board[1][1] + board[2][2]
   const antiDiagonal = board[2][0] + board[1][1] + board[0][2]
   if(diagonal.length === 3) {
      if(handleSetWinner(diagonal)) return
   }
   if(antiDiagonal.length === 3) {
      if(handleSetWinner(antiDiagonal)) return
   }

   // If no winners are found, check for a tie
   const isBoardFull = !board.some((row) => row.includes(''))
   if(isBoardFull) {
      dispatch({ type: EMIT_SET_WINNER, winnerPlayer: { id: 'tie', symbol: '' }  })
   }
}
