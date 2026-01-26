import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Megaphone, Inbox } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AnnouncementCard from "./AnnouncementCard";
import { baseRequest } from "@/api/api";

const fetchAnnouncements = async ({ search, type }) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type && type !== 'all') params.append('announcement_type', type);

    const url = params.toString() ? `/system/announcements/?${params.toString()}` : '/system/announcements/';

    const response = await baseRequest({
        url,
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
        createdAt: item.created_at,
    })) || [];
};

// Loading skeleton component
const AnnouncementSkeleton = () => (
    <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700" />
        <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
    </div>
);

const EmptyState = ({ hasFilters }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Inbox className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No announcements found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
            {hasFilters
                ? "Try adjusting your search or filter to find what you're looking for."
                : "There are no announcements at the moment. Check back later!"}
        </p>
    </div>
);

const AnnouncementsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ['bulletin-announcements', searchQuery, typeFilter],
        queryFn: () => fetchAnnouncements({
            search: searchQuery,
            type: typeFilter
        }),
    });

    const hasFilters = searchQuery || typeFilter !== "all";

    return (
        <div className="space-y-6 w-full">
            <PageHeader
                title="Bulletin Board"
                description="Stay updated with the latest announcements from your school."
                icon={<Megaphone className="h-7 w-7 text-blue-600" />}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search announcements..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="message">Message</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <AnnouncementSkeleton key={i} />
                    ))}
                </div>
            ) : announcements.length === 0 ? (
                <EmptyState hasFilters={hasFilters} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnnouncementsPage;
