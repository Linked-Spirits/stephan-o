/*



// EXIT

export const ExitCellRenderer = ({ cell }: {
    cell: ExitCell;
}) => {
    const { isTrap } = cell.parameters
    const imgSrc = isTrap ? "/trap-exit.svg" : "/exit.svg"

    return (
        <CellRenderer
            cell={cell}
            customClasses={`exit${isTrap ? " exit--trap" : ""}`}
        >
            <Image
                src={imgSrc}
                alt={cell.label}
                height={100}
                width={100}
            />
        </CellRenderer>
    )
}



// PIPE

export const PipeCellRenderer = ({ cell }: {
    cell: PipeCell;
}) => {
    const { outputs: {
        top, right, bottom, left
    } } = cell.parameters

    let customClasses = "pipe";

    if (top) {
        customClasses += " pipe--top";
    }
    if (right) {
        customClasses += " pipe--right";
    }
    if (bottom) {
        customClasses += " pipe--bottom";
    }
    if (left) {
        customClasses += " pipe--left";
    }

    return (
        <CellRenderer
            cell={cell}
            customClasses={customClasses}
        />
    );
};



// SENSOR 

export const SensorCellRenderer = ({ cell }: {
    cell: SensorCell;
}) => {
    const { isActive } = cell.parameters

    return (
        <CellRenderer
            cell={cell}
            customClasses={`sensor${isActive ? " sensor--isActive" : ""}`}
        />
    )
}
 */