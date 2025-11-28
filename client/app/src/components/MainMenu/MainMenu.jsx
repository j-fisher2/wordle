import React from "react";
import "./MainMenu.css";
import RadioGroup from "../RadioGroup/RadioGroup";
import Checkbox from "../Checkbox/Checkbox";
import JoinGame from "../JoinGame/JoinGame";
import { useState } from "react";

function MainMenu({ onStartGame, online, setOnline, difficulty, setDifficulty }) {
    const DIFFICULTY_LEVELS = [
        {label: "Normal", value: "NORMAL"},
        {label: "Hard", value: "HARD"}
    ]
    const [startMode, setStartMode] = useState(null);

    return (
        <div className='container'>
                <h1 className="title">Play Wordle</h1>
                <img src="/Wordle_Logo.svg" width="70rem"/>
                { (!startMode) &&
                    <button className="button" onClick={() => setStartMode("NEW")}>
                        Start a New Game
                    </button>
                }
                { (!startMode) &&
                    <button className="lower-button" onClick={() => setStartMode("JOIN")}>
                        Join a Friend's Game
                    </button>
                }
                {
                startMode === "NEW" &&
                <>
                    <div className="offline-select">
                        <Checkbox label={"Play Offline"} checked={!online} onChange={() => setOnline(online => !online)} />
                    </div>
                    <div className="difficulty-select">
                        <h3>Difficulty Level</h3>
                        <RadioGroup name={"difficulty-select"} options={DIFFICULTY_LEVELS} value={difficulty} onChange={setDifficulty}/>
                    </div>
                    <button className='button' onClick={onStartGame}>Start</button>
                </>
                }
                {startMode === "JOIN" && <JoinGame />}
                {startMode && <button className="lower-button" onClick={()=>setStartMode(null)}>Back</button>}
        </div>
    )
};

export default MainMenu;
