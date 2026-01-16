import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
} from 'lucide-react';

import { DataGridActions } from './DataGridActions';
import { DataGridPagination } from './DataGridPagination';
import { DataGridSkeleton } from './DataGridSkeleton';
import { formatValue } from './formatters';

import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/**
 * Get CSS text-align value from column config
 */
function getTextAlign(align) {
    switch (align) {
        case 'Left':
            return 'left';
        case 'Right':
            return 'right';
        case 'Center':
            return 'center';
        default:
            return 'left';
    }
}

/**
 * Get CSS justify-content value from column config
 */
function getJustifyContent(align) {
    switch (align) {
        case 'Right':
            return 'flex-end';
        case 'Center':
            return 'center';
        default:
            return 'flex-start';
    }
}

/**
 * DataGrid Component
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column configurations
 * @param {Array} props.data - Array of data rows
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {number} [props.skeletonRowCount=5] - Number of skeleton rows to show
 * @param {Object} [props.pagination] - Pagination configuration
 * @param {Object} [props.actionConfig] - Action column configuration
 * @param {Object} [props.bulkActionConfig] - Bulk action configuration
 * @param {string} [props.emptyMessage='No data found'] - Message when no data
 * @param {React.ReactNode} [props.emptyComponent] - Custom empty component
 * @param {Function} [props.onRowClick] - Row click handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.keyField='id'] - Field to use as row key
 * @param {Object} [props.sortConfig] - External sort configuration
 * @param {Function} [props.onSort] - Sort handler
 */
