import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import StaffDetailForm from "./StaffDetailForm";
import { baseRequest } from "@/api/api";
import { Loader2 } from "lucide-react";

const fetchStaffDetails = async (staffId) => {
    const res = await baseRequest({
        url: `/system/staff/${staffId}/`,
        method: "GET",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch staff details");
    }
    return res.data;
};

const UpdateStaffForm = ({ staff, onClose }) => {
    const queryClient = useQueryClient();
    const { data: fullStaffData, isLoading, isError, error } = useQuery({
        queryKey: ["staff-detail", staff?.id],
        queryFn: () => fetchStaffDetails(staff.id),
        enabled: !!staff?.id,
        staleTime: 0,
    });

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["staff-detail", staff?.id] });
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        onClose?.();
    };

    return (
        <Dialog open={!!staff} onOpenChange={(open) => !open && onClose?.()}>
            <DialogContent className="!w-[95vw] h-[95vh] !max-w-[95vw] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0 sticky top-0 z-10 pb-4 border-b">
                    <DialogTitle>Edit Staff</DialogTitle>
                    <DialogDescription>
                        Update details for {staff?.first_name || staff?.full_name} {staff?.last_name || ""}.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-auto custom-scrollbar p-4">
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading staff details...</span>
                        </div>
                    )}
                    {isError && (
                        <div className="flex items-center justify-center h-full text-red-500">
                            Failed to load staff details: {error?.message}
                        </div>
                    )}
                    {fullStaffData && (
                        <StaffDetailForm
                            mode="edit"
                            staffData={fullStaffData}
                            onSuccess={handleSuccess}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateStaffForm;
