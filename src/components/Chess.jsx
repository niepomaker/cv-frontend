import React, { useEffect, useMemo, useState } from "react";

export default function ChessAI(){
    // ======= STYLES =======
    const styles = `
    :root{ --bg: radial-gradient(1200px 800px at 20% 10%, #2a2f3a 0%, #171923 40%, #0e1016 100%); --glass: rgba(255,255,255,.08); --glass-2: rgba(255,255,255,.12); --txt:#e9edf5; --muted:#aeb6c7; --accent:#7dd3fc; --good:#34d399; --bad:#f87171; --shadow: 0 10px 30px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset; }
    .chess { color:var(--txt); font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif; max-width: 1100px; margin: 0 auto;}
    .chess .wrap{ min-height:80vh; background:var(--bg); display:grid; place-items:center; padding:24px; border-radius: 50px}
    .chess .app{ width:min(980px,100%); display:grid; gap:16px; }
    .chess .panel{ background:linear-gradient(180deg, var(--glass-2), var(--glass)); border:1px solid rgba(255,255,255,.12); border-radius:20px; box-shadow:var(--shadow); padding:16px 18px; }
    .chess header h1{margin:0 0 6px; font-size:28px}
    .chess header p{margin:0; color:var(--muted)}
    .chess .toolbar{display:flex; gap:10px; align-items:center; flex-wrap:wrap}
.chess .toolbar select,
.chess .toolbar button:not(.btn-primary) {
  appearance: none;
  color: var(--txt);
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  box-shadow: var(--shadow);
  cursor: pointer;
}
    .btn-primary { background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: white; border: none; border-radius: 12px; padding: 10px 16px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: var(--shadow); transition: transform 0.15s ease, background 0.25s ease;}
    .btn-primary:hover {transform: translateY(-2px); background: linear-gradient(135deg, #0ea5e9, #38bdf8);}
    .btn-primary:active {transform: translateY(0);}
    .chess .statusbar{display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap}
    .chess .badge{ padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12) }

    .chess .boardWrap{ display:grid; grid-template-columns: 1fr auto; gap:16px; align-items:start }
    .chess .board{ width:min(560px, 90vw); aspect-ratio:1/1; position:relative; border-radius:14px; overflow:hidden; box-shadow:var(--shadow); border:1px solid rgba(255,255,255,.12) }
    .chess .grid{ position:absolute; inset:0; display:grid; grid-template-columns:repeat(8,1fr); grid-template-rows:repeat(8,1fr) }
    .chess .sq{ position:relative; display:grid; place-items:center; font-size:42px; user-select:none; cursor:pointer; transition:background .15s ease, transform .1s ease; }
    .chess .light{ background:#262a36 }
    .chess .dark{ background:#1b1f2a }
    .chess .sq:hover{ box-shadow: inset 0 0 0 2px rgba(125,211,252,.45); background:rgba(125,211,252,.12); }
    .chess .sq.sel{ box-shadow: inset 0 0 0 3px var(--accent); background:rgba(125,211,252,.18); }
    .chess .sq.mv{ box-shadow: inset 0 0 0 3px rgba(52,211,153,.45); }
    .chess .sq.target::after{ content:""; position:absolute; inset:0; margin:auto; width:28%; height:28%; border-radius:50%; background:rgba(125,211,252,.65); pointer-events:none; }
    .chess .sq.cap::after{ content:""; position:absolute; inset:12%; border-radius:10px; border:3px dashed rgba(248,113,113,.75); pointer-events:none; }
    select {color: #e5e5e5; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(8px); border-radius: 8px; padding: 4px 8px;}
    select option { color: #000; background-color: #fff; }
    .chess .side{ display:grid; gap:10px; align-content:start }
    .chess .info{ font-size:14px; color:var(--muted) }
    .chess .toolbar .btn-primary{ background:linear-gradient(180deg, rgba(125,211,252,.25), rgba(125,211,252,.12));border-color:rgba(125,211,252,.35)}
    .chess .toolbar .btn-primary:hover{ transform: translateY(-2px); background: linear-gradient(135deg, #175c7e, #247493);}
    .chess .toolbar .btn-primary:active{transform: translateY(0);}

    @media (max-width:860px){ .chess .boardWrap{ grid-template-columns:1fr } }
    .chess .pieceImg{ width:78%; height:78%; object-fit:contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,.6)); }
    .chess .pieceTxt{ font-size:42px; line-height:1; }
  `;

// ======= CUSTOM PIECES (SVG data URIs) =======
    const W_PAWN_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23f3f4f6" stroke="%230f172a" stroke-width="2"><circle cx="22.5" cy="13.5" r="5.5"/><rect x="17" y="19" width="11" height="11" rx="2" ry="2"/><rect x="12" y="31" width="21" height="6" rx="3" ry="3"/></g></svg>';
    const B_PAWN_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23111827" stroke="%23e5e7eb" stroke-width="2"><circle cx="22.5" cy="13.5" r="5.5"/><rect x="17" y="19" width="11" height="11" rx="2" ry="2"/><rect x="12" y="31" width="21" height="6" rx="3" ry="3"/></g></svg>';

    // --- minimalistyczne SVG dla wszystkich figur ---
    const W_ROOK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23e5e7eb" stroke="%230f172a" stroke-width="2"><rect x="12" y="18" width="21" height="18" rx="2"/><rect x="10" y="36" width="25" height="5" rx="2"/><rect x="12" y="10" width="5" height="5"/><rect x="20" y="10" width="5" height="5"/><rect x="28" y="10" width="5" height="5"/></g></svg>';
    const B_ROOK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23111827" stroke="%23e5e7eb" stroke-width="2"><rect x="12" y="18" width="21" height="18" rx="2"/><rect x="10" y="36" width="25" height="5" rx="2"/><rect x="12" y="10" width="5" height="5"/><rect x="20" y="10" width="5" height="5"/><rect x="28" y="10" width="5" height="5"/></g></svg>';


    const W_KNIGHT_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23e5e7eb" stroke="%230f172a" stroke-width="2"><path d="M30 34H12c0-7 6-10 10-12 0-3-2-5-5-6l4-6c6 2 9 7 9 12 3 1 4 3 4 6v6z"/><circle cx="23" cy="17" r="1.8"/></g></svg>';
    const B_KNIGHT_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23111827" stroke="%23e5e7eb" stroke-width="2"><path d="M30 34H12c0-7 6-10 10-12 0-3-2-5-5-6l4-6c6 2 9 7 9 12 3 1 4 3 4 6v6z"/><circle cx="23" cy="17" r="1.8"/></g></svg>';


    const W_BISHOP_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23e5e7eb" stroke="%230f172a" stroke-width="2"><path d="M22.5 9a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/><path d="M22.5 17c4 3 6 6 6 9 0 3-2 5-6 5s-6-2-6-5c0-3 2-6 6-9z"/><rect x="12" y="31" width="21" height="6" rx="3"/></g></svg>';
    const B_BISHOP_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23111827" stroke="%23e5e7eb" stroke-width="2"><path d="M22.5 9a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/><path d="M22.5 17c4 3 6 6 6 9 0 3-2 5-6 5s-6-2-6-5c0-3 2-6 6-9z"/><rect x="12" y="31" width="21" height="6" rx="3"/></g></svg>';


    const W_QUEEN_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23e5e7eb" stroke="%230f172a" stroke-width="2"><circle cx="12" cy="14" r="3"/><circle cx="22.5" cy="11" r="3"/><circle cx="33" cy="14" r="3"/><path d="M12 16l10.5-6L33 16l-3 12H15l-3-12z"/><rect x="10" y="28" width="25" height="3" rx="1.5"/><rect x="12" y="32" width="21" height="5" rx="2.5"/></g></svg>';
    const B_QUEEN_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23111827" stroke="%23e5e7eb" stroke-width="2"><circle cx="12" cy="14" r="3"/><circle cx="22.5" cy="11" r="3"/><circle cx="33" cy="14" r="3"/><path d="M12 16l10.5-6L33 16l-3 12H15l-3-12z"/><rect x="10" y="28" width="25" height="3" rx="1.5"/><rect x="12" y="32" width="21" height="5" rx="2.5"/></g></svg>';


    const W_KING_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23e5e7eb" stroke="%230f172a" stroke-width="2"><path d="M21 9h3v4h4v3h-4v4h-3v-4h-4v-3h4V9z"/><path d="M15 33h15l-2-10 3-4-8-3-8 3 3 4-2 10z"/><rect x="12" y="33" width="21" height="5" rx="2.5"/></g></svg>';
    const B_KING_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="%23111827" stroke="%23e5e7eb" stroke-width="2"><path d="M21 9h3v4h4v3h-4v4h-3v-4h-4v-3h4V9z"/><path d="M15 33h15l-2-10 3-4-8-3-8 3 3 4-2 10z"/><rect x="12" y="33" width="21" height="5" rx="2.5"/></g></svg>';

    // pełna mapa źródeł dla figur
    const PIECE_SRC = {
        P: W_PAWN_SVG, p: B_PAWN_SVG,
        R: W_ROOK_SVG, r: B_ROOK_SVG,
        N: W_KNIGHT_SVG, n: B_KNIGHT_SVG,
        B: W_BISHOP_SVG, b: B_BISHOP_SVG,
        Q: W_QUEEN_SVG, q: B_QUEEN_SVG,
        K: W_KING_SVG, k: B_KING_SVG,
    };

    // ======= INITIAL BOARD =======
    const initial = useMemo(()=>[
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R']
    ], []);

    // ======= STATE =======
    const [board, setBoard] = useState(initial);
    const [side, setSide] = useState('w'); // human side
    const [turn, setTurn] = useState('w');
    const [status, setStatus] = useState('Kliknij „Nowa gra”, aby zacząć.');
    const [difficulty, setDifficulty] = useState(2); // depth
    const [sel, setSel] = useState(null); // {r,c}
    const [legal, setLegal] = useState([]); // list of moves from sel
    const [lastMove, setLastMove] = useState(null); // {from:{r,c}, to:{r,c}}
    const ai = side === 'w' ? 'b': 'w';

    // ======= HELPERS =======
    const isUpper = (ch)=> ch && ch === ch.toUpperCase();
    const colorOf = (ch)=> ch ? (isUpper(ch)? 'w':'b') : null;
    const opp = (c)=> c==='w'?'b':'w';
    const clone = (b)=> b.map(row=>row.slice());

    const inBounds = (r,c)=> r>=0 && r<8 && c>=0 && c<8;

    function kingPos(b, color){
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=b[r][c]; if(p && (p==='K'&&color==='w' || p==='k'&&color==='b')) return {r,c}; }
        return null;
    }

    function isSquareAttacked(b, r, c, byColor){
        // Knights
        const kn = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        for(const [dr,dc] of kn){ const rr=r+dr, cc=c+dc; if(inBounds(rr,cc)){ const p=b[rr][cc]; if(p && (byColor==='w'? p==='N' : p==='n')) return true; }}
        // King adj
        for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++){ if(dr||dc){ const rr=r+dr, cc=c+dc; if(inBounds(rr,cc)){ const p=b[rr][cc]; if(p && (byColor==='w'? p==='K' : p==='k')) return true; }}}
        // Pawns
        if(byColor==='w'){
            const rr=r+1; for(const cc of [c-1,c+1]) if(inBounds(rr,cc)){ const p=b[rr][cc]; if(p==='P') return true; }
        } else {
            const rr=r-1; for(const cc of [c-1,c+1]) if(inBounds(rr,cc)){ const p=b[rr][cc]; if(p==='p') return true; }
        }
        // Sliding: bishops/queens (diagonals)
        for(const [dr,dc] of [[1,1],[1,-1],[-1,1],[-1,-1]]){
            let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ const p=b[rr][cc]; if(p){ if(byColor==='w'? (p==='B'||p==='Q') : (p==='b'||p==='q')) return true; else break; } rr+=dr; cc+=dc; }
        }
        // Sliding: rooks/queens (orthogonal)
        for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
            let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ const p=b[rr][cc]; if(p){ if(byColor==='w'? (p==='R'||p==='Q') : (p==='r'||p==='q')) return true; else break; } rr+=dr; cc+=dc; }
        }
        return false;
    }

    function inCheck(b,color){
        const k=kingPos(b,color); if(!k) return false; return isSquareAttacked(b, k.r, k.c, opp(color));
    }

    function genMovesFor(b, r, c){
        const p=b[r][c]; if(!p) return [];
        const color=colorOf(p); const moves=[];
        const add=(rr,cc)=>{ if(!inBounds(rr,cc)) return; const t=b[rr][cc]; if(!t || colorOf(t)!==color) moves.push({from:{r,c}, to:{r:rr,c:cc}}); };
        switch(p.toLowerCase()){
            case 'p':{
                const dir = (color==='w')? -1 : +1; const startRow=(color==='w')?6:1; const promoRow=(color==='w')?0:7;
                // forward 1
                const f1r=r+dir, f1c=c; if(inBounds(f1r,f1c) && !b[f1r][f1c]){
                    if(f1r===promoRow) moves.push({from:{r,c}, to:{r:f1r,c:f1c}, promo:true}); else moves.push({from:{r,c}, to:{r:f1r,c:f1c}});
                    // forward 2 (tylko ze startu i jeśli oba pola puste)
                    const f2r=r+2*dir; if(r===startRow && inBounds(f2r,c) && !b[f2r][c]){ moves.push({from:{r,c}, to:{r:f2r,c}}); }
                }
                // captures
                for(const dc of [-1,1]){ const rr=r+dir, cc=c+dc; if(inBounds(rr,cc) && b[rr][cc] && colorOf(b[rr][cc])!==color){ if(rr===promoRow) moves.push({from:{r,c}, to:{r:rr,c:cc}, promo:true}); else moves.push({from:{r,c}, to:{r:rr,c:cc}}); }}
                // (en passant pomijamy na razie)
                break; }
            case 'n':{
                for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc); break; }
            case 'b':{
                for(const [dr,dc] of [[1,1],[1,-1],[-1,1],[-1,-1]]){
                    let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ if(!b[rr][cc]) moves.push({from:{r,c},to:{r:rr,c:cc}}); else { if(colorOf(b[rr][cc])!==color) moves.push({from:{r,c},to:{r:rr,c:cc}}); break; } rr+=dr; cc+=dc; }
                } break; }
            case 'r':{
                for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){
                    let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ if(!b[rr][cc]) moves.push({from:{r,c},to:{r:rr,c:cc}}); else { if(colorOf(b[rr][cc])!==color) moves.push({from:{r,c},to:{r:rr,c:cc}}); break; } rr+=dr; cc+=dc; }
                } break; }
            case 'q':{
                // rook + bishop
                for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
                    let rr=r+dr, cc=c+dc; while(inBounds(rr,cc)){ if(!b[rr][cc]) moves.push({from:{r,c},to:{r:rr,c:cc}}); else { if(colorOf(b[rr][cc])!==color) moves.push({from:{r,c},to:{r:rr,c:cc}}); break; } rr+=dr; cc+=dc; }
                } break; }
            case 'k':{
                for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++){ if(dr||dc) add(r+dr,c+dc); }
                // (roszada pominięta na razie)
                break; }
        }
        return moves;
    }

    function allMoves(b, color){
        const list=[]; for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=b[r][c]; if(p && colorOf(p)===color){ list.push(...genMovesFor(b,r,c)); }}
        // filter legal (king safety)
        return list.filter(m=>{ const nb=applyMove(b,m); return !inCheck(nb, color); });
    }

    function applyMove(b, m){
        const nb=clone(b); const p=nb[m.from.r][m.from.c]; nb[m.from.r][m.from.c]=null; nb[m.to.r][m.to.c]=m.promo? (colorOf(p)==='w'?'Q':'q') : p; return nb;
    }

    // ======= AI =======
    const values = { p:100, n:320, b:330, r:500, q:900, k:0 };

    function evaluate(b){
        let score=0, wm=0, bm=0;
        for(let r=0;r<8;r++) for(let c=0;c<8;c++){
            const p=b[r][c]; if(!p) continue; const v=values[p.toLowerCase()]; if(isUpper(p)) score+=v; else score-=v;
        }
        // mobility bonus (very light)
        wm = allMovesUnsafe(b,'w').length; bm = allMovesUnsafe(b,'b').length; // unsafe = bez sprawdzania szacha po ruchu; tylko dla heurystyki
        score += 0.2*(wm-bm);
        return score;
    }

    function allMovesUnsafe(b,color){
        const list=[]; for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=b[r][c]; if(p && colorOf(p)===color){ list.push(...genMovesFor(b,r,c)); }} return list;
    }

    function minimax(b, depth, alpha, beta, toMove){
        if(depth===0) return {score:evaluate(b)};
        const moves = allMoves(b,toMove);
        if(moves.length===0){ // checkmate or stalemate
            if(inCheck(b,toMove)) return {score: toMove==='w'? -99999 : 99999}; // if side to move in check, it's mate -> bad for that side
            return {score:0};
        }
        let bestMove=null;
        if(toMove==='w'){
            let best=-Infinity;
            for(const m of moves){
                const nb = applyMove(b,m);
                const {score} = minimax(nb, depth-1, alpha, beta, 'b');
                if(score>best){ best=score; bestMove=m; }
                if(best>alpha) alpha=best; if(beta<=alpha) break;
            }
            return {score:best, move:bestMove};
        } else {
            let best=+Infinity;
            for(const m of moves){
                const nb = applyMove(b,m);
                const {score} = minimax(nb, depth-1, alpha, beta, 'w');
                if(score<best){ best=score; bestMove=m; }
                if(best<beta) beta=best; if(beta<=alpha) break;
            }
            return {score:best, move:bestMove};
        }
    }

    function aiMove(bParam) {
        const b = bParam || board;           // używaj przekazanej pozycji
        setStatus("The computer thinks…");

        setTimeout(() => {
            const { move } = minimax(b, difficulty, -Infinity, +Infinity, ai);

            if (!move) {                       // brak ruchów po stronie AI
                const mate = inCheck(b, ai);
                setStatus(mate ? "Checkmate! You win. 🎉" : "Stalemate - a draw 🤝");
                return;
            }

            const nb = applyMove(b, move);
            setBoard(nb);
            setLastMove(move);

            const you = side;
            if (allMoves(nb, you).length === 0) {
                const mate = inCheck(nb, you);
                setTurn(opp(ai));
                setStatus(mate ? "Checkmate. The computer won. 😅" : "Stalemate - a draw 🤝");
                return;
            }

            setTurn(opp(ai));
            setStatus("Your move.");
        }, 150);
    }


