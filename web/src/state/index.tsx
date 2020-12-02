import React, { createContext, useEffect, useReducer } from 'react';
import io from 'socket.io-client'

export const socket = io("http://localhost:8001")
export var myID: string

socket.on('connect', () => {
   myID = socket.id
});

// CONSTANTS
export const START_BTN_PRESS = "game/START_BTN_PRESS"
export const UPDATE_BOARD = "game/UPDATE_BOARD"
export const UPDATE_PLAYERS = "game/UPDATE_PLAYERS"
export const LOCAL_UPDATE_BOARD = 'game/LOCAL_UPDATE_BOARD'
export const SWITCH_TURN = 'game/SWITCH_TURN'
export const LOCAL_SWITCH_TURN = 'game/LOCAL_SWITCH_TURN'
export const EMIT_SET_WINNER = 'game/EMIT_SET_WINNER'
export const LOCAL_SET_WINNER = 'game/LOCAL_SET_WINNER'

type Action =
     { type: 'game/START_BTN_PRESS' }
   | { type: 'game/UPDATE_PLAYERS', players: Player[], currentTurnId: string }
   | { type: 'game/UPDATE_BOARD', board: Box[][] }
   | { type: 'game/LOCAL_UPDATE_BOARD', board: Box[][] }
   | { type: 'game/SWITCH_TURN', payload: string }
   | { type: 'game/LOCAL_SWITCH_TURN', payload: string }
   | { type: 'game/EMIT_SET_WINNER', winnerPlayer: Player }
   | { type: 'game/LOCAL_SET_WINNER', winnerPlayer: Player }

export type Box = 'X' | 'O' | ''

export type Player = { id: string, symbol: Box }

export interface ApplicationState {
   board: Box[][],
   players: Player[],
   currentTurnId: string,
   winnerPlayer: Player
}

function reducer(state: ApplicationState, action: Action): ApplicationState {
   switch(action.type) {
      case START_BTN_PRESS:
         socket.emit('player-joined', myID)
         return state;
      case UPDATE_BOARD:
         socket.emit('update-board', action.board)
         return { ...state, board: action.board };
      case UPDATE_PLAYERS:
         return { ...state, players: action.players, currentTurnId: action.currentTurnId }
      case SWITCH_TURN:
         const nextPlayerId = action.payload === state.players[0].id ? state.players[1].id : state.players[0].id
         socket.emit('update-current-turn', nextPlayerId)
         return state
      case EMIT_SET_WINNER:
         socket.emit('set-winner', action.winnerPlayer)
         return { ...state, winnerPlayer: action.winnerPlayer }

      case LOCAL_UPDATE_BOARD:
         return { ...state, board: action.board }
      case LOCAL_SWITCH_TURN:
         return { ...state, currentTurnId: action.payload }
      case LOCAL_SET_WINNER:
         return { ...state, winnerPlayer: action.winnerPlayer }
      default:
         return state
   }
}

// Interface to define the state of the context object.
interface IStateContext {
   state: ApplicationState;
   dispatch?: React.Dispatch<Action>;
}

const initialState: ApplicationState = { players: [], currentTurnId: '',
                                          winnerPlayer: { id: '', symbol: '' },
                                          board: [ ['', '', ''],
                                                   ['', '', ''],
                                                   ['', '', ''] ] }

export const GlobalContext = createContext({} as IStateContext);

// The Store component to provide the global state to all child components
export function Store({ children }: { children: JSX.Element }) {
   const [state, dispatch] = useReducer(reducer, initialState)

   useEffect(() => {
      document.title = "xo-game"
      socket.on('client-player-joined',
         ({players, currentTurnId}: {players: Player[], currentTurnId: string}) => {
         dispatch({ type: UPDATE_PLAYERS, players, currentTurnId })
      })

      socket.on('client-update-board', (board: Box[][]) => {
         dispatch({ type: LOCAL_UPDATE_BOARD, board })
      })

      socket.on('client-update-current-turn', (nextPlayerId: string) => {
         dispatch({ type: LOCAL_SWITCH_TURN, payload: nextPlayerId })
      })

      socket.on('client-player-disconnected', (players: Player[]) => {
         dispatch({ type: UPDATE_PLAYERS, players, currentTurnId: '' })
         dispatch({ type: LOCAL_UPDATE_BOARD, board: [['', '', ''], ['', '', ''], ['', '', '']] })
      })

      socket.on('client-set-winner', (winnerPlayer: Player) => {
         dispatch({ type: LOCAL_SET_WINNER, winnerPlayer })
      })

      return() => {socket.removeAllListeners()}
   }, [])

   return (
      <GlobalContext.Provider value={{state, dispatch}}>
         {children}
      </GlobalContext.Provider>
   )
}

// A higher order component to inject the state and dispatcher
export function withApplicationState(Component: any) {
   return function WrapperComponent(props: any) {
      return (
         <GlobalContext.Consumer>
            {context => <Component {...props} state={context.state} dispatch={context.dispatch} />}
         </GlobalContext.Consumer>
      );
   }
}
