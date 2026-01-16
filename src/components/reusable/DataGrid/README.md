# DataGrid Component

A flexible, feature-rich data grid component for displaying tabular data with support for sorting, pagination, actions, bulk operations, and custom cell rendering.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Props Reference](#props-reference)
- [Column Configuration](#column-configuration)
- [Features](#features)
  - [Server-Side Sorting](#server-side-sorting)
  - [Pagination](#pagination)
  - [Row Actions](#row-actions)
  - [Bulk Actions](#bulk-actions)
  - [Custom Cell Templates](#custom-cell-templates)
  - [Value Formatting](#value-formatting)
  - [Loading States](#loading-states)
- [Complete Example](#complete-example)

---

## Installation

The DataGrid component is located at `@/components/DataGrid`. Import it along with the required types:

```tsx
import {
    DataGrid,
    type ColumnConfig,
    type ActionConfig,
    type BulkActionConfig,
    type PaginationConfig,
} from '@/components/DataGrid';
```

---

## Quick Start

```tsx
interface User {
    id: number;
    name: string;
    email: string;
}

const columns: ColumnConfig<User>[] = [
    { field: 'id', headerText: 'ID', width: 60 },
    { field: 'name', headerText: 'Name', width: 150 },
    { field: 'email', headerText: 'Email', width: 200 },
];

function MyTable() {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    return <DataGrid columns={columns} data={users} />;
}
```

---

## Props Reference

### DataGridProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnConfig<T>[]` | **required** | Array of column configurations |
| `data` | `T[]` | **required** | Array of data objects to display |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `skeletonRowCount` | `number` | `5` | Number of skeleton rows when loading |
| `pagination` | `PaginationConfig` | - | Enable pagination |
| `actionConfig` | `ActionConfig<T>` | - | Configure row actions |
| `bulkActionConfig` | `BulkActionConfig<T>` | - | Enable bulk selection and actions |
| `emptyMessage` | `string` | `'No data found'` | Message when data is empty |
| `emptyComponent` | `ReactNode` | - | Custom empty state component |
| `onRowClick` | `(data: T) => void` | - | Row click handler |
| `className` | `string` | - | Additional CSS classes |
| `keyField` | `keyof T` | `'id'` | Unique identifier field |
| `sortConfig` | `SortConfig` | - | Current sort state (for server-side sorting) |
| `onSort` | `(ordering: string \| null) => void` | - | Sort change callback |

---

## Column Configuration

### ColumnConfig Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `field` | `keyof T` | **required** | Data field key |
| `headerText` | `string` | **required** | Column header text |
| `width` | `number \| string` | - | Column width (e.g., `120`, `'15%'`) |
| `minWidth` | `number` | - | Minimum width in pixels |
| `maxWidth` | `number` | - | Maximum width in pixels |
| `visible` | `boolean` | `true` | Show/hide column |
| `textAlign` | `'Left' \| 'Right' \| 'Center'` | `'Left'` | Text alignment |
| `format` | `FormatType` | - | Value formatting (`'C2'`, `'N2'`, date format) |
| `type` | `'string' \| 'number' \| 'date' \| 'boolean'` | `'string'` | Data type for formatting |
| `allowSorting` | `boolean` | `true` | Enable sorting for this column |
| `template` | `(data: T, rowIndex: number) => ReactNode` | - | Custom cell renderer |

### Column Examples

```tsx
const columns: ColumnConfig<Product>[] = [
    // Basic column
    { field: 'name', headerText: 'Product Name', width: 200 },

    // Number with currency format
    { field: 'price', headerText: 'Price', format: 'C2', textAlign: 'Right' },

    // Number with decimal format
    { field: 'quantity', headerText: 'Qty', format: 'N2', type: 'number' },

    // Date column
    { field: 'createdAt', headerText: 'Created', type: 'date', format: 'dd MMM yyyy' },

    // Boolean column
    { field: 'isActive', headerText: 'Active', type: 'boolean' },

    // Column with disabled sorting
    { field: 'notes', headerText: 'Notes', allowSorting: false },

    // Hidden column
    { field: 'internalId', headerText: 'Internal ID', visible: false },

    // Custom template
    {
        field: 'status',
        headerText: 'Status',
        template: (item) => (
            <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                {item.status}
            </Badge>
        ),
    },
];
```

---

## Features

### Server-Side Sorting

DataGrid supports server-side sorting via the `ordering` parameter pattern commonly used in REST APIs (e.g., Django REST Framework).

**How it works:**
- Clicking a column header cycles through: **ascending → descending → no sort**
- The `onSort` callback receives an ordering string:
  - `"field_name"` for ascending
  - `"-field_name"` for descending (note the `-` prefix)
  - `null` when sort is cleared

```tsx
function MyTable() {
    const [ordering, setOrdering] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['items', page, ordering],
        queryFn: async () => {
            let url = `/api/items/?page=${page}`;
            if (ordering) {
                url += `&ordering=${ordering}`;
            }
            return fetch(url).then(res => res.json());
        },
    });

    // Derive sortConfig from ordering string for visual feedback
    const sortConfig = ordering
        ? {
            field: ordering.startsWith('-') ? ordering.slice(1) : ordering,
            direction: ordering.startsWith('-') ? 'desc' as const : 'asc' as const,
        }
        : { field: '', direction: null };

    const handleSort = (newOrdering: string | null) => {
        setOrdering(newOrdering);
        setPage(1); // Reset to first page on sort change
    };

    return (
        <DataGrid
            columns={columns}
            data={data?.results || []}
            isLoading={isLoading}
            sortConfig={sortConfig}
            onSort={handleSort}
        />
    );
}
```

> **Note:** If you don't provide `onSort`, the DataGrid will use internal state for client-side sorting indication (but won't actually sort the data).

---

### Pagination

Enable server-side pagination with the `pagination` prop:

```tsx
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

<DataGrid
    columns={columns}
    data={data?.results || []}
    pagination={{
        page,
        pageSize,
        total: data?.count || 0,
        pageSizeOptions: [5, 10, 20, 50], // Optional, defaults to [5, 10, 15, 20, 25]
        onPageChange: setPage,
        onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1); // Reset to first page
        },
    }}
/>
```

---

### Row Actions

Add action buttons to each row using `actionConfig`. Two modes are available:

#### Dropdown Mode (Recommended)

Shows a "..." button that opens a dropdown menu:

```tsx
const actionConfig: ActionConfig<User> = {
    mode: 'dropdown',
    showOnHover: false, // Always show the button (set true to show only on hover)
    width: 80,
    actions: [
        {
            label: 'Edit',
            icon: <Pencil className="h-4 w-4" />,
            onClick: (user) => openEditModal(user),
        },
        {
            label: 'Assign',
            onClick: (user) => assignUser(user),
        },
        {
            label: 'Delete',
            icon: <Trash className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (user) => deleteUser(user.id),
            hidden: (user) => !user.canDelete, // Conditionally hide
        },
    ],
};

<DataGrid columns={columns} data={users} actionConfig={actionConfig} />
```

#### Icons Mode

Shows action buttons inline with tooltips:

```tsx
const actionConfig: ActionConfig<User> = {
    mode: 'icons',
    actions: [
        {
            label: 'Edit', // Used as tooltip
            icon: <Pencil className="h-4 w-4" />,
            onClick: (user) => openEditModal(user),
        },
        {
            label: 'Delete',
            icon: <Trash className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (user) => deleteUser(user.id),
        },
    ],
};
```

---

### Bulk Actions

Enable row selection with checkboxes and bulk operations:

```tsx
const bulkActionConfig: BulkActionConfig<User> = {
    enabled: true,
    actions: [
        {
            label: 'Delete Selected',
            icon: <Trash className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (selectedUsers) => {
                const ids = selectedUsers.map(u => u.id);
                deleteMultiple(ids);
            },
        },
        {
            label: 'Export',
            icon: <Download className="h-4 w-4" />,
            onClick: (selectedUsers) => exportToCsv(selectedUsers),
        },
    ],
};

<DataGrid
    columns={columns}
    data={users}
    bulkActionConfig={bulkActionConfig}
/>
```

When rows are selected, a toolbar appears above the table showing count and action buttons.

---

### Custom Cell Templates

Use the `template` property in column config for custom rendering:

```tsx
const columns: ColumnConfig<User>[] = [
    {
        field: 'avatar',
        headerText: 'Avatar',
        width: 60,
        allowSorting: false,
        template: (user) => (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
        ),
    },
    {
        field: 'status',
        headerText: 'Status',
        template: (user) => {
            const colors = {
                active: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                inactive: 'bg-gray-100 text-gray-800',
            };
            return (
                <Badge className={colors[user.status]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
            );
        },
    },
    {
        field: 'tags',
        headerText: 'Tags',
        allowSorting: false,
        template: (user) => (
            <div className="flex gap-1">
                {user.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
            </div>
        ),
    },
];
```

---

### Value Formatting

Built-in formatters for common data types:

| Format | Description | Example Input | Example Output |
|--------|-------------|---------------|----------------|
| `'C2'` | Currency (USD, 2 decimals) | `1234.5` | `$1,234.50` |
| `'N2'` | Number (2 decimals) | `1234.567` | `1,234.57` |
| `'dd MMM yyyy'` | Date format | `'2024-01-15'` | `15 Jan 2024` |
| `type: 'boolean'` | Boolean | `true` | `Yes` |

```tsx
const columns: ColumnConfig<Order>[] = [
    { field: 'total', headerText: 'Total', format: 'C2', textAlign: 'Right' },
    { field: 'quantity', headerText: 'Qty', format: 'N2' },
    { field: 'orderDate', headerText: 'Date', type: 'date', format: 'dd/MM/yyyy' },
    { field: 'isPaid', headerText: 'Paid', type: 'boolean' },
];
```

---

### Loading States

Show a skeleton loader while data is being fetched:

```tsx
const { data, isLoading } = useQuery({ ... });

<DataGrid
    columns={columns}
    data={data || []}
    isLoading={isLoading}
    skeletonRowCount={10} // Number of skeleton rows (default: 5)
/>
```

The skeleton automatically matches your column configuration.

---

## Complete Example

Here's a full example demonstrating most features:

```tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash, Download } from 'lucide-react';

import {
    DataGrid,
    type ColumnConfig,
    type ActionConfig,
} from '@/components/DataGrid';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface User {
    id: number;
    full_name: string;
    email: string;
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
    balance: number;
}

const columns: ColumnConfig<User>[] = [
    { field: 'id', headerText: 'ID', width: 60 },
    { field: 'full_name', headerText: 'Name', width: 150 },
    { field: 'email', headerText: 'Email', width: 200 },
    {
        field: 'status',
        headerText: 'Status',
        width: 100,
        template: (user) => {
            const styles = {
                active: 'bg-green-100 text-green-800',
                inactive: 'bg-gray-100 text-gray-800',
                pending: 'bg-yellow-100 text-yellow-800',
            };
            return <Badge className={styles[user.status]}>{user.status}</Badge>;
        },
    },
    {
        field: 'balance',
        headerText: 'Balance',
        format: 'C2',
        textAlign: 'Right',
        width: 120,
    },
    {
        field: 'created_at',
        headerText: 'Joined',
        type: 'date',
        format: 'dd MMM yyyy',
        width: 120,
    },
];

const actionConfig: ActionConfig<User> = {
    mode: 'dropdown',
    showOnHover: false,
    actions: [
        {
            label: 'Edit',
            icon: <Pencil className="h-4 w-4" />,
            onClick: (user) => console.log('Edit:', user),
        },
        {
            label: 'Delete',
            icon: <Trash className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (user) => console.log('Delete:', user),
            hidden: (user) => user.status === 'active', // Can't delete active users
        },
    ],
};

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [ordering, setOrdering] = useState<string | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch data
    const { data, isLoading } = useQuery({
        queryKey: ['users', page, pageSize, debouncedSearch, ordering],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                page_size: String(pageSize),
                search: debouncedSearch,
            });
            if (ordering) params.append('ordering', ordering);
            
            const res = await fetch(`/api/users/?${params}`);
            return res.json();
        },
    });

    // Derive sortConfig from ordering
    const sortConfig = ordering
        ? {
            field: ordering.startsWith('-') ? ordering.slice(1) : ordering,
            direction: ordering.startsWith('-') ? 'desc' as const : 'asc' as const,
        }
        : { field: '', direction: null };

    const handleSort = (newOrdering: string | null) => {
        setOrdering(newOrdering);
        setPage(1);
    };

    return (
        <Card className="p-6 space-y-4">
            <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />

            <DataGrid
                columns={columns}
                data={data?.results || []}
                isLoading={isLoading}
                actionConfig={actionConfig}
                emptyMessage="No users found"
                sortConfig={sortConfig}
                onSort={handleSort}
                onRowClick={(user) => console.log('Row clicked:', user)}
                pagination={{
                    page,
                    pageSize,
                    total: data?.count || 0,
                    onPageChange: setPage,
                    onPageSizeChange: (size) => {
                        setPageSize(size);
                        setPage(1);
                    },
                }}
            />
        </Card>
    );
}
```

---

## File Structure

```
src/components/DataGrid/
├── index.tsx              # Main DataGrid component
├── DataGridActions.tsx    # Action column (dropdown/icons)
├── DataGridPagination.tsx # Pagination controls
├── DataGridSkeleton.tsx   # Loading skeleton
├── formatters.ts          # Value formatters (currency, date, etc.)
└── README.md              # This documentation
```

---

## Type Exports

All types are exported from the main component:

```tsx
export type {
    ActionConfig,
    ActionItem,
    BulkActionConfig,
    BulkActionItem,
    ColumnConfig,
    ColumnType,
    DataGridProps,
    FormatType,
    PaginationConfig,
    SortConfig,
    SortDirection,
    TextAlign,
} from '@/types/dataGrid';
```
