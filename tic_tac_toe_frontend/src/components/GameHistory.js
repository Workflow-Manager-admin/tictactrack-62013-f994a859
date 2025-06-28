import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

// PUBLIC_INTERFACE
const GameHistory = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games/history", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("tic_token")}` }
    })
      .then(r => r.json())
      .then(data => { setGames(data); setLoading(false); });
  }, []);

  if (loading) return <div className="center-box">Loading game history...</div>;
  if (!games.length) return <div className="center-box">No games found.</div>;

  return (
    <div className="history-page">
      <h2>Game History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Opponent</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {games.map(g => (
            <tr key={g.id}>
              <td>{new Date(g.created_at).toLocaleString()}</td>
              <td>{g.opponent_username}</td>
              <td>
                {g.status === "finished"
                  ? g.winner ? (g.winner === user.username ? "Win" : "Lose") : "Draw"
                  : "In progress"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameHistory;
