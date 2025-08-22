import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePointerSwipe } from "./UserPointerSwipe";

// 2048 – czysta implementacja w React (1 plik)
// Funkcje: sterowanie klawiaturą (strzałki/WASD), dotyk (gesty), wynik + najlepszy wynik (localStorage),
// nowa gra, wybór rozmiaru planszy (4x4/5x5), animacje ruchu i łączenia.

export default function Game2048() {
  // ====== STYLES (glassmorphism + responsywny board) ======
  const styles = `
    :root{ --bg: radial-gradient(1200px 800px at 20% 10%, #2a2f3a 0%, #171923 40%, #0e1016 100%); --glass: rgba(255,255,255,.08); --glass-2: rgba(255,255,255,.12); --txt:#e9edf5; --muted:#aeb6c7; --shadow: 0 10px 30px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset; }
    .g2048{ color:var(--txt); font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif; max-width: 1100px; margin: 0 auto;}
    .g2048 .wrap{ min-height: 75vh; background:var(--bg); display:grid; place-items:center; padding:24px; border-radius: 30px}
    .g2048 .app{ width:min(980px, 100%); display:grid; gap:16px; }
    .g2048 .panel{ background:linear-gradient(180deg, var(--glass-2), var(--glass)); backdrop-filter:saturate(1.2) blur(8px); -webkit-backdrop-filter:saturate(1.2) blur(8px); border:1px solid rgba(255,255,255,.12); border-radius:20px; box-shadow:var(--shadow); padding:16px 18px; }
    .g2048 header h1{margin:0 0 6px; font-size:28px; letter-spacing:.3px}
    .g2048 header p{margin:0; color:var(--muted)}
    .g2048 .toolbar{display:flex; gap:10px; align-items:center; flex-wrap:wrap}
    .g2048 select, .g2048 button{ appearance:none; color:var(--txt); background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.14); border-radius:12px; padding:10px 12px; font-size:14px; box-shadow:var(--shadow); cursor:pointer }
    .g2048 .btn-primary{ background:linear-gradient(180deg, rgba(125,211,252,.25), rgba(125,211,252,.12)); border-color:rgba(125,211,252,.35) }
    .g2048 .toolbar .btn-primary:hover{ transform: translateY(-2px); background: linear-gradient(135deg, #1e7baa, #2c92bc);}

    .g2048 .stats{ margin-left:auto; display:flex; gap:10px }
    .g2048 .badge{ padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12) }

    .g2048 .boardWrap{ display:grid; place-items:center; }
    .g2048 .board{ position:relative; width:min(560px, 92vw); height:min(560px, 92vw); padding:12px; border-radius:18px; background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03)); border:1px solid rgba(255,255,255,.12); box-shadow:var(--shadow); }
    .g2048 .cells{ position:absolute; inset:12px; display:grid; gap:12px; }
    .g2048 .cells div{ background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; }

    .g2048 .tiles{ position:absolute; inset:12px; }
    .g2048 .tile{ position:absolute; display:grid; place-items:center; border-radius:10px; font-weight:800; transition: transform .12s ease, left .15s ease, top .15s ease, background .2s ease, color .2s ease; box-shadow: 0 6px 18px rgba(0,0,0,.35); }
    .g2048 .tile.new{ animation: pop .18s ease-out; }
    .g2048 .tile.bump{ animation: bump .18s ease-out; }
    .g2048 .board { touch-action: none; -webkit-tap-highlight-color: transparent; }

    select {color: #e5e5e5; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(8px); border-radius: 8px; padding: 4px 8px;}
    select option { color: #000; background-color: #fff; }

    @keyframes pop{ 0%{ transform:scale(.6); opacity:.5 } 100%{ transform:scale(1); opacity:1 } }
    @keyframes bump{ 0%{ transform:scale(1) } 50%{ transform:scale(1.07) } 100%{ transform:scale(1) } }

    .g2048 .overlay{ position:absolute; inset:0; display:grid; place-items:center; background:rgba(0,0,0,.35); border-radius:18px; }
    .g2048 .overlay .card{ background:rgba(18,20,28,.85); border:1px solid rgba(255,255,255,.12); padding:16px; border-radius:14px; display:grid; gap:10px; text-align:center }

    @media (max-width:560px){ .g2048 header h1{font-size:24px} }
  `;

  // ====== HELPERS ======
  const dirs = {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 }
  };

  const [size, setSize] = useState(4);
  const [tiles, setTiles] = useState([]); // {id, x,y, value, isNew, bump}
  const [score, setScore] = useState(0);
  const bestKey = useMemo(()=>`g2048_best_${size}`, [size]);
  const [best, setBest] = useState(() => Number(localStorage.getItem(`g2048_best_${4}`))||0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const boardRef = usePointerSwipe((dir) => {
    // dir = "left" | "right" | "up" | "down"
    move(dir); // Twoja funkcja ruchu
  });
  const [geom, setGeom] = useState({cell:0, gap:12});

  // compute grid background cells
  const cells = useMemo(() => Array.from({length: size*size}, (_,i)=>i), [size]);

  // measure board to get cell size for absolute tiles
  useLayoutEffect(()=>{
    const measure = ()=>{
      if(!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const gap = 12; // px
      const cell = (rect.width - gap*(size-1) - 24) / size; // subtract board padding left+right (12+12)
      setGeom({cell, gap});
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(boardRef.current);
    return ()=> ro.disconnect();
  }, [size]);

  // init game
  useEffect(()=>{ newGame(size); }, [size]);

  useEffect(()=>{ // persist best score
    localStorage.setItem(bestKey, String(best));
  }, [bestKey, best]);

  function newGame(n){
    const t = [];
    spawnRandom(t, n); spawnRandom(t, n);
    setTiles(t); setScore(0); setGameOver(false); setWon(false);
    const savedBest = Number(localStorage.getItem(`g2048_best_${n}`))||0; setBest(savedBest);
  }

  function gridFromTiles(t){
    const g = Array.from({length:size}, ()=>Array(size).fill(null));
    t.forEach(tile=>{ g[tile.y][tile.x] = tile; });
    return g;
  }

  function empties(g){
    const e=[]; for(let y=0;y<size;y++) for(let x=0;x<size;x++) if(!g[y][x]) e.push({x,y}); return e;
  }

  function spawnRandom(t, n=size){
    const g = Array.from({length:n}, ()=>Array(n).fill(null));
    t.forEach(tile=>{ if(tile.x<n && tile.y<n) g[tile.y][tile.x]=true; });
    const free=[]; for(let y=0;y<n;y++) for(let x=0;x<n;x++) if(!g[y][x]) free.push({x,y});
    if(free.length===0) return false;
    const spot = free[Math.floor(Math.random()*free.length)];
    const val = Math.random()<0.9?2:4;
    t.push({id:cryptoRandomId(), x:spot.x, y:spot.y, value:val, isNew:true, bump:false});
    return true;
  }

  function cryptoRandomId(){
    // try to use crypto if available, else fallback
    if (typeof crypto !== 'undefined' && crypto.getRandomValues){
      const arr = new Uint32Array(1); crypto.getRandomValues(arr); return `t${arr[0].toString(16)}`;
    }
    return `t${Math.random().toString(36).slice(2,9)}`;
  }

  function canMove(t){
    const g = gridFromTiles(t);
    if(empties(g).length>0) return true;
    // check adjacent merges
    for(let y=0;y<size;y++){
      for(let x=0;x<size;x++){
        const v=g[y][x].value;
        if(x+1<size && g[y][x+1].value===v) return true;
        if(y+1<size && g[y+1][x].value===v) return true;
      }
    }
    return false;
  }

  function move(dirKey) {
    if (gameOver) return;

    const grid = Array.from({ length: size }, () => Array(size).fill(0));
    tiles.forEach((t) => {
      grid[t.y][t.x] = t.value;
    });

    let moved = false;
    let gained = 0;

    const transform = (arr, forward = true) => {
      let vals = arr.filter((v) => v !== 0);
      if (!forward) vals.reverse();

      const out = [];
      for (let i = 0; i < vals.length; i++) {
        if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
          const merged = vals[i] * 2;
          out.push(merged);
          gained += merged;
          i++;
        } else {
          out.push(vals[i]);
        }
      }
      while (out.length < size) out.push(0);
      if (!forward) out.reverse();
      return out;
    };

    const prev = grid.map((row) => row.slice());

    if (dirKey === "left") {
      for (let y = 0; y < size; y++) grid[y] = transform(grid[y], true);
    } else if (dirKey === "right") {
      for (let y = 0; y < size; y++) grid[y] = transform(grid[y], false);
    } else if (dirKey === "up") {
      for (let x = 0; x < size; x++) {
        const col = grid.map((r) => r[x]);
        const nc = transform(col, true);
        for (let y = 0; y < size; y++) grid[y][x] = nc[y];
      }
    } else if (dirKey === "down") {
      for (let x = 0; x < size; x++) {
        const col = grid.map((r) => r[x]);
        const nc = transform(col, false);
        for (let y = 0; y < size; y++) grid[y][x] = nc[y];
      }
    }

    outer: for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (grid[y][x] !== prev[y][x]) {
          moved = true;
          break outer;
        }
      }
    }
    if (!moved) return;

    const newTiles = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const v = grid[y][x];
        if (v) newTiles.push({ id: cryptoRandomId(), x, y, value: v, isNew: false, bump: false });
      }
    }

    spawnRandom(newTiles, size);

    setTiles(newTiles);
    setScore((s) => {
      const ns = s + gained;
      if (ns > best) setBest(ns);
      return ns;
    });

    // win/lose check
    setTimeout(() => {
      const has2048 = newTiles.some((t) => t.value >= 2048);
      if (has2048) setWon((w) => w || true);
      if (!canMove(newTiles)) setGameOver(true);
    }, 50);
  }


  function tilesSnapshot(){ return tiles.map(o=>({...o})); }

  // keyboard
  useEffect(()=>{
    const onKey=(e)=>{
      const k=e.key.toLowerCase();
      if(["arrowleft","a"].includes(k)) { e.preventDefault(); move("left"); }
      else if(["arrowright","d"].includes(k)) { e.preventDefault(); move("right"); }
      else if(["arrowup","w"].includes(k)) { e.preventDefault(); move("up"); }
      else if(["arrowdown","s"].includes(k)) { e.preventDefault(); move("down"); }
    };
    window.addEventListener('keydown', onKey, {passive:false});
    return ()=> window.removeEventListener('keydown', onKey);
  });

  // touch gestures
  useEffect(()=>{
    let startX=0, startY=0, active=false; const min=20;
    const onStart=(e)=>{ const t=e.touches? e.touches[0] : e; startX=t.clientX; startY=t.clientY; active=true; };
    const onMove=(e)=>{ if(!active) return; };
    const onEnd=(e)=>{
      if(!active) return; active=false; const t=e.changedTouches? e.changedTouches[0] : e; const dx=t.clientX-startX; const dy=t.clientY-startY;
      if(Math.abs(dx)<min && Math.abs(dy)<min) return;
      if(Math.abs(dx)>Math.abs(dy)) move(dx>0? 'right':'left'); else move(dy>0? 'down':'up');
    };
    const el=boardRef.current; if(!el) return;
    el.addEventListener('touchstart', onStart, {passive:true});
    el.addEventListener('mousedown', onStart);
    window.addEventListener('mouseup', onEnd);
    el.addEventListener('touchend', onEnd);
    return ()=>{ if(!el) return; el.removeEventListener('touchstart', onStart); el.removeEventListener('mousedown', onStart); window.removeEventListener('mouseup', onEnd); el.removeEventListener('touchend', onEnd); };
  }, [boardRef.current]);

  // positioning helper
  const tileStyle = (t)=>({
    left: `${t.x*(geom.cell+geom.gap)}px`,
    top: `${t.y*(geom.cell+geom.gap)}px`,
    width: `${geom.cell}px`, height: `${geom.cell}px`,
    background: tileBg(t.value), color: tileColor(t.value), fontSize: `${Math.max(24, geom.cell/3)}px`
  });

  return (
    <div className="g2048">
      <style>{styles}</style>
      <div className="wrap">
        <div className="app">
          <header className="panel">
            <h1>2048 - browser</h1>
            <p>Match tiles with matching numbers. Controls: Arrows or WASD; on mobile, gestures.</p>
          </header>

          <div className="panel toolbar">
            <label>Board size:
              <select value={size} onChange={(e)=>setSize(Number(e.target.value))}>
                <option value={4}>4 × 4</option>
                <option value={5}>5 × 5</option>
              </select>
            </label>
            <button className="btn-primary" onClick={()=>newGame(size)}>New game</button>
            <div className="stats">
              <span className="badge">Result: <strong>{score}</strong></span>
              <span className="badge">Record: <strong>{best}</strong></span>
            </div>
          </div>

          <div className="boardWrap">
            <div ref={boardRef} className="board" aria-label="Plansza 2048" tabIndex={0}>
              <div className="cells" style={{gridTemplateColumns:`repeat(${size}, 1fr)`, gridTemplateRows:`repeat(${size}, 1fr)`, gap: `${geom.gap}px`}}>
                {cells.map(i=> <div key={i}/>) }
              </div>
              <div className="tiles">
                {tiles.map(t=> (
                  <div key={t.id} className={`tile ${t.isNew? 'new':''} ${t.bump? 'bump':''}`} style={tileStyle(t)}>
                    {t.value}
                  </div>
                ))}
              </div>
              {(gameOver || won) && (
                <div className="overlay">
                  <div className="card">
                    <div style={{fontSize:22, fontWeight:800}}>{won? 'You win! 🎉' : 'End game 😅'}</div>
                    <div style={{color:'var(--muted)'}}>Result: <strong>{score}</strong> · Record: <strong>{Math.max(best, score)}</strong></div>
                    <div style={{display:'flex', gap:8, justifyContent:'center'}}>
                      <button className="btn-primary" onClick={()=>{ newGame(size); }}>New game</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ====== COLORS ======
function tileBg(v){
  const map = {
    2:'#1f2937', 4:'#273044', 8:'#1f4d2e', 16:'#1b5e20', 32:'#14532d', 64:'#0f5132',
    128:'#0b3b59', 256:'#0b2e67', 512:'#162b7c', 1024:'#3b2273', 2048:'#5b1d6a', 4096:'#7c1a5d'
  };
  return map[v] || '#111826';
}
function tileColor(v){ return v<=4? '#dbeafe' : '#f8fafc'; }
