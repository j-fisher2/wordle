import { useState } from "react";
import "./JoinGame.css";
import { toast } from "sonner";
import { useGame } from "../../GameContext";

const JoinGame = () => {
    const [gameId, setGameId] = useState("");
    const GAME_API_ENDPOINT = `${import.meta.env.VITE_API_URL}/game/${gameId}/join`
    const {setGameState} = useGame();

    const joinGame = async () => {
        try {
            const res = await fetch(GAME_API_ENDPOINT, {method: "POST", headers: {"Content-Type": "application/json"}});
                if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                toast.error(errorData?.message || "Unknown error");
                return;
                }
            const data = await res.json();
            localStorage.setItem("playerId", data.playerId)
            setGameState(data);
        } catch (err) {
            console.error("Failed to fetch game:", err);
        }
    }

    return (
        <>
            <div className='join-game'>
                <input type="text" value={gameId} onChange={(e)=> setGameId(e.target.value)} placeholder="Game ID"/>
            </div>
            <button className='button' onClick={async () => await joinGame()}>Join</button>
        </>
    )
} 

export default JoinGame;