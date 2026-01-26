import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Link as LinkIcon,
    FileText,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DESCRIPTION_LIMIT = 150;

const getContentTypeConfig = (type) => {
    switch (type) {
        case "message":
            return {
                label: "Message",
                icon: MessageSquare,
                gradient: "from-blue-500/20 to-blue-600/10",
                iconBg: "bg-blue-100 dark:bg-blue-900/40",
                iconColor: "text-blue-600 dark:text-blue-400",
                badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            };
        case "link":
            return {
                label: "Link",
                icon: LinkIcon,
                gradient: "from-purple-500/20 to-purple-600/10",
                iconBg: "bg-purple-100 dark:bg-purple-900/40",
                iconColor: "text-purple-600 dark:text-purple-400",
                badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            };
        case "blog":
            return {
                label: "Blog",
                icon: FileText,
                gradient: "from-emerald-500/20 to-emerald-600/10",
                iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
                iconColor: "text-emerald-600 dark:text-emerald-400",
                badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            };
        default:
            return {
                label: type,
                icon: MessageSquare,
                gradient: "from-gray-500/20 to-gray-600/10",
                iconBg: "bg-gray-100 dark:bg-gray-800",
                iconColor: "text-gray-600 dark:text-gray-400",
                badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            };
    }
};

const AnnouncementCard = ({ announcement }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const config = getContentTypeConfig(announcement.contentType);
    const Icon = config.icon;

    const description = announcement.description || "";
    const isLongDescription = description.length > DESCRIPTION_LIMIT;
    const displayDescription = isExpanded
        ? description
        : description.slice(0, DESCRIPTION_LIMIT) + (isLongDescription ? "..." : "");

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-700/60",
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                "shadow-sm hover:shadow-lg transition-all duration-300",
                "hover:border-gray-300 dark:hover:border-gray-600",
                "flex flex-col"
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    config.gradient
                )}
            />

            {announcement.contentType === "blog" && announcement.imageUrl && (
                <div className="relative overflow-hidden">
                    <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            )}

            <div className="relative flex flex-col flex-1 p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className={cn("p-2 rounded-lg shrink-0", config.iconBg)}>
                        <Icon className={cn("h-5 w-5", config.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge className={cn("text-xs font-medium", config.badgeClass)}>
                                {config.label}
                            </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {announcement.title}
                        </h3>
                    </div>
                </div>

                <div className="flex-1 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {displayDescription}
                    </p>
                    {isLongDescription && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 h-auto p-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Show More
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {announcement.contentType === "link" && announcement.linkUrl && (
                    <a
                        href={announcement.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg",
                            "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                            "hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors",
                            "text-sm font-medium truncate"
                        )}
                    >
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        <span className="truncate">{announcement.linkUrl}</span>
                    </a>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {announcement.createdAt
                            ? format(new Date(announcement.createdAt), "MMM d, yyyy")
                            : "—"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;
