import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    Link as LinkIcon,
    FileText,
    Calendar,
    ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DESCRIPTION_LIMIT = 200;

export const getContentTypeConfig = (type) => {
    switch (type) {
        case "message":
            return {
                label: "Message",
                icon: MessageSquare,
                iconBg: "bg-blue-100 dark:bg-blue-900/40",
                iconColor: "text-blue-600 dark:text-blue-400",
                badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            };
        case "link":
            return {
                label: "Link",
                icon: LinkIcon,
                iconBg: "bg-purple-100 dark:bg-purple-900/40",
                iconColor: "text-purple-600 dark:text-purple-400",
                badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            };
        case "blog":
            return {
                label: "Blog",
                icon: FileText,
                iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
                iconColor: "text-emerald-600 dark:text-emerald-400",
                badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            };
        default:
            return {
                label: type,
                icon: MessageSquare,
                iconBg: "bg-gray-100 dark:bg-gray-800",
                iconColor: "text-gray-600 dark:text-gray-400",
                badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            };
    }
};

const AnnouncementCard = ({ announcement, onClick }) => {
    const config = getContentTypeConfig(announcement.contentType);
    const Icon = config.icon;

    const description = announcement.description || "";
    const displayDescription = description.length > DESCRIPTION_LIMIT
        ? description.slice(0, DESCRIPTION_LIMIT) + "..."
        : description;

    return (
        <div
            onClick={onClick}
            className={cn(
                "group cursor-pointer w-full",
                "rounded-lg border border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800",
                "hover:border-gray-300 dark:hover:border-gray-600",
                "hover:shadow-sm transition-all duration-200",
                "p-4"
            )}
        >
            <div className="flex items-start gap-4">
                <div className={cn("p-2.5 rounded-lg shrink-0", config.iconBg)}>
                    <Icon className={cn("h-5 w-5", config.iconColor)} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                        <Badge className={cn("text-xs font-medium", config.badgeClass)}>
                            {config.label}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {announcement.createdAt
                                    ? format(new Date(announcement.createdAt), "MMM d, yyyy")
                                    : "—"}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {announcement.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {displayDescription}
                    </p>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 group-hover:text-blue-500 transition-colors" />
            </div>
        </div>
    );
};

export default AnnouncementCard;