// ======= INTERACTION =======
function onSquareClick(r,c){
    if(turn!==side) return;
    const p=board[r][c];
    if(sel && legal.some(m=>m.to.r===r && m.to.c===c)){
        // wykonaj ruch
        const move = legal.find(m=>m.to.r===r && m.to.c===c);
        const nb=applyMove(board, move); setBoard(nb); setTurn(ai); setLastMove(move); setSel(null); setLegal([]);
        // sprawdź mata/pata i wywołaj AI
        if(allMoves(nb, ai).length===0){ const mate=inCheck(nb, ai); setStatus(mate? 'Checkmate! You win. 🎉' : 'Stalemate - a draw 🤝'); return; }
        setStatus('The computer thinks…'); aiMove(nb);
        return;
    }
    if(p && colorOf(p)===side){ setSel({r,c}); const lm=allMoves(board, side).filter(m=>m.from.r===r && m.from.c===c); setLegal(lm); }
    else { setSel(null); setLegal([]); }
}

function reset(){ setBoard(initial.map(row=>row.slice())); setTurn('w'); setSel(null); setLegal([]); setLastMove(null); setStatus('Done. Choose your color and click „New game”.'); }

function start(){ reset(); if(side==='b'){ // AI zaczyna
    setTimeout(()=>aiMove(), 200);
} else { setStatus('Your move.'); }
}

