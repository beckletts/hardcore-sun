import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split(".").pop()?.toLowerCase();

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;

      if (fileType === "xlsx" || fileType === "xls") {
        // Handle Excel files
        const workbook = XLSX.read(content, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Flatten the data and filter out empty values
        const names = data
          .flat()

          .filter(
            (name: string | null | undefined) =>
              name && typeof name === "string"
          );
        setParticipants((prev) => [...prev, ...names]);
      } else if (fileType === "csv") {
        // Handle CSV files
        Papa.parse(content as string, {
          complete: (results) => {
            const names = results.data // Changed from 'data' to 'results.data'
              .flat()
              .filter((name: any) => name && typeof name === "string");
            setParticipants((prev) => [...prev, ...names]);
          },
        });
      }
    };

    if (fileType === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
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

      <div className="file-upload">
        <label className="file-label">
          Import from Excel/CSV
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>
        <span className="file-help">Supported formats: .xlsx, .xls, .csv</span>
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
