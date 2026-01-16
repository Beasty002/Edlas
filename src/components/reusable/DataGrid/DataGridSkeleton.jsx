import { useMemo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';

/**
 * DataGrid Skeleton Component for loading state
 * @param {Object} props
 * @param {Array} props.columns - Column configurations
 * @param {number} [props.rowCount=5] - Number of skeleton rows
 * @param {boolean} [props.showCheckbox=false] - Show checkbox column
 * @param {boolean} [props.showActions=false] - Show actions column
 */
export function DataGridSkeleton({
    columns,
    rowCount = 5,
    showCheckbox = false,
    showActions = false,
}) {
    const visibleColumns = columns.filter((col) => col.visible !== false);

    // Generate stable random widths for skeleton cells
    const skeletonWidths = useMemo(() => Array.from(
        { length: rowCount },
        () => visibleColumns.map(() => `${Math.random() * 40 + 50}%`),
    ), [rowCount, visibleColumns]);

    return (
        <>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${String(rowIndex)}`} className="hover:bg-transparent">
                    {showCheckbox && (
                        <TableCell className="w-[40px]">
                            <Skeleton className="h-4 w-4" />
                        </TableCell>
                    )}
                    {visibleColumns.map((column, colIndex) => {
                        const width = typeof column.width === 'number'
                            ? `${column.width}px`
                            : column.width;

                        return (
                            <TableCell
                                key={`skeleton-cell-${String(column.field)}`}
                                style={{
                                    width,
                                    minWidth: column.minWidth,
                                    maxWidth: column.maxWidth,
                                }}
                            >
                                <Skeleton
                                    className="h-4"
                                    style={{
                                        width: skeletonWidths[rowIndex]?.[colIndex] ?? '60%',
                                    }}
                                />
                            </TableCell>
                        );
                    })}
                    {showActions && (
                        <TableCell className="w-[80px]">
                            <Skeleton className="h-6 w-6 ml-auto" />
                        </TableCell>
                    )}
                </TableRow>
            ))}
        </>
    );
}
