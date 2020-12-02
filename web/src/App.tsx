import React from 'react';
import './App.css';
import Button from "./components/Button";
import {GlobalStyles} from "./globalStyles";
import Board from './components/Board'
import Cells from './components/Cells'
import {ApplicationState, myID, withApplicationState} from "./state";

interface AppProps {
   state: ApplicationState;
   dispatch: ({ type }: { type: string, payload?: any }) => void
}

function App({ state, dispatch } : AppProps) {

   function getGameTitles(): { gameTitle: string, gameSubtitle: string } {
      const myPlayer = state.players.find(v => v.id === myID)

      // Determine game header title
      const gameTitle =
         state.winnerPlayer.id === 'tie' ? 'Tie! Go rematch!!' :
            state.winnerPlayer.id !== '' ? ('The winner is ' + state.winnerPlayer.symbol) :
               (state.players.length === 2 ? 'Game is live.' : 'Waiting for 2 players...')

      // Determine symbol title
      const yourSymbolString = myPlayer ? 'Your symbol is ' + myPlayer.symbol + '.' : '';

      // Determine current turn title
      const currentTurnString = myPlayer ?
         (state.currentTurnId === myPlayer.id ? 'It\'s your turn.': 'It\'s the other player\'s turn.') : ''

      const gameSubtitle = yourSymbolString + ' ' + (state.players.length === 2 ? currentTurnString : '')
      return { gameTitle, gameSubtitle }
   }

   const { gameTitle, gameSubtitle } = getGameTitles()

   return (
       <div className='app'>
          <GlobalStyles />
          <p className='game-title' >{gameTitle}</p>
          <p className='game-subtitle'>{gameSubtitle}</p>
          <div style={{ display: 'flex' }} >
             <Button title='Start Game' bgColor='green' />
             <Button title='Restart Game' bgColor='yellow' />
          </div>
          <Board>
             <Cells />
          </Board>
       </div>
   );
}

export default withApplicationState(App);
