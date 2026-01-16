import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Action icon button with tooltip
 * @param {Object} props
 * @param {Object} props.action - Action configuration
 * @param {*} props.data - Row data
 */
function ActionIconButton({ action, data }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${action.variant === 'destructive' ? 'hover:text-destructive' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(data);
                    }}
                >
                    {action.icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{action.label}</p>
            </TooltipContent>
        </Tooltip>
    );
}

/**
 * DataGrid Actions Component
 * @param {Object} props
 * @param {Object} props.config - Action configuration
 * @param {*} props.data - Row data
 * @param {boolean} [props.isHovered=true] - Whether row is hovered
 */
export function DataGridActions({
    config,
    data,
    isHovered = true,
}) {
    const { mode, showOnHover, actions } = config;

    // Filter out hidden actions
    const visibleActions = actions.filter(
        (action) => !action.hidden || !action.hidden(data),
    );

    if (visibleActions.length === 0) {
        return null;
    }

    // Dropdown mode (like in Staff component)
    if (mode === 'dropdown') {
        const shouldShow = !showOnHover || isHovered;

        return (
            <div
                className="flex justify-end"
                style={{ opacity: shouldShow ? 1 : 0, transition: 'opacity 0.15s' }}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {visibleActions.map((action) => (
                            <DropdownMenuItem
                                key={action.label}
                                onClick={() => action.onClick(data)}
                                className={action.variant === 'destructive' ? 'text-destructive' : ''}
                            >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    // Icons mode (always visible action buttons)
    return (
        <TooltipProvider>
            <div className="flex justify-end gap-1">
                {visibleActions.map((action) => (
                    <ActionIconButton key={action.label} action={action} data={data} />
                ))}
            </div>
        </TooltipProvider>
    );
}
