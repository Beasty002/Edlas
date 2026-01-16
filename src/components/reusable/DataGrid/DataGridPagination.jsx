import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/**
 * DataGrid Pagination Component
 * @param {Object} props
 * @param {Object} props.config - Pagination configuration
 * @param {number} props.config.page - Current page number
 * @param {number} props.config.pageSize - Items per page
 * @param {number} props.config.total - Total number of items
 * @param {number[]} [props.config.pageSizeOptions] - Page size options
 * @param {Function} props.config.onPageChange - Page change handler
 * @param {Function} props.config.onPageSizeChange - Page size change handler
 */
export function DataGridPagination({ config }) {
    const {
        page,
        pageSize,
        total,
        pageSizeOptions = [5, 10, 15, 20, 25],
        onPageChange,
        onPageSizeChange,
    } = config;

    const totalPages = Math.ceil(total / pageSize) || 1;

    return (
        <div className="flex justify-between items-center gap-4 mt-4 px-2">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                        onPageSizeChange(Number(value));
                        onPageChange(1); // Reset to first page
                    }}
                >
                    <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    {((page - 1) * pageSize) + 1}
                    -
                    {Math.min(page * pageSize, total)}
                    {' '}
                    of
                    {' '}
                    {total}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    <ChevronLeft size={16} />
                </Button>
                <span className="text-sm">
                    <span className="hidden sm:inline">
                        Page
                        {' '}
                        {page}
                        {' '}
                        of
                        {' '}
                        {totalPages}
                    </span>
                    <span className="inline sm:hidden">
                        {page}
                        /
                        {totalPages}
                    </span>
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
}
