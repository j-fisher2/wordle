import React from "react";
import "./MainMenu.css";
import RadioGroup from "../RadioGroup/RadioGroup";
import Checkbox from "../Checkbox/Checkbox";


function MainMenu({ onStartGame, online, setOnline, difficulty, setDifficulty }) {
    const DIFFICULTY_LEVELS = [
        {label: "Normal", value: "NORMAL"},
        {label: "Hard", value: "HARD"}
    ]
    return (
        <div className='container'>
                <h1 className="title">Play Wordle</h1>
                <img src="/Wordle_Logo.svg" width="70rem"/>
                <button className="button" onClick={onStartGame}>
                    Start Game
                </button>
            <div className="offline-select">
                <Checkbox label={"Play Offline"} checked={!online} onChange={() => setOnline(online => !online)} />
            </div>
            <div className="difficulty-select">
                <h3>Difficulty Level</h3>
                <RadioGroup name={"difficulty-select"} options={DIFFICULTY_LEVELS} value={difficulty} onChange={setDifficulty}/>
            </div>
        </div>
    )
};

export default MainMenu;
