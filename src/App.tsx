import { useState } from "react";
import "./styles.css";

export default function App() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [winners, setWinners] = useState<string[]>([]);

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const drawWinner = () => {
    if (participants.length > 0) {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setWinners([...winners, participants[randomIndex]]);
    }
  };

  const reset = () => {
    setParticipants([]);
    setWinners([]);
  };

  return (
    <div className="App">
      <h1>Online Raffle</h1>

      <div className="input-section">
        <input
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          placeholder="Enter participant name"
          onKeyPress={(e) => e.key === "Enter" && addParticipant()}
        />
        <button onClick={addParticipant}>Add</button>
      </div>

      <div className="participants">
        <h2>Participants ({participants.length})</h2>
        {participants.map((participant, index) => (
          <div key={index}>{participant}</div>
        ))}
      </div>

      <div className="controls">
        <button onClick={drawWinner} disabled={participants.length === 0}>
          Draw Winner
        </button>
        <button onClick={reset}>Reset</button>
      </div>

      {winners.length > 0 && (
        <div className="winners">
          <h2>Winners</h2>
          {winners.map((winner, index) => (
            <div key={index}>
              {index + 1}. {winner}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
