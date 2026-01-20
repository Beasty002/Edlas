import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MessageSquare,
    Link as LinkIcon,
    FileText,
    Mail,
    Clock,
    Send,
    Save,
    Upload,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentTypes = [
    { value: "message", label: "Message", icon: MessageSquare, description: "Simple text announcement" },
    { value: "link", label: "Link", icon: LinkIcon, description: "Share a link with description" },
    { value: "blog", label: "Blog", icon: FileText, description: "Rich content with image" },
];

const recipientTypes = [
    { value: "whole_school", label: "Whole School", description: "Send to everyone in the school" },
    { value: "all_students", label: "All Students", description: "Send to all enrolled students" },
    { value: "all_staff", label: "All Staff", description: "Send to all staff members" },
];

const CreateAnnouncementModal = ({
    open,
    onOpenChange,
    onSave,
    editData,
}) => {
    const [activeTab, setActiveTab] = useState("content");
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        contentType: "message",
        linkUrl: "",
        imageUrl: "",
        imageFile: null,
        recipients: {
            type: "all_students",
            classes: [],
            sections: [],
        },
        sendEmail: false,
        scheduleType: "now",
        scheduledDate: "",
        scheduledTime: "",
    });

    useEffect(() => {
        if (editData) {
            const scheduleDate = editData.scheduledDate ? new Date(editData.scheduledDate) : null;
            setFormData({
                title: editData.title || "",
                description: editData.description || "",
                contentType: editData.contentType || "message",
                linkUrl: editData.linkUrl || "",
                imageUrl: editData.imageUrl || "",
                imageFile: null,
                recipients: editData.recipients || { type: "all_students", classes: [], sections: [] },
                sendEmail: editData.deliveryChannel?.includes("email") || false,
                scheduleType: editData.scheduledDate ? "schedule" : "now",
                scheduledDate: scheduleDate ? scheduleDate.toISOString().split("T")[0] : "",
                scheduledTime: scheduleDate ? scheduleDate.toTimeString().slice(0, 5) : "",
            });
            setActiveTab("content");
        } else {
            resetForm();
        }
    }, [editData, open]);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            contentType: "message",
            linkUrl: "",
            imageUrl: "",
            imageFile: null,
            recipients: {
                type: "all_students",
                classes: [],
                sections: [],
            },
            sendEmail: false,
            scheduleType: "now",
            scheduledDate: "",
            scheduledTime: "",
        });
        setActiveTab("content");
    };

    const handleClose = () => {
        onOpenChange(false);
        resetForm();
    };

    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateRecipients = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            recipients: { ...prev.recipients, [field]: value },
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateFormData("imageUrl", reader.result);
                updateFormData("imageFile", file);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        updateFormData("imageUrl", "");
        updateFormData("imageFile", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const isValid = () => {
        if (!formData.title.trim()) return false;
        if (!formData.description.trim()) return false;
        if (formData.contentType === "link" && !formData.linkUrl.trim()) return false;
        if (formData.scheduleType === "schedule" && (!formData.scheduledDate || !formData.scheduledTime)) return false;
        return true;
    };

    const handleSubmit = (status) => {
        let scheduledDate = null;
        if (formData.scheduleType === "schedule" && formData.scheduledDate && formData.scheduledTime) {
            scheduledDate = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
        }

        // Web is always included by default, email is optional
        const deliveryChannel = formData.sendEmail ? ["web", "email"] : ["web"];

        const announcementData = {
            title: formData.title,
            description: formData.description,
            contentType: formData.contentType,
            linkUrl: formData.contentType === "link" ? formData.linkUrl : null,
            imageUrl: formData.contentType === "blog" ? formData.imageUrl : null,
            recipients: formData.recipients,
            deliveryChannel: deliveryChannel,
            status: status,
            scheduledDate: status === "scheduled" ? scheduledDate : null,
            sentAt: status === "sent" ? new Date().toISOString() : null,
        };

        onSave(announcementData);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-semibold">
                        {editData ? "Edit Announcement" : "Create New Announcement"}
                    </DialogTitle>
                    <DialogDescription>
                        Create and publish announcements to students, teachers, or the whole school.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="recipients">Recipients</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
                        </TabsList>

                        {/* Content Tab */}
                        <TabsContent value="content" className="space-y-6 mt-0">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Title *</Label>
                                <Input
                                    placeholder="Enter announcement title"
                                    value={formData.title}
                                    onChange={(e) => updateFormData("title", e.target.value)}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Content Type</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {contentTypes.map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = formData.contentType === type.value;
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => updateFormData("contentType", type.value)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                )}
                                            >
                                                <Icon className={cn("h-6 w-6", isSelected ? "text-blue-600" : "text-muted-foreground")} />
                                                <span className={cn("text-sm font-medium", isSelected ? "text-blue-600" : "")}>
                                                    {type.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground text-center">{type.description}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Description *</Label>
                                <Textarea
                                    placeholder="Enter announcement content..."
                                    value={formData.description}
                                    onChange={(e) => updateFormData("description", e.target.value)}
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            {formData.contentType === "link" && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Link URL *</Label>
                                    <Input
                                        placeholder="https://example.com"
                                        value={formData.linkUrl}
                                        onChange={(e) => updateFormData("linkUrl", e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                            )}

                            {formData.contentType === "blog" && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Image (optional)</Label>

                                    {!formData.imageUrl ? (
                                        <div className="space-y-3">
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                                            >
                                                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                                <p className="text-sm font-medium">Click to upload image</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                                <span className="text-xs text-muted-foreground">or</span>
                                                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                            </div>

                                            <Input
                                                placeholder="Paste image URL..."
                                                onChange={(e) => updateFormData("imageUrl", e.target.value)}
                                                className="h-11"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-48 object-cover"
                                                onError={(e) => { e.target.src = ""; removeImage(); }}
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        {/* Recipients Tab */}
                        <TabsContent value="recipients" className="space-y-6 mt-0">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Send To</Label>
                                <Select
                                    value={formData.recipients.type}
                                    onValueChange={(value) => updateRecipients("type", value)}
                                >
                                    <SelectTrigger className="w-full h-11">
                                        <SelectValue placeholder="Select recipients" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recipientTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex flex-col">
                                                    <span>{type.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-xl">
                                <h4 className="font-medium mb-2">Recipients Preview</h4>
                                <p className="text-sm text-muted-foreground">
                                    {formData.recipients.type === "whole_school" && "This announcement will be sent to everyone in the school."}
                                    {formData.recipients.type === "all_students" && "This announcement will be sent to all students."}
                                    {formData.recipients.type === "all_staff" && "This announcement will be sent to all staff members."}
                                </p>
                            </div>
                        </TabsContent>

                        {/* Delivery Tab */}
                        <TabsContent value="delivery" className="space-y-6 mt-0">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Additional Delivery Options</Label>
                                <p className="text-xs text-muted-foreground">
                                    Announcements are always shown on the bulletin board. Optionally send via email.
                                </p>
                                <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                                    <Checkbox
                                        checked={formData.sendEmail}
                                        onCheckedChange={(checked) => updateFormData("sendEmail", checked)}
                                    />
                                    <Mail className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <span className="text-sm font-medium">Also send via Email</span>
                                        <p className="text-xs text-muted-foreground">Recipients will receive an email notification</p>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium">When to Publish</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => updateFormData("scheduleType", "now")}
                                        className={cn(
                                            "flex items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all",
                                            formData.scheduleType === "now"
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                        )}
                                    >
                                        <Send className={cn("h-5 w-5", formData.scheduleType === "now" ? "text-blue-600" : "text-muted-foreground")} />
                                        <span className={cn("font-medium", formData.scheduleType === "now" ? "text-blue-600" : "")}>Publish Now</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateFormData("scheduleType", "schedule")}
                                        className={cn(
                                            "flex items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all",
                                            formData.scheduleType === "schedule"
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                        )}
                                    >
                                        <Clock className={cn("h-5 w-5", formData.scheduleType === "schedule" ? "text-blue-600" : "text-muted-foreground")} />
                                        <span className={cn("font-medium", formData.scheduleType === "schedule" ? "text-blue-600" : "")}>Schedule</span>
                                    </button>
                                </div>
                            </div>

                            {formData.scheduleType === "schedule" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Date *</Label>
                                        <Input
                                            type="date"
                                            value={formData.scheduledDate}
                                            onChange={(e) => updateFormData("scheduledDate", e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Time *</Label>
                                        <Input
                                            type="time"
                                            value={formData.scheduledTime}
                                            onChange={(e) => updateFormData("scheduledTime", e.target.value)}
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="px-6 py-4 border-t shrink-0 flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleSubmit("draft")}
                        disabled={!formData.title.trim()}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleSubmit(formData.scheduleType === "schedule" ? "scheduled" : "sent")}
                        disabled={!isValid()}
                    >
                        {formData.scheduleType === "schedule" ? (
                            <>
                                <Clock className="mr-2 h-4 w-4" />
                                Schedule
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Publish Now
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAnnouncementModal;
