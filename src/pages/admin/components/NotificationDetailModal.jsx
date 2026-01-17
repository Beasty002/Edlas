import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    Link as LinkIcon,
    FileText,
    Globe,
    Mail,
    Clock,
    User,
    Calendar,
    ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const getContentTypeConfig = (type) => {
    switch (type) {
        case "message":
            return { label: "Message", icon: MessageSquare, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
        case "link":
            return { label: "Link", icon: LinkIcon, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
        case "blog":
            return { label: "Blog", icon: FileText, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
        default:
            return { label: type, icon: MessageSquare, className: "bg-gray-100 text-gray-700" };
    }
};

const getRecipientLabel = (recipients) => {
    if (!recipients) return "Unknown";
    switch (recipients.type) {
        case "whole_school":
            return "Whole School";
        case "all_students":
            return "All Students";
        case "teachers":
            return "All Teachers";
        case "specific_class":
            return `Class ${recipients.classes?.join(", ") || ""}`;
        case "specific_section":
            return `Class ${recipients.classes?.join(", ") || ""} - Section ${recipients.sections?.join(", ") || ""}`;
        default:
            return "Unknown";
    }
};

const getStatusConfig = (status) => {
    switch (status) {
        case "sent":
            return { label: "Sent", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
        case "scheduled":
            return { label: "Scheduled", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
        case "draft":
            return { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
        default:
            return { label: status, className: "" };
    }
};

const NotificationDetailModal = ({ open, onOpenChange, notification }) => {
    if (!notification) return null;

    const contentTypeConfig = getContentTypeConfig(notification.contentType);
    const ContentIcon = contentTypeConfig.icon;
    const statusConfig = getStatusConfig(notification.status);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-semibold leading-relaxed">
                                {notification.title}
                            </DialogTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Badge className={contentTypeConfig.className}>
                                    <ContentIcon className="h-3 w-3 mr-1" />
                                    {contentTypeConfig.label}
                                </Badge>
                                <Badge className={statusConfig.className}>
                                    {statusConfig.label}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
                    {/* Image Preview for Blog Type */}
                    {notification.contentType === "blog" && notification.imageUrl && (
                        <div className="rounded-xl overflow-hidden border mb-6">
                            <img
                                src={notification.imageUrl}
                                alt="Notification image"
                                className="w-full h-48 object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Content</h4>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {notification.description}
                            </p>
                        </div>

                        {/* Link for Link Type */}
                        {notification.contentType === "link" && notification.linkUrl && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-3">Link</h4>
                                <a
                                    href={notification.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    {notification.linkUrl}
                                </a>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">Recipients</span>
                                </div>
                                <p className="text-sm font-medium">{getRecipientLabel(notification.recipients)}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Globe className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">Delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {notification.deliveryChannel?.includes("web") && (
                                        <span className="flex items-center gap-1.5 text-sm font-medium">
                                            <Globe className="h-4 w-4 text-blue-500" /> Web
                                        </span>
                                    )}
                                    {notification.deliveryChannel?.includes("email") && (
                                        <span className="flex items-center gap-1.5 text-sm font-medium">
                                            <Mail className="h-4 w-4 text-purple-500" /> Email
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">Created</span>
                                </div>
                                <p className="text-sm font-medium">
                                    {notification.createdAt
                                        ? format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")
                                        : "—"}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">
                                        {notification.status === "scheduled" ? "Scheduled For" : "Sent At"}
                                    </span>
                                </div>
                                <p className="text-sm font-medium">
                                    {notification.status === "scheduled" && notification.scheduledDate
                                        ? format(new Date(notification.scheduledDate), "MMM d, yyyy 'at' h:mm a")
                                        : notification.sentAt
                                            ? format(new Date(notification.sentAt), "MMM d, yyyy 'at' h:mm a")
                                            : "—"}
                                </p>
                            </div>
                        </div>

                        {/* Created By */}
                        <div className="pt-6 border-t">
                            <p className="text-sm text-muted-foreground">
                                Created by <span className="font-medium text-foreground">{notification.createdBy || "Admin"}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t shrink-0 flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NotificationDetailModal;