useEffect(()=>{ setStatus('Click „New game” to start.'); }, [side, difficulty]);

// ======= RENDER HELPERS =======
const pieceChar = (p) => {
    const map = {
        P: "♙",
        N: "♘",
        B: "♗",
        R: "♖",
        Q: "♕",
        K: "♔",
        p: "♟",
        n: "♞",
        b: "♝",
        r: "♜",
        q: "♛",
        k: "♚",
    };
    return map[p] || "";
};

const pieceEl = (p) => {
    if (!p) return "";
    const src = PIECE_SRC[p];
    if (src) {
        return (
            <img
                className="pieceImg"
                src={src}
                alt={p === p.toUpperCase() ? "white pawn" : "black pawn"}
            />
        );
    }
    return <span className="pieceTxt">{pieceChar(p)}</span>;
};

const orientedSquares = () => {
    const arr = [];
    for (let rr = 0; rr < 8; rr++) for (let cc = 0; cc < 8; cc++) arr.push({ r: rr, c: cc });
    return side === "w" ? arr : arr.reverse();
};

const isTarget = (r, c) => !!legal.find((m) => m.to.r === r && m.to.c === c);
const isLast = (r, c) =>
    lastMove &&
    ((lastMove.from.r === r && lastMove.from.c === c) ||
        (lastMove.to.r === r && lastMove.to.c === c));

