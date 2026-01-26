import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getContentTypeConfig } from "./AnnouncementCard";

const AnnouncementDetailModal = ({ announcement, open, onClose }) => {
    if (!announcement) return null;

    const config = getContentTypeConfig(announcement.contentType);
    const Icon = config.icon;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={cn("p-2 rounded-lg", config.iconBg)}>
                            <Icon className={cn("h-5 w-5", config.iconColor)} />
                        </div>
                        <Badge className={cn("text-xs font-medium", config.badgeClass)}>
                            {config.label}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {announcement.createdAt
                                    ? format(new Date(announcement.createdAt), "MMMM d, yyyy")
                                    : "—"}
                            </span>
                        </div>
                    </div>
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {announcement.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {announcement.contentType === "blog" && announcement.imageUrl && (
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={announcement.imageUrl}
                                alt={announcement.title}
                                className="w-full h-auto max-h-80 object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                        </div>
                    )}

                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {announcement.description}
                        </p>
                    </div>

                    {announcement.contentType === "link" && announcement.linkUrl && (
                        <a
                            href={announcement.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg",
                                "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                                "hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors",
                                "text-sm font-medium"
                            )}
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>Open Link</span>
                        </a>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AnnouncementDetailModal;
