export interface Level {
    name: string;
    label: string;
    matrix: string[][];
};

export type Levels = Level[];

export interface JSONLevels {
    levels: Levels;
};
