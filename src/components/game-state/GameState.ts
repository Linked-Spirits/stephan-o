export class GameState {
    public currentCycle: number;
    public activeSensors: number[];

    constructor() {
        this.currentCycle = 0;
        this.activeSensors = []
    }

    newCycle() {
        this.currentCycle++;
    }
}
