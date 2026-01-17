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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MessageSquare,
    Link as LinkIcon,
    FileText,
    Globe,
    Mail,
    Clock,
    Send,
    Save,
    Upload,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentTypes = [
    { value: "message", label: "Message", icon: MessageSquare, description: "Simple text notification" },
    { value: "link", label: "Link", icon: LinkIcon, description: "Share a link with description" },
    { value: "blog", label: "Blog", icon: FileText, description: "Rich content with image" },
];

const recipientTypes = [
    { value: "whole_school", label: "Whole School" },
    { value: "all_students", label: "All Students" },
    { value: "teachers", label: "All Teachers" },
    { value: "specific_class", label: "Specific Class" },
    { value: "specific_section", label: "Specific Section" },
];

const CreateNotificationModal = ({
    open,
    onOpenChange,
    onSave,
    editData,
    allClasses = [],
    allSections = [],
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
        deliveryChannel: ["web"],
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
                deliveryChannel: editData.deliveryChannel || ["web"],
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
            deliveryChannel: ["web"],
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

    const toggleDeliveryChannel = (channel) => {
        setFormData((prev) => {
            const channels = prev.deliveryChannel.includes(channel)
                ? prev.deliveryChannel.filter((c) => c !== channel)
                : [...prev.deliveryChannel, channel];
            return { ...prev, deliveryChannel: channels.length ? channels : ["web"] };
        });
    };

    const toggleClass = (cls) => {
        const currentClasses = formData.recipients.classes;
        const newClasses = currentClasses.includes(cls)
            ? currentClasses.filter((c) => c !== cls)
            : [...currentClasses, cls];
        updateRecipients("classes", newClasses);
    };

    const toggleSection = (section) => {
        const currentSections = formData.recipients.sections;
        const newSections = currentSections.includes(section)
            ? currentSections.filter((s) => s !== section)
            : [...currentSections, section];
        updateRecipients("sections", newSections);
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
        if (formData.deliveryChannel.length === 0) return false;
        if (formData.recipients.type === "specific_class" && formData.recipients.classes.length === 0) return false;
        if (formData.recipients.type === "specific_section" && (formData.recipients.classes.length === 0 || formData.recipients.sections.length === 0)) return false;
        if (formData.scheduleType === "schedule" && (!formData.scheduledDate || !formData.scheduledTime)) return false;
        return true;
    };

    const handleSubmit = (status) => {
        let scheduledDate = null;
        if (formData.scheduleType === "schedule" && formData.scheduledDate && formData.scheduledTime) {
            scheduledDate = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
        }

        const notifData = {
            title: formData.title,
            description: formData.description,
            contentType: formData.contentType,
            linkUrl: formData.contentType === "link" ? formData.linkUrl : null,
            imageUrl: formData.contentType === "blog" ? formData.imageUrl : null,
            recipients: formData.recipients,
            deliveryChannel: formData.deliveryChannel,
            status: status,
            scheduledDate: status === "scheduled" ? scheduledDate : null,
            sentAt: status === "sent" ? new Date().toISOString() : null,
        };

        onSave(notifData);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-semibold">
                        {editData ? "Edit Notification" : "Create New Notification"}
                    </DialogTitle>
                    <DialogDescription>
                        Create and send notifications to students, teachers, or the whole school.
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
                                    placeholder="Enter notification title"
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
                                    placeholder="Enter notification content..."
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
                                    onValueChange={(value) => {
                                        updateRecipients("type", value);
                                        updateRecipients("classes", []);
                                        updateRecipients("sections", []);
                                    }}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select recipients" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recipientTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {(formData.recipients.type === "specific_class" || formData.recipients.type === "specific_section") && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Select Class(es) *</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {allClasses.map((cls) => (
                                            <Badge
                                                key={cls}
                                                variant={formData.recipients.classes.includes(cls) ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer px-4 py-2 text-sm rounded-lg transition-all",
                                                    formData.recipients.classes.includes(cls)
                                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                )}
                                                onClick={() => toggleClass(cls)}
                                            >
                                                Class {cls}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.recipients.type === "specific_section" && formData.recipients.classes.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Select Section(s) *</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {allSections.map((section) => (
                                            <Badge
                                                key={section}
                                                variant={formData.recipients.sections.includes(section) ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer px-4 py-2 text-sm rounded-lg transition-all",
                                                    formData.recipients.sections.includes(section)
                                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                )}
                                                onClick={() => toggleSection(section)}
                                            >
                                                Section {section}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-muted/50 rounded-xl">
                                <h4 className="font-medium mb-2">Recipients Preview</h4>
                                <p className="text-sm text-muted-foreground">
                                    {formData.recipients.type === "whole_school" && "This notification will be sent to everyone in the school."}
                                    {formData.recipients.type === "all_students" && "This notification will be sent to all students."}
                                    {formData.recipients.type === "teachers" && "This notification will be sent to all teachers."}
                                    {formData.recipients.type === "specific_class" && formData.recipients.classes.length > 0 &&
                                        `This notification will be sent to all students in Class ${formData.recipients.classes.join(", ")}.`}
                                    {formData.recipients.type === "specific_section" && formData.recipients.classes.length > 0 && formData.recipients.sections.length > 0 &&
                                        `This notification will be sent to students in Class ${formData.recipients.classes.join(", ")} Section ${formData.recipients.sections.join(", ")}.`}
                                    {(formData.recipients.type === "specific_class" || formData.recipients.type === "specific_section") && formData.recipients.classes.length === 0 &&
                                        "Please select at least one class."}
                                </p>
                            </div>
                        </TabsContent>

                        {/* Delivery Tab */}
                        <TabsContent value="delivery" className="space-y-6 mt-0">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Delivery Channel *</Label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <Checkbox
                                            checked={formData.deliveryChannel.includes("web")}
                                            onCheckedChange={() => toggleDeliveryChannel("web")}
                                        />
                                        <Globe className="h-5 w-5 text-blue-500" />
                                        <span className="text-sm">Web Notification</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <Checkbox
                                            checked={formData.deliveryChannel.includes("email")}
                                            onCheckedChange={() => toggleDeliveryChannel("email")}
                                        />
                                        <Mail className="h-5 w-5 text-purple-500" />
                                        <span className="text-sm">Email</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium">When to Send</Label>
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
                                        <span className={cn("font-medium", formData.scheduleType === "now" ? "text-blue-600" : "")}>Send Now</span>
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
                                Send Now
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNotificationModal;
