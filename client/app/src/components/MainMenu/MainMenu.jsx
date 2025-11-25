import React from "react";
import "./MainMenu.css";

const MainMenu = ({ onStartGame }) => (
    <div className="menu">
        <h1 className="title">Play Wordle</h1>
        <img src="/Wordle_Logo.svg" width="40%"/>
        <button className="button" onClick={onStartGame}>
            Start Game
        </button>
    </div>
);

export default MainMenu;
