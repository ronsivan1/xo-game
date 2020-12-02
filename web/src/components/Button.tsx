import React, {useState} from 'react'
import styled from 'styled-components'
import {
    START_BTN_PRESS, ApplicationState,
    withApplicationState, UPDATE_BOARD, EMIT_SET_WINNER, Player
} from "../state";

interface ButtonProps {
    className?: string;
    title: string;
    bgColor: string;

    state: ApplicationState;
    dispatch: ({ type }: { type: string, board?: any, winnerPlayer?: Player }) => void
}

function Button(props: ButtonProps) {
    const { className, title, bgColor } = props
    const [ disabled, setDisabled ] = useState(false)

    function onBtnClick() {
        if(title === "Start Game") {
            setDisabled(true)
            props.dispatch({ type: START_BTN_PRESS})
        } else if(title === "Restart Game") {
            props.dispatch({ type: UPDATE_BOARD, board: [['', '', ''], ['', '', ''], ['', '', '']] })
            props.dispatch({ type: EMIT_SET_WINNER, winnerPlayer: { id: '', symbol: '' } })
        }
    }

    return (
        <button className={className} style={{ backgroundColor: bgColor }}
                onClick={onBtnClick} disabled={disabled} >
            {title}
        </button>
    )
}

const StyledButton = styled(Button)`
    color: black;
    font-size: 20px;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 10px;
    cursor: pointer;
    width: 200px;
    height: 50px;
`

export default withApplicationState(StyledButton)
