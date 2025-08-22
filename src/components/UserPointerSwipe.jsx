import { useRef, useEffect } from "react";

export function usePointerSwipe(onSwipe, { threshold = 24 } = {}) {
    const ref = useRef(null);
    const state = useRef({ id: null, x: 0, y: 0, moved: false });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const down = (e) => {
            el.setPointerCapture?.(e.pointerId);
            state.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
        };
        const move = (e) => {
            const s = state.current;
            if (s.id !== e.pointerId) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) s.moved = true;
        };
        const up = (e) => {
            const s = state.current;
            if (s.id !== e.pointerId) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            state.current.id = null;

            if (!s.moved) return; // tap bez przesunięcia
            if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;

            const horiz = Math.abs(dx) > Math.abs(dy);
            const dir = horiz ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
            onSwipe?.(dir);
        };

        // ważne: passive:false, by móc preventDefault w iOS (tu nie trzeba, ale dobrze mieć)
        el.addEventListener("pointerdown", down, { passive: true });
        el.addEventListener("pointermove", move, { passive: true });
        el.addEventListener("pointerup", up, { passive: true });
        el.addEventListener("pointercancel", up, { passive: true });

        return () => {
            el.removeEventListener("pointerdown", down);
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerup", up);
            el.removeEventListener("pointercancel", up);
        };
    }, [onSwipe, threshold]);

    return ref;
}
