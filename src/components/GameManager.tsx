"use client"

import { useState } from "react"

import { LevelManager } from "./levels/LevelManager"
import type { JSONLevels, Level } from "./levels/levels"

import jsonLevels from "./levels/levels.json"

import "./game-manager.css"

const DEFAULT: {
    cycleInterval: number,
    levelIndex: number,
    isPaused: boolean
} = {
    cycleInterval: 0.5,
    levelIndex: 1,
    isPaused: true
}

const MIN_INTERVAL_VALUE: number = 0;
const MAX_INTERVAL_VALUE: number = 1;

export const GameManager = () => {
    const { levels } = jsonLevels as JSONLevels;

    const [cycleInterval, setCycleInterval] = useState<number>(DEFAULT.cycleInterval)
    const [isPaused, setIsPaused] = useState<boolean>(DEFAULT.isPaused)
    const [level, setLevel] = useState<Level | undefined>(levels[DEFAULT.levelIndex] ?? undefined)

    const levelOptions = levels.map(level => ({
        value: level.name,
        label: level.label,
    }))

    const togglePause = () => setIsPaused(!isPaused);

    const handleInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setCycleInterval(value);
    };

    const handleLevel = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const levelName = event.target.value;
        const newLevel = levels.find(level => level.name === levelName)
        setLevel(newLevel)
    }

    return (
        <div className="game-manager">
            <div className="tools">
                <button
                    onClick={togglePause}
                    className={`pauseButton ${isPaused ? "pauseButton--isPaused" : ""}`}
                >
                    {isPaused ? "Reprendre" : "Pause"}
                </button>

                <div className="cycleInterval">
                    <label htmlFor="cycleInterval">
                        Durée d&apos;un cycle : {cycleInterval}s
                    </label>
                    <div>
                        <span>{MIN_INTERVAL_VALUE}</span>
                        <input
                            id="cycleInterval"
                            name="cycleInterval"
                            type="range"
                            min={MIN_INTERVAL_VALUE}
                            max={MAX_INTERVAL_VALUE}
                            step={0.1}
                            value={cycleInterval}
                            onChange={handleInterval}
                        />
                        <span>{MAX_INTERVAL_VALUE}</span>
                    </div>
                </div>

                <select
                    id="level"
                    name="level"
                    value={level?.name ?? ""}
                    onChange={handleLevel}
                    className="levelSelect"
                >
                    {levelOptions.map((level, index) => (
                        <option
                            key={index}
                            value={level.value}
                        >
                            {level.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="levelManager">
                <LevelManager
                    level={level}
                    options={{
                        cycleInterval,
                        isPaused
                    }}
                />
            </div>
        </div>
    )
}