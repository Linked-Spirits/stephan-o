"use client"

import { useState, useEffect, useRef } from "react";
import type { Level } from "./levels";
import { GameBoard } from "../game-board/GameBoard";

interface LevelManagerProps {
    level?: Level;
    options: {
        cycleInterval: number;
        isPaused: boolean;
    }
}

export const LevelManager = ({
    level,
    options: { cycleInterval, isPaused }
}: LevelManagerProps) => {
    const gameBoardRef = useRef<GameBoard | null>(null);
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        if (level) {
            gameBoardRef.current = new GameBoard(level);
            forceUpdate(prev => prev + 1);
        }
    }, [level]);

    const gameBoard = gameBoardRef.current;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && gameBoard) {
                gameBoard.update();
                forceUpdate(prev => prev + 1);
            }
        }, cycleInterval * 1000);

        return () => clearInterval(interval);
    }, [cycleInterval, isPaused, gameBoard]);

    if (!level) {
        return <p>Veuillez sélectionner un niveau</p>;
    }

    return gameBoard?.render();
};
