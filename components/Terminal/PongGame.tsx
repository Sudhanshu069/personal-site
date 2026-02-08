"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type PongGameProps = {
  onExit: () => void;
};

type Score = { player: number; cpu: number };

export function PongGame({ onExit }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  const pressedRef = useRef<{ up: boolean; down: boolean }>({
    up: false,
    down: false,
  });

  const gameRef = useRef({
    running: true,
    paused: false,
    width: 720,
    height: 360,

    paddleW: 10,
    paddleH: 70,
    paddleInset: 18,
    paddleSpeed: 360, // px/s

    playerY: 0,
    cpuY: 0,

    ballR: 6,
    ballX: 0,
    ballY: 0,
    ballVX: 420, // px/s
    ballVY: 180, // px/s

    score: { player: 0, cpu: 0 } as Score,
    winningScore: 7,
  });

  const [score, setScore] = useState<Score>({ player: 0, cpu: 0 });
  const [status, setStatus] = useState<"playing" | "paused" | "gameover">(
    "playing"
  );

  const colors = useMemo(
    () => ({
      bg: "#1e1e2e", // mocha-base
      fg: "#cdd6f4", // mocha-text
      dim: "#a6adc8", // mocha-subtext
      accent: "#a6e3a1", // mocha-green
      accent2: "#89b4fa", // mocha-blue
      danger: "#f38ba8", // mocha-red
      line: "#45475a", // mocha-surface1
    }),
    []
  );

  const resetBall = (dir: 1 | -1) => {
    const g = gameRef.current;
    g.ballX = g.width / 2;
    g.ballY = g.height / 2;
    const speed = 420;
    g.ballVX = speed * dir;
    // random-ish vertical
    const vy = 140 + Math.random() * 140;
    g.ballVY = (Math.random() > 0.5 ? 1 : -1) * vy;
  };

  const resetRound = (dir: 1 | -1) => {
    const g = gameRef.current;
    g.playerY = (g.height - g.paddleH) / 2;
    g.cpuY = (g.height - g.paddleH) / 2;
    resetBall(dir);
  };

  const resetGame = () => {
    const g = gameRef.current;
    g.score = { player: 0, cpu: 0 };
    setScore(g.score);
    g.paused = false;
    setStatus("playing");
    resetRound(Math.random() > 0.5 ? 1 : -1);
  };

  const togglePause = () => {
    const g = gameRef.current;
    if (!g.running) return;
    g.paused = !g.paused;
    setStatus(g.paused ? "paused" : "playing");
  };

  const step = (dt: number) => {
    const g = gameRef.current;
    if (!g.running || g.paused) return;

    // player input
    const { up, down } = pressedRef.current;
    if (up) g.playerY -= g.paddleSpeed * dt;
    if (down) g.playerY += g.paddleSpeed * dt;

    // clamp player paddle
    g.playerY = Math.max(0, Math.min(g.height - g.paddleH, g.playerY));

    // simple CPU AI: move towards ball with max speed (a bit slower than player)
    const cpuTarget = g.ballY - g.paddleH / 2;
    const cpuSpeed = g.paddleSpeed * 0.9;
    const delta = cpuTarget - g.cpuY;
    const maxMove = cpuSpeed * dt;
    if (Math.abs(delta) <= maxMove) g.cpuY = cpuTarget;
    else g.cpuY += Math.sign(delta) * maxMove;
    g.cpuY = Math.max(0, Math.min(g.height - g.paddleH, g.cpuY));

    // ball movement
    g.ballX += g.ballVX * dt;
    g.ballY += g.ballVY * dt;

    // wall bounce (top/bottom)
    if (g.ballY - g.ballR <= 0) {
      g.ballY = g.ballR;
      g.ballVY *= -1;
    } else if (g.ballY + g.ballR >= g.height) {
      g.ballY = g.height - g.ballR;
      g.ballVY *= -1;
    }

    const leftX = g.paddleInset;
    const rightX = g.width - g.paddleInset - g.paddleW;

    // paddle collisions
    const ballTop = g.ballY - g.ballR;
    const ballBottom = g.ballY + g.ballR;

    // left paddle
    if (g.ballVX < 0 && g.ballX - g.ballR <= leftX + g.paddleW) {
      const paddleTop = g.playerY;
      const paddleBottom = g.playerY + g.paddleH;
      if (ballBottom >= paddleTop && ballTop <= paddleBottom) {
        g.ballX = leftX + g.paddleW + g.ballR;
        g.ballVX *= -1;

        // add "english" depending on hit position
        const hit = (g.ballY - (g.playerY + g.paddleH / 2)) / (g.paddleH / 2);
        g.ballVY += hit * 140;
        g.ballVX *= 1.03;
        g.ballVY *= 1.01;
      }
    }

    // right paddle
    if (g.ballVX > 0 && g.ballX + g.ballR >= rightX) {
      const paddleTop = g.cpuY;
      const paddleBottom = g.cpuY + g.paddleH;
      if (ballBottom >= paddleTop && ballTop <= paddleBottom) {
        g.ballX = rightX - g.ballR;
        g.ballVX *= -1;
        const hit = (g.ballY - (g.cpuY + g.paddleH / 2)) / (g.paddleH / 2);
        g.ballVY += hit * 110;
        g.ballVX *= 1.02;
        g.ballVY *= 1.01;
      }
    }

    // scoring
    if (g.ballX + g.ballR < 0) {
      // CPU scores
      g.score = { ...g.score, cpu: g.score.cpu + 1 };
      setScore(g.score);
      if (g.score.cpu >= g.winningScore) {
        g.running = false;
        setStatus("gameover");
        return;
      }
      resetRound(1);
    } else if (g.ballX - g.ballR > g.width) {
      // Player scores
      g.score = { ...g.score, player: g.score.player + 1 };
      setScore(g.score);
      if (g.score.player >= g.winningScore) {
        g.running = false;
        setStatus("gameover");
        return;
      }
      resetRound(-1);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = gameRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, g.width, g.height);

    // center dashed line
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    ctx.moveTo(g.width / 2, 8);
    ctx.lineTo(g.width / 2, g.height - 8);
    ctx.stroke();
    ctx.setLineDash([]);

    // paddles
    ctx.fillStyle = colors.fg;
    ctx.fillRect(g.paddleInset, g.playerY, g.paddleW, g.paddleH);
    ctx.fillRect(
      g.width - g.paddleInset - g.paddleW,
      g.cpuY,
      g.paddleW,
      g.paddleH
    );

    // ball
    ctx.fillStyle = colors.accent2;
    ctx.beginPath();
    ctx.arc(g.ballX, g.ballY, g.ballR, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    // init positions
    resetRound(Math.random() > 0.5 ? 1 : -1);

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (e.key === "Escape" || key === "q") {
        e.preventDefault();
        onExit();
        return;
      }

      if (key === "p" || key === " ") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (key === "r") {
        e.preventDefault();
        resetGame();
        return;
      }

      if (key === "w" || e.key === "ArrowUp") {
        e.preventDefault();
        pressedRef.current.up = true;
      } else if (key === "s" || e.key === "ArrowDown") {
        e.preventDefault();
        pressedRef.current.down = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "w" || e.key === "ArrowUp") pressedRef.current.up = false;
      if (key === "s" || e.key === "ArrowDown") pressedRef.current.down = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(0.033, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      step(dt);
      draw();

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep canvas backing size in sync
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = gameRef.current.width;
    canvas.height = gameRef.current.height;
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-mocha-text">
          <span className="text-mocha-green font-bold">pong</span>{" "}
          <span className="text-mocha-subtext">— first to 7</span>
        </div>
        <div className="font-mono text-mocha-text">
          <span className="text-mocha-subtext">You</span>{" "}
          <span className="text-mocha-text font-bold">{score.player}</span>
          <span className="text-mocha-subtext"> : </span>
          <span className="text-mocha-text font-bold">{score.cpu}</span>{" "}
          <span className="text-mocha-subtext">CPU</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="border border-mocha-surface1 rounded-md overflow-hidden bg-mocha-base">
          <canvas
            ref={canvasRef}
            className="block w-[720px] max-w-[92vw] h-auto"
          />
        </div>
      </div>

      <div className="text-sm text-mocha-subtext font-mono space-y-1">
        <div>
          <span className="text-mocha-text">Controls:</span> W/S or ↑/↓ to move •
          Space/P to pause • R to restart • Esc/Q to quit
        </div>
        {status === "paused" && (
          <div className="text-mocha-yellow">Paused</div>
        )}
        {status === "gameover" && (
          <div className="text-mocha-mauve">
            Game over — {score.player > score.cpu ? "You win" : "CPU wins"}.
            Press R to play again or Esc to exit.
          </div>
        )}
      </div>
    </div>
  );
}