export function DataGrid({
    columns,
    data,
    isLoading = false,
    skeletonRowCount = 5,
    pagination,
    actionConfig,
    bulkActionConfig,
    emptyMessage = 'No data found',
    emptyComponent,
    onRowClick,
    className,
    keyField = 'id',
    sortConfig: externalSortConfig,
    onSort,
}) {
    // ============================================================
    // STATE
    // ============================================================

    // Use internal state only if no external sort control is provided
    const [internalSortConfig, setInternalSortConfig] = useState({ field: '', direction: null });
    const sortConfig = externalSortConfig ?? internalSortConfig;

    const [selectedRows, setSelectedRows] = useState(new Set());
    const [hoveredRow, setHoveredRow] = useState(null);

    // ============================================================
    // COMPUTED VALUES
    // ============================================================

    const visibleColumns = useMemo(
        () => columns.filter((col) => col.visible !== false),
        [columns],
    );

    const showBulkActions = bulkActionConfig?.enabled ?? false;
    const showActionColumn = !!actionConfig && actionConfig.actions.length > 0;

    // ============================================================
    // HANDLERS
    // ============================================================

    const handleSort = useCallback((field, allowSorting) => {
        if (allowSorting === false) return;

        // Calculate next sort state
        let nextSortConfig;
        if (sortConfig.field !== field) {
            nextSortConfig = { field, direction: 'asc' };
        } else if (sortConfig.direction === 'asc') {
            nextSortConfig = { field, direction: 'desc' };
        } else {
            nextSortConfig = { field: '', direction: null };
        }

        if (onSort) {
            if (!nextSortConfig.field || !nextSortConfig.direction) {
                onSort(null);
            } else {
                // Format: 'field' for asc, '-field' for desc
                const ordering = nextSortConfig.direction === 'desc'
                    ? `-${nextSortConfig.field}`
                    : nextSortConfig.field;
                onSort(ordering);
            }
        } else {
            setInternalSortConfig(nextSortConfig);
        }
    }, [sortConfig, onSort]);

    const handleSelectAll = useCallback(() => {
        if (selectedRows.size === data.length) {
            setSelectedRows(new Set());
        } else {
            const allKeys = data.map((row) => row[keyField]);
            setSelectedRows(new Set(allKeys));
        }
    }, [data, keyField, selectedRows.size]);

    const handleSelectRow = useCallback((key) => {
        setSelectedRows((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }, []);

    const getSelectedData = useCallback(
        () => data.filter((row) => selectedRows.has(row[keyField])),
        [data, keyField, selectedRows],
    );

    // ============================================================
    // RENDER HELPERS
    // ============================================================

    const renderSortIcon = (column) => {
        if (column.allowSorting === false) return null;

        const field = String(column.field);
        if (sortConfig.field !== field) {
            return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
        }
        if (sortConfig.direction === 'asc') {
            return <ArrowUp className="ml-1 h-3 w-3" />;
        }
        if (sortConfig.direction === 'desc') {
            return <ArrowDown className="ml-1 h-3 w-3" />;
        }
        return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    };

    const renderCellValue = (row, column, rowIndex) => {
        // Use custom template if provided
        if (column.template) {
            return column.template(row, rowIndex);
        }

        const value = row[column.field];
        return formatValue(value, column.format, column.type);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className={cn('space-y-4', className)}>
            {/* Bulk Actions Toolbar */}
            {showBulkActions && selectedRows.size > 0 && bulkActionConfig && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <span className="text-sm text-muted-foreground">
                        {selectedRows.size}
                        {' '}
                        item(s) selected
                    </span>
                    <div className="flex gap-2 ml-auto">
                        {bulkActionConfig.actions.map((action) => (
                            <button
                                key={action.label}
                                type="button"
                                className={cn(
                                    'inline-flex items-center gap-1 px-3 py-1.5 text-sm',
                                    'rounded-md transition-colors',
                                    action.variant === 'destructive'
                                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                        : 'bg-primary text-primary-foreground hover:bg-primary/90',
                                )}
                                onClick={() => action.onClick(getSelectedData())}
                            >
                                {action.icon}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="relative overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            {/* Checkbox column */}
                            {showBulkActions && (
                                <TableHead className="w-[40px]">
                                    <Checkbox
                                        checked={
                                            data.length > 0
                                            && selectedRows.size === data.length
                                        }
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                            )}

                            {/* Data columns */}
                            {visibleColumns.map((column) => {
                                const width = typeof column.width === 'number'
                                    ? `${column.width}px`
                                    : column.width;

                                return (
                                    <TableHead
                                        key={String(column.field)}
                                        className={cn(
                                            'select-none',
                                            column.allowSorting !== false && 'cursor-pointer hover:bg-muted',
                                        )}
                                        style={{
                                            width,
                                            minWidth: column.minWidth,
                                            maxWidth: column.maxWidth,
                                            textAlign: getTextAlign(column.textAlign),
                                        }}
                                        onClick={() => {
                                            handleSort(String(column.field), column.allowSorting);
                                        }}
                                    >
                                        <div
                                            className="flex items-center"
                                            style={{
                                                justifyContent: getJustifyContent(column.textAlign),
                                            }}
                                        >
                                            {column.headerText}
                                            {renderSortIcon(column)}
                                        </div>
                                    </TableHead>
                                );
                            })}

                            {/* Action column header */}
                            {showActionColumn && (
                                <TableHead
                                    className="text-right"
                                    style={{ width: actionConfig.width || 80 }}
                                >
                                    {actionConfig.showHeader !== false
                                        ? (actionConfig.headerText || 'Actions')
                                        : ''}
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {/* Loading skeleton */}
                        {isLoading && (
                            <DataGridSkeleton
                                columns={columns}
                                rowCount={skeletonRowCount}
                                showCheckbox={showBulkActions}
                                showActions={showActionColumn}
                            />
                        )}

                        {/* Empty state */}
                        {!isLoading && data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        visibleColumns.length
                                        + (showBulkActions ? 1 : 0)
                                        + (showActionColumn ? 1 : 0)
                                    }
                                    className="h-24 text-center"
                                >
                                    {emptyComponent || (
                                        <span className="text-muted-foreground">{emptyMessage}</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Data rows */}
                        {!isLoading && data.map((row, rowIndex) => {
                            const rowKey = row[keyField] ?? rowIndex;
                            const isSelected = selectedRows.has(rowKey);
                            const isHovered = hoveredRow === rowKey;

                            return (
                                <TableRow
                                    key={rowKey}
                                    className={cn(
                                        'transition-colors',
                                        isSelected && 'bg-muted',
                                        onRowClick && 'cursor-pointer',
                                    )}
                                    data-state={isSelected ? 'selected' : undefined}
                                    onClick={() => onRowClick?.(row)}
                                    onMouseEnter={() => setHoveredRow(rowKey)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    {/* Checkbox */}
                                    {showBulkActions && (
                                        <TableCell className="w-[40px]">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => handleSelectRow(rowKey)}
                                                onClick={(e) => e.stopPropagation()}
                                                aria-label={`Select row ${rowIndex + 1}`}
                                            />
                                        </TableCell>
                                    )}

                                    {/* Data cells */}
                                    {visibleColumns.map((column) => {
                                        const width = typeof column.width === 'number'
                                            ? `${column.width}px`
                                            : column.width;

                                        return (
                                            <TableCell
                                                key={String(column.field)}
                                                style={{
                                                    width,
                                                    minWidth: column.minWidth,
                                                    maxWidth: column.maxWidth,
                                                    textAlign: getTextAlign(column.textAlign),
                                                }}
                                            >
                                                {renderCellValue(row, column, rowIndex)}
                                            </TableCell>
                                        );
                                    })}

                                    {/* Action cell */}
                                    {showActionColumn && actionConfig && (
                                        <TableCell
                                            style={{ width: actionConfig.width || 80 }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <DataGridActions
                                                config={actionConfig}
                                                data={row}
                                                isHovered={isHovered}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && <DataGridPagination config={pagination} />}
        </div>
    );
}
