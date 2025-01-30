export type NeighborDirection =
    | "top"
    | "right"
    | "left"
    | "bottom"
    | "topRight"
    | "topLeft"
    | "bottomRight"
    | "bottomLeft";

export type Neighbors<T> = Record<NeighborDirection, T | null>;
