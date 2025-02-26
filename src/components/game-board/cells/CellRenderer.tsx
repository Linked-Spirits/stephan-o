import { CSSProperties } from "react";
import { Cell } from "./Cell";

type CellRendererProps = {
    cell: Cell;
    customClasses?: string;
    children?: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?: any
}

export const CellRenderer = ({
    cell,
    customClasses,
    children,
    onClick
}: CellRendererProps) => {
    const { filling } = cell

    const fillingPercentage = filling / 100;
    const customStyle: CSSProperties = {
        "--filling": fillingPercentage,
    } as React.CSSProperties;

    const classes = [
        "cell",
        customClasses,
    ].join(" ")

    const title = `${cell.label} [${cell.coords[0]}, ${cell.coords[1]}] | filling: ${cell.filling}, flowSpeed: ${cell.flowSpeed} | parents: [${cell.fillerParents.map(parent => `[${parent[0]}, ${parent[1]}]`).join(', ')}]`

    return (
        <div
            className={classes}
            title={title}
            style={customStyle}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
