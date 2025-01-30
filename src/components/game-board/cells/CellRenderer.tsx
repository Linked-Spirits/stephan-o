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

    return (
        <div
            className={classes}
            title={cell.label}
            style={customStyle}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
