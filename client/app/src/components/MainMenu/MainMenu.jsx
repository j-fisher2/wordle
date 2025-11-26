import React from "react";
import "./MainMenu.css";

const Checkbox = ({ label, checked, onChange }) => {
  const handleChange = (e) => {
    if (onChange) onChange();
  };

  return (
    <div>
        <label>
        <input type="checkbox" checked={checked} onChange={handleChange} />
        {label}
        </label>
    </div>
  );
};

const MainMenu = ({ onStartGame, online, setOnline }) => (
    <div className='container'>
            <h1 className="title">Play Wordle</h1>
            <img src="/Wordle_Logo.svg" width="60rem"/>
            <button className="button" onClick={onStartGame}>
                Start Game
            </button>
        <div className="offline-select">
            <Checkbox label={"Play Offline"} checked={!online} onChange={() => setOnline(online => !online)} />
        </div>
    </div>
);

export default MainMenu;
