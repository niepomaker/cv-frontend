import React, { useEffect, useMemo, useState } from "react";

export default function TicTacToe() {
    const styles = `
    :root{ --bg: radial-gradient(1200px 800px at 20% 10%, #2a2f3a 0%, #171923 40%, #0e1016 100%); --glass: rgba(255,255,255,.08); --glass-2: rgba(255,255,255,.12); --txt: #e9edf5; --muted: #aeb6c7; --accent: #7dd3fc; --good: #34d399; --bad: #f87171; --shadow: 0 10px 30px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset; }
    .ttt { color:var(--txt); font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif; }
    .ttt .wrap{ min-height:100vh; background:var(--bg); display:grid; place-items:center; padding:24px; border-radius: 40px;}
    .ttt .app{ width:min(980px, 100%); display:grid; gap:20px; }
    .ttt .panel{ background:linear-gradient(180deg, var(--glass-2), var(--glass)); backdrop-filter:saturate(1.2) blur(8px); -webkit-backdrop-filter:saturate(1.2) blur(8px); border:1px solid rgba(255,255,255,.12); border-radius:20px; box-shadow:var(--shadow); padding:18px 20px; }
    .ttt header h1{margin:0 0 6px; font-size:28px; letter-spacing:.3px}
    .ttt header p{margin:0; color:var(--muted)}
    .ttt .controls{display:grid; grid-template-columns:1fr 1fr; gap:12px}
    .ttt .controls .group{display:flex; align-items:center; gap:12px; flex-wrap:wrap}
    .ttt .controls label{color:var(--muted)}
    .ttt .chip{ display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); cursor:pointer; user-select:none }
    .ttt .chip input{accent-color:var(--accent)}
    .ttt select, .ttt button{ appearance:none; color:var(--txt); background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.14); border-radius:12px; padding:10px 12px; font-size:14px; box-shadow:var(--shadow); cursor:pointer }
    .ttt button.primary {  background:linear-gradient(180deg, rgba(125,211,252,.25), rgba(125,211,252,.12)); border-color:rgba(125,211,252,.35)}
    .ttt button.primary:hover { transform: translateY(-2px); background: linear-gradient(135deg, #1e7baa, #2c92bc);}
    .ttt button.danger {  background:linear-gradient(180deg, rgba(248,113,113,.2), rgba(248,113,113,.1)); border-color:rgba(248,113,113,.3)}


    .ttt button.danger:hover { transform: translateY(-2px); background: linear-gradient(135deg, #991b1b, #dc2626);}

    .ttt button:disabled{opacity:.6; cursor:not-allowed}
    .ttt .statusbar{display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap}
    .ttt .score{display:flex; gap:10px; align-items:center}
    .ttt .badge{padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12)}
    .ttt .board.panel{padding:16px}
    .ttt .grid{display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; touch-action: manipulation; }
    .ttt .cell{-webkit-tap-highlight-color: transparent; all:unset; display:grid; place-items:center; width:100%; aspect-ratio:1/1; font-size:48px; font-weight:800; letter-spacing:1px; color:var(--txt); background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.14); border-radius:16px; box-shadow:var(--shadow); transition:all .2s ease; cursor:pointer }
    .ttt .cell:hover{ background:rgba(52,211,153,.25); transform:translateY(-2px); }
    .ttt .cell.selected{ background:rgba(52,211,153,.35) !important; border-color:var(--good) !important; }
    .ttt .cell.win{outline:3px solid var(--good); box-shadow:0 0 0 3px rgba(52,211,153,.25), var(--shadow)}
    .ttt .footer{color:var(--muted); font-size:13px; text-align:center}
    .ttt .blink{animation:blink 1.1s linear infinite}
    
    select {color: #e5e5e5; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(8px); border-radius: 8px; padding: 4px 8px;}
    select option { color: #000; background-color: #fff; }
    @keyframes blink{0%,100%{opacity:1} 50%{opacity:.45}}
    @media (max-width:720px){ .ttt .controls{grid-template-columns:1fr} .ttt .cell{font-size:40px} }
  `;

    const lines = useMemo(() => [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ], []);

    const [board, setBoard] = useState(Array(9).fill(null));
    const [player, setPlayer] = useState("X");
    const ai = player === "X" ? "O" : "X";
    const [current, setCurrent] = useState("X");
    const [running, setRunning] = useState(false);
    const [lock, setLock] = useState(false);
    const [difficulty, setDifficulty] = useState("medium");
    const [status, setStatus] = useState("Click „New Round” to get started.");
    const [blink, setBlink] = useState(false);
    const [winLine, setWinLine] = useState([]);
    const [score, setScore] = useState({ p: 0, a: 0, d: 0 });
    const [selectedCells, setSelectedCells] = useState([]);

    const availableMoves = (b) => b.map((v,i)=>v?null:i).filter(v=>v!==null);
    const winnerOf = (b) => {
        for (const [a,bb,c] of lines) {
            if (b[a] && b[a] === b[bb] && b[a] === b[c]) return { player: b[a], line: [a,bb,c] };
        }
        return null;
    };
    const isDraw = (b) => availableMoves(b).length === 0 && !winnerOf(b);

    const evaluate = (b) => {
        const w = winnerOf(b); if (!w) return 0; return w.player === ai ? +10 : -10;
    };

    const minimax = (b, depth, isMax, alpha, beta) => {
        const w = winnerOf(b);
        if (w) return (w.player === ai ? 10 : -10) - depth * (w.player === ai ? 1 : -1);
        if (availableMoves(b).length === 0) return 0;

        if (isMax) {
            let best = -Infinity;
            for (const m of availableMoves(b)) {
                b[m] = ai; const val = minimax(b, depth + 1, false, alpha, beta); b[m] = null;
                if (val > best) best = val; if (best > alpha) alpha = best; if (beta <= alpha) break;
            }
            return best;
        } else {
            let best = +Infinity;
            for (const m of availableMoves(b)) {
                b[m] = player; const val = minimax(b, depth + 1, true, alpha, beta); b[m] = null;
                if (val < best) best = val; if (best < beta) beta = best; if (beta <= alpha) break;
            }
            return best;
        }
    };

    const bestMove = (b) => {
        const moves = availableMoves(b);
        if (difficulty === "easy") return moves[Math.floor(Math.random() * moves.length)];
        if (difficulty === "medium" && Math.random() < 0.4) return moves[Math.floor(Math.random() * moves.length)];

        let bestScore = -Infinity, choice = moves[0];
        for (const m of moves) {
            b[m] = ai; const s = minimax(b, 0, false, -Infinity, +Infinity); b[m] = null;
            if (s > bestScore) { bestScore = s; choice = m; }
        }
        return choice;
    };

    const startRound = () => {
        const b = Array(9).fill(null);
        setBoard(b); setRunning(true); setLock(false); setWinLine([]); setSelectedCells([]);
        setCurrent("X");

        const aiStarts = player === "O";
        setStatus(aiStarts ? "Komputer myśli…" : "Twoja kolej — zagraj.");
        setBlink(aiStarts);

        if (aiStarts) setTimeout(() => doAiMove(b), 450); // <— przekazujemy b
    };

    const endRound = (type, line = []) => {
        setRunning(false); setLock(false); setBlink(false); setWinLine(line);
        setScore((s) => {
            if (type === "P") return { ...s, p: s.p + 1 };
            if (type === "A") return { ...s, a: s.a + 1 };
            return { ...s, d: s.d + 1 };
        });
        if (type === "P") setStatus("You win! 🎉");
        else if (type === "A") setStatus("You lose. 😅");
        else setStatus("Draw. 🤝");
    };

    // AI move – liczy na przekazanej migawce planszy
    const doAiMove = (bSnap) => {
        setLock(true);
        setStatus("Komputer myśli…");
        setBlink(true);

        setTimeout(() => {
            // pracujemy WYŁĄCZNIE na kopii przekazanej migawki
            const b = [...bSnap];
            const m = bestMove(b);

            if (m == null) { setBoard(b); endRound("D"); return; }
            if (b[m]) {                      // bezpieczeństwo: AI nie może nadpisać zajętego pola
                setBoard(b); endRound("D");    // (przy dobrze działającym bestMove nie powinno się zdarzyć)
                return;
            }

            b[m] = ai;

            const w = winnerOf(b);
            if (w) { setBoard(b); endRound("A", w.line); return; }
            if (isDraw(b)) { setBoard(b); endRound("D"); return; }

            setBoard(b);
            setCurrent(player);
            setLock(false);
            setStatus("Your turn — play.");
            setBlink(false);
        }, 350);
    };


    const playerMove = (i) => {
        if (!running || lock || current !== player || board[i]) return;

        const b = [...board];
        b[i] = player;
        setBoard(b);
        setSelectedCells((prev) => [...prev, i]);

        const w = winnerOf(b); if (w) { endRound("P", w.line); return; }
        if (isDraw(b)) { endRound("D"); return; }

        setCurrent(ai);
        setStatus("Komputer myśli…");
        setBlink(true);

        doAiMove(b);   // <— KLUCZOWE: przekazujemy migawkę z Twoim X
    };


    useEffect(() => {
        const onKey = (e) => {
            if (e.key >= "1" && e.key <= "9") {
                const idx = parseInt(e.key, 10) - 1; playerMove(idx);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    useEffect(() => {
        setStatus("Click „New Round” to get started");
    }, [player, difficulty]);

    return (
        <div className="ttt">
            <style>{styles}</style>
            <div className="wrap">
                <div className="app">
                    <header className="panel">
                        <h1>
                            Tic-Tac-Toe <small style={{ fontSize: 14, color: "var(--muted)" }}>— vs computer</small>
                        </h1>
                        <p>Select a symbol and difficulty level, then start a new round. Play with AI (minimax) 👾</p>
                    </header>

                    <section className="panel controls" aria-label="Ustawienia gry">
                        <div className="group" role="radiogroup" aria-label="Wybór symbolu">
                            <label>Symbol:</label>
                            <label className="chip">
                                <input type="radio" name="symbol" value="X" checked={player === "X"} onChange={() => setPlayer("X")} />
                                X (You start)
                            </label>
                            <label className="chip">
                                <input type="radio" name="symbol" value="O" checked={player === "O"} onChange={() => setPlayer("O")} />
                                O (Computer start)
                            </label>
                        </div>
                        <div className="group">
                            <label htmlFor="difficulty">Difficulty level:</label>
                            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <button className="primary" onClick={startRound}>New round</button>
                            <button
                                className="danger"
                                onClick={() => { setScore({ p:0, a:0, d:0 }); setStatus("Wynik wyzerowany. Kliknij „Nowa runda”."); }}
                            >
                                Reset score
                            </button>
                        </div>
                    </section>

                    <section className="panel statusbar" aria-live="polite">
                        <div className={blink ? "blink" : undefined}>{status}</div>
                        <div className="score">
                            <span className="badge">You: <strong>{score.p}</strong></span>
                            <span className="badge">Computer: <strong>{score.a}</strong></span>
                            <span className="badge">Draws: <strong>{score.d}</strong></span>
                        </div>
                    </section>

                    <main className="board panel" aria-label="Plansza">
                        <div className="grid">
                            {Array.from({ length: 9 }, (_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`cell ${winLine.includes(i) ? "win" : ""} ${selectedCells.includes(i) ? "selected" : ""}`}
                                    aria-label={`Pole ${i + 1}`}
                                    onPointerUp={() => playerMove(i)}   // touch + mouse + pen
                                    onClick={() => playerMove(i)}       // fallback (np. starsze przeglądarki)
                                    disabled={!!board[i] || !running || lock || current !== player}
                                >
                                    {board[i] || ""}
                                </button>
                            ))}
                        </div>
                    </main>

                    <footer className="footer">Made with ♥ — minimax + glassmorphism. Keys: 1-9 = fast moves.</footer>
                </div>
            </div>
        </div>

    );
}