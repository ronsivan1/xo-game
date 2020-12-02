import {createGlobalStyle} from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
  
  .app {
    display: flex;
    min-height: 100vh;
    background: #2b2b2b;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  
  .game-title {
    font-size: 9vmin;
    color: #fff;
  }
  
  .game-subtitle {
    font-size: 4.5vmin;
    color: #fff;
  }
  
  @media screen and (max-width: 768px) {
    .game-title {
       font-size: 70px;
     }
  
     .game-subtitle {
       font-size: 35px;
     }
  }
`
