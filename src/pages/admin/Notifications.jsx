import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Eye,
    Trash2,
    PlusCircle,
    Search,
    Globe,
    Mail,
    Clock,
    XCircle,
    Edit,
    MessageSquare,
    Link as LinkIcon,
    FileText,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { DataGrid } from "@/components/reusable/DataGrid";
import CreateNotificationModal from "./components/CreateNotificationModal";
import NotificationDetailModal from "./components/NotificationDetailModal";
import { mockNotifications } from "@/data/mockData";
import { toast } from "sonner";
import { format } from "date-fns";
import { useClassrooms } from "@/context/ClassroomsContext";

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
    switch (recipients.type) {
        case "whole_school":
            return "Whole School";
        case "all_students":
            return "All Students";
        case "teachers":
            return "Teachers";
        case "specific_class":
            return `Class ${recipients.classes.join(", ")}`;
        case "specific_section":
            return `Class ${recipients.classes.join(", ")} - Section ${recipients.sections.join(", ")}`;
        default:
            return "Unknown";
    }
};

const getStatusConfig = (status) => {
    switch (status) {
        case "sent":
            return { label: "Sent", variant: "default", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
        case "scheduled":
            return { label: "Scheduled", variant: "outline", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
        case "draft":
            return { label: "Draft", variant: "secondary", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
        default:
            return { label: status, variant: "outline", className: "" };
    }
};

const Notifications = () => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [editingNotification, setEditingNotification] = useState(null);
    const { classOptions, allSectionOptions } = useClassrooms();

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notif) => {
            const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notif.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || notif.status === statusFilter;
            const matchesType = typeFilter === "all" || notif.contentType === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [notifications, searchQuery, statusFilter, typeFilter]);

    const handleView = (notif) => {
        setSelectedNotification(notif);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (notif) => {
        setEditingNotification(notif);
        setIsCreateModalOpen(true);
    };

    const handleDelete = (notif) => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
        toast.success("Notification deleted");
    };

    const handleCancelScheduled = (notif) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notif.id ? { ...n, status: "draft", scheduledDate: null } : n
            )
        );
        toast.success("Scheduled notification cancelled");
    };

    const handleSave = (notifData) => {
        if (editingNotification) {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === editingNotification.id ? { ...n, ...notifData } : n
                )
            );
            toast.success("Notification updated");
            setEditingNotification(null);
        } else {
            const newId = Math.max(...notifications.map((n) => n.id), 0) + 1;
            setNotifications((prev) => [
                {
                    id: newId,
                    ...notifData,
                    createdAt: new Date().toISOString(),
                    createdBy: "Admin User",
                },
                ...prev,
            ]);
            toast.success(
                notifData.status === "scheduled"
                    ? "Notification scheduled"
                    : notifData.status === "draft"
                        ? "Draft saved"
                        : "Notification sent"
            );
        }
        setIsCreateModalOpen(false);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setEditingNotification(null);
    };

    const columns = [
        {
            field: "title",
            headerText: "Title",
            width: 250,
            template: (notif) => (
                <div className="font-medium truncate max-w-[230px]" title={notif.title}>
                    {notif.title}
                </div>
            ),
        },
        {
            field: "contentType",
            headerText: "Type",
            width: 110,
            textAlign: "Center",
            template: (notif) => {
                const config = getContentTypeConfig(notif.contentType);
                const Icon = config.icon;
                return (
                    <Badge className={`${config.className} gap-1`}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            field: "recipients",
            headerText: "Recipients",
            width: 150,
            template: (notif) => (
                <span className="text-sm text-muted-foreground">
                    {getRecipientLabel(notif.recipients)}
                </span>
            ),
        },
        {
            field: "deliveryChannel",
            headerText: "Delivery",
            width: 100,
            textAlign: "Center",
            template: (notif) => (
                <div className="flex items-center justify-center gap-1.5">
                    {notif.deliveryChannel.includes("web") && (
                        <Globe className="h-4 w-4 text-blue-500" title="Web" />
                    )}
                    {notif.deliveryChannel.includes("email") && (
                        <Mail className="h-4 w-4 text-purple-500" title="Email" />
                    )}
                </div>
            ),
        },
        {
            field: "status",
            headerText: "Status",
            width: 110,
            textAlign: "Center",
            template: (notif) => {
                const config = getStatusConfig(notif.status);
                return <Badge className={config.className}>{config.label}</Badge>;
            },
        },
        {
            field: "scheduledDate",
            headerText: "Schedule/Sent",
            width: 150,
            template: (notif) => {
                if (notif.scheduledDate) {
                    return (
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-sm">
                                {format(new Date(notif.scheduledDate), "MMM d, h:mm a")}
                            </span>
                        </div>
                    );
                }
                if (notif.sentAt) {
                    return (
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(notif.sentAt), "MMM d, h:mm a")}
                        </span>
                    );
                }
                return <span className="text-muted-foreground">—</span>;
            },
        },
    ];

    const actionConfig = {
        mode: "dropdown",
        showOnHover: false,
        width: 60,
        actions: [
            {
                label: "View",
                icon: <Eye className="h-4 w-4" />,
                onClick: handleView,
            },
            {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: handleEdit,
                hidden: (notif) => notif.status === "sent",
            },
            {
                label: "Cancel Schedule",
                icon: <XCircle className="h-4 w-4" />,
                onClick: handleCancelScheduled,
                hidden: (notif) => notif.status !== "scheduled",
            },
            {
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: handleDelete,
                variant: "destructive",
            },
        ],
    };

    return (
        <div className="space-y-6 w-full">
            <PageHeader
                title="Notification Management"
                description="Create, schedule, and manage notifications for students, teachers, and staff."
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search notifications..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="message">Message</SelectItem>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="blog">Blog</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New
                    </Button>
                </div>
            </div>

            <DataGrid
                columns={columns}
                data={filteredNotifications}
                actionConfig={actionConfig}
                emptyMessage="No notifications found"
                keyField="id"
            />

            <CreateNotificationModal
                open={isCreateModalOpen}
                onOpenChange={handleCloseCreateModal}
                onSave={handleSave}
                editData={editingNotification}
                allClasses={classOptions.map(c => c.value)}
                allSections={allSectionOptions.map(s => s.value)}
            />

            <NotificationDetailModal
                open={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                notification={selectedNotification}
            />
        </div>
    );
};

export default Notifications;
