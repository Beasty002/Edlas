import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    Megaphone,
    Send,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { DataGrid } from "@/components/reusable/DataGrid";
import CreateAnnouncementModal from "./components/CreateAnnouncementModal";
import AnnouncementDetailModal from "./components/AnnouncementDetailModal";
import { toast } from "sonner";
import { format } from "date-fns";
import { baseRequest } from "@/api/api";

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
        case "all_staff":
            return "All Staff";
        default:
            return "Unknown";
    }
};

const getStatusConfig = (status) => {
    switch (status) {
        case "sent":
            return { label: "Published", variant: "default", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
        case "scheduled":
            return { label: "Scheduled", variant: "outline", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
        case "draft":
            return { label: "Draft", variant: "secondary", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
        default:
            return { label: status, variant: "outline", className: "" };
    }
};

const fetchAnnouncements = async () => {
    const response = await baseRequest({
        url: '/system/announcements/',
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch announcements');
    }
    return response.data?.results?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        contentType: item.announcement_type,
        linkUrl: item.link,
        imageUrl: item.image,
        recipients: {
            type: item.student_receipent && item.staff_receipent ? 'whole_school'
                : item.student_receipent ? 'all_students'
                    : 'all_staff'
        },
        deliveryChannel: [item.via_web && 'web', item.via_email && 'email'].filter(Boolean),
        status: item.is_draft ? 'draft' : item.scheduled_datetime ? 'scheduled' : 'sent',
        scheduledDate: item.scheduled_datetime,
        sentAt: !item.is_draft ? item.created_at : null,
        createdAt: item.created_at,
    })) || [];
};

const Announcements = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ['announcements'],
        queryFn: fetchAnnouncements,
    });

    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || item.status === statusFilter;
            const matchesType = typeFilter === "all" || item.contentType === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [announcements, searchQuery, statusFilter, typeFilter]);

    const handleView = (item) => {
        setSelectedAnnouncement(item);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingAnnouncement(item);
        setIsCreateModalOpen(true);
    };

    const handleDelete = (item) => {
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
        toast.success("Announcement deleted");
    };

    const handleCancelScheduled = (item) => {
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
        toast.success("Scheduled announcement cancelled");
    };

    const handlePublishNow = (item) => {
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
        toast.success("Announcement published successfully");
    };

    const handleSave = () => {
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
        setEditingAnnouncement(null);
        setIsCreateModalOpen(false);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setEditingAnnouncement(null);
    };

    const columns = [
        {
            field: "title",
            headerText: "Title",
            width: 250,
            template: (item) => (
                <div className="font-medium truncate max-w-[230px]" title={item.title}>
                    {item.title}
                </div>
            ),
        },
        {
            field: "contentType",
            headerText: "Type",
            width: 110,
            textAlign: "Center",
            template: (item) => {
                const config = getContentTypeConfig(item.contentType);
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
            template: (item) => (
                <span className="text-sm text-muted-foreground">
                    {getRecipientLabel(item.recipients)}
                </span>
            ),
        },
        {
            field: "deliveryChannel",
            headerText: "Delivery",
            width: 100,
            textAlign: "Center",
            template: (item) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Globe className="h-4 w-4 text-blue-500" title="Bulletin Board" />
                    {item.deliveryChannel.includes("email") && (
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
            template: (item) => {
                const config = getStatusConfig(item.status);
                return <Badge className={config.className}>{config.label}</Badge>;
            },
        },
        {
            field: "scheduledDate",
            headerText: "Schedule/Published",
            width: 150,
            template: (item) => {
                if (item.scheduledDate) {
                    return (
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-sm">
                                {format(new Date(item.scheduledDate), "MMM d, h:mm a")}
                            </span>
                        </div>
                    );
                }
                if (item.sentAt) {
                    return (
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(item.sentAt), "MMM d, h:mm a")}
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
                hidden: (item) => item.status === "sent",
            },
            {
                label: "Publish Now",
                icon: <Send className="h-4 w-4" />,
                onClick: handlePublishNow,
                hidden: (item) => item.status !== "scheduled",
            },
            {
                label: "Cancel Schedule",
                icon: <XCircle className="h-4 w-4" />,
                onClick: handleCancelScheduled,
                hidden: (item) => item.status !== "scheduled",
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
                title="Announcements"
                description="Create, schedule, and manage announcements for students, teachers, and staff."
                icon={<Megaphone className="h-7 w-7 text-blue-600" />}
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search announcements..."
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
                            <SelectItem value="sent">Published</SelectItem>
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
                        New Announcement
                    </Button>
                </div>
            </div>

            <DataGrid
                columns={columns}
                data={filteredAnnouncements}
                isLoading={isLoading}
                actionConfig={actionConfig}
                emptyMessage="No announcements found"
                keyField="id"
            />

            <CreateAnnouncementModal
                open={isCreateModalOpen}
                onOpenChange={handleCloseCreateModal}
                onSave={handleSave}
                editData={editingAnnouncement}
            />

            <AnnouncementDetailModal
                open={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                announcement={selectedAnnouncement}
            />
        </div>
    );
};

export default Announcements;