return (
    <div className="chess">
        <style>{styles}</style>
        <div className="wrap">
            <div className="app">
                <header className="panel">
                    <h1>Chess vs. Computer</h1>
                    <p>Full rules for pieces + promotions. No castling or en passant captures for now. AI: minimax (1–3 depth).</p>
                </header>

                <section className="panel toolbar">
                    <label>You play as:
                        <select value={side} onChange={(e)=>setSide(e.target.value)}>
                            <option value="w">White</option>
                            <option value="b">Black</option>
                        </select>
                    </label>
                    <label>Difficulty:
                        <select value={difficulty} onChange={(e)=>setDifficulty(Number(e.target.value))}>
                            <option value={1}>Easy</option>
                            <option value={2}>Medium</option>
                            <option value={3}>Hard</option>
                        </select>
                    </label>white
                    <button className="btn-primary" onClick={start}>New game</button>
                    <span className="badge">Round: <strong>{turn==='w'? 'White':'Black'}</strong></span>
                </section>

                <section className="panel statusbar">
                    <div>{status}</div>
                </section>

                <div className="boardWrap">
                    <div className="board">
                        <div className="grid">
                            {orientedSquares().map(({r,c},i)=>{
                                const p=board[r][c];
                                const light = (r+c)%2===0;
                                const selected = sel && sel.r===r && sel.c===c;
                                const target = isTarget(r,c);
                                const capture = target && !!p && colorOf(p)!==side;
                                const last = isLast(r,c);
                                return (
                                    <div key={i}
                                         className={`sq ${light? 'light':'dark'} ${selected? 'sel':''} ${last? 'mv':''} ${target? (capture? 'cap':'target'):''}`}
                                         onClick={()=>onSquareClick(r,c)}>
                                        {pieceEl(p)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="side">
                        <div className="info">Click on a piece to see possible moves. Blue circle = move, red dashed = capture. Green frame = final move.</div>
                        <div className="info">Missing: castling and en passant capture (I can add upon request). Promotion always to the queen..</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
);
}
