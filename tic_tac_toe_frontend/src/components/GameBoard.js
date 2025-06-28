import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthProvider";

/**
 * Render the interactive game board, player info, move list and handle moves and real-time updates.
 */
// PUBLIC_INTERFACE
const GameBoard = () => {
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moveError, setMoveError] = useState("");
  const wsRef = useRef(null);

  // Fetch or resume latest game
  useEffect(() => {
    setLoading(true);
    fetch("/api/games/current", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("tic_token")}` },
    })
      .then(r => r.json())
      .then(data => { setGame(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Setup WebSocket for real-time game updates (fallback to polling)
  useEffect(() => {
    if (!game) return;
    let ws;
    try {
      ws = new window.WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/games/ws/${game.id}?token=${localStorage.getItem("tic_token")}`);
      ws.onmessage = (event) => {
        try {
          const updated = JSON.parse(event.data);
          setGame(g => ({ ...g, ...updated }));
        } catch {}
      };
      wsRef.current = ws;
    } catch {}
    // Fallback polling every 4s if WebSocket fails
    const poll = setInterval(() => {
      fetch(`/api/games/${game.id}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("tic_token")}` },
      })
        .then(r => r.json())
        .then(data => setGame(data));
    }, 4000);
    return () => {
      ws && ws.close();
      clearInterval(poll);
    };
  }, [game && game.id]);

  // Handle player move (cell click)
  const makeMove = idx => {
    setMoveError("");
    fetch(`/api/games/${game.id}/move`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("tic_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ position: idx }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setMoveError(data.error);
        else setGame(g => ({ ...g, ...data }));
      });
  };

  // Start a new game
  const newGame = () => {
    fetch("/api/games/new", {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("tic_token")}` },
    })
      .then(r => r.json())
      .then(data => setGame(data));
  };

  if (loading) return <div className="center-box">Loading...</div>;
  if (!game) return (
    <div className="center-box">
      <h2>No active game</h2>
      <button className="btn btn-large" onClick={newGame}>Start New Game</button>
    </div>
  );

  // Utility for rendering pieces
  const cell = (v) => v === null ? "" : v === "X" ? "✖️" : "⭕";

  return (
    <div className="game-layout">
      <div className="game-board-area">
        <div className="players-info">
          <span><strong>You</strong>: {user.username} ({game.player === "X" ? "X" : "O"})</span>
          <span>Opponent: {game.opponent_username || "Waiting..."}</span>
        </div>
        <div className={`ttt-board ${game.status}`}>
          {game.board.map((mark, idx) => (
            <button
              key={idx}
              className="ttt-cell"
              disabled={game.status !== "in_progress" || game.current_turn !== game.player || game.board[idx]}
              onClick={() => makeMove(idx)}
            >{cell(mark)}</button>
          ))}
        </div>
        <div className="game-status">
          {game.status === "in_progress"
            ? <span>Turn: <b>{game.current_turn === game.player ? "You" : "Opponent"}</b>
            ({game.current_turn})</span>
            : <span>
                {game.status === "finished" 
                  ? <>Game finished: {game.winner
                      ? <>Winner: <b>{game.winner === game.player ? "You" : "Opponent"}</b></>
                      : "Draw"
                    }</>
                  : "Waiting for opponent..."}
              </span>}
        </div>
        {moveError && <div className="error">{moveError}</div>}
        {game.status === "finished" &&
          <button className="btn btn-large" onClick={newGame}>New Game</button>
        }
      </div>
      <div className="move-history-area">
        <h3>Moves</h3>
        <ol className="move-list">
          {(game.moves || []).map((m, i) => (
            <li key={i}>{m.player} ({cell(m.symbol)}): {m.position_label}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default GameBoard;
