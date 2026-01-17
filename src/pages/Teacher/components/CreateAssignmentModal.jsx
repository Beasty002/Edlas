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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Upload, X, Save, FileText, Image, File } from "lucide-react";

const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return Image;
    if (['pdf'].includes(ext)) return FileText;
    return File;
};

const CreateAssignmentModal = ({ open, onOpenChange, onSave, editData }) => {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "23:59",
        totalMarks: 50,
        allowLateSubmission: false,
        lateDeadline: "",
        lateTime: "23:59",
        attachments: [],
    });

    useEffect(() => {
        if (editData) {
            const dueDate = new Date(editData.dueDate);
            const lateDate = editData.lateDeadline ? new Date(editData.lateDeadline) : null;

            setFormData({
                title: editData.title || "",
                description: editData.description || "",
                dueDate: dueDate.toISOString().split("T")[0],
                dueTime: dueDate.toTimeString().slice(0, 5),
                totalMarks: editData.totalMarks || 50,
                allowLateSubmission: editData.allowLateSubmission || false,
                lateDeadline: lateDate ? lateDate.toISOString().split("T")[0] : "",
                lateTime: lateDate ? lateDate.toTimeString().slice(0, 5) : "23:59",
                attachments: editData.attachments || [],
            });
        } else {
            resetForm();
        }
    }, [editData, open]);

    const resetForm = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);

        setFormData({
            title: "",
            description: "",
            dueDate: tomorrow.toISOString().split("T")[0],
            dueTime: "23:59",
            totalMarks: 50,
            allowLateSubmission: false,
            lateDeadline: "",
            lateTime: "23:59",
            attachments: [],
        });
    };

    const handleClose = () => {
        onOpenChange(false);
        resetForm();
    };

    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const newAttachments = files.map((file) => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            url: URL.createObjectURL(file),
        }));
        updateFormData("attachments", [...formData.attachments, ...newAttachments]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeAttachment = (id) => {
        updateFormData("attachments", formData.attachments.filter((a) => a.id !== id));
    };

    const isValid = () => {
        if (!formData.title.trim()) return false;
        if (!formData.description.trim()) return false;
        if (!formData.dueDate) return false;
        if (formData.totalMarks < 1) return false;
        if (formData.allowLateSubmission && !formData.lateDeadline) return false;
        return true;
    };

    const handleSubmit = () => {
        const dueDate = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
        const lateDeadline = formData.allowLateSubmission && formData.lateDeadline
            ? new Date(`${formData.lateDeadline}T${formData.lateTime}`).toISOString()
            : null;

        onSave({
            title: formData.title,
            description: formData.description,
            dueDate,
            totalMarks: parseInt(formData.totalMarks),
            allowLateSubmission: formData.allowLateSubmission,
            lateDeadline,
            attachments: formData.attachments,
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-semibold">
                        {editData ? "Edit Assignment" : "Create New Assignment"}
                    </DialogTitle>
                    <DialogDescription>
                        Create an assignment for your students with a deadline and marks.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Title *</Label>
                        <Input
                            placeholder="e.g., Chapter 5 Practice Problems"
                            value={formData.title}
                            onChange={(e) => updateFormData("title", e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Description *</Label>
                        <Textarea
                            placeholder="Describe what students need to do..."
                            value={formData.description}
                            onChange={(e) => updateFormData("description", e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Due Date *
                            </Label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => updateFormData("dueDate", e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Due Time *
                            </Label>
                            <Input
                                type="time"
                                value={formData.dueTime}
                                onChange={(e) => updateFormData("dueTime", e.target.value)}
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Total Marks *</Label>
                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={formData.totalMarks}
                            onChange={(e) => updateFormData("totalMarks", e.target.value)}
                            className="h-11 w-32"
                        />
                    </div>

                    <div className="p-4 bg-muted/50 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium">Allow Late Submissions</Label>
                                <p className="text-xs text-muted-foreground">
                                    Students can submit after the deadline
                                </p>
                            </div>
                            <Switch
                                checked={formData.allowLateSubmission}
                                onCheckedChange={(checked) => updateFormData("allowLateSubmission", checked)}
                            />
                        </div>

                        {formData.allowLateSubmission && (
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Late Deadline</Label>
                                    <Input
                                        type="date"
                                        value={formData.lateDeadline}
                                        onChange={(e) => updateFormData("lateDeadline", e.target.value)}
                                        min={formData.dueDate}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Late Time</Label>
                                    <Input
                                        type="time"
                                        value={formData.lateTime}
                                        onChange={(e) => updateFormData("lateTime", e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Attachments (optional)</Label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Click to upload files</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, DOCX, Images, and more
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileUpload}
                            className="hidden"
                        />

                        {formData.attachments.length > 0 && (
                            <div className="space-y-2">
                                {formData.attachments.map((attachment) => {
                                    const FileIcon = getFileIcon(attachment.name);
                                    return (
                                        <div
                                            key={attachment.id}
                                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <FileIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium truncate max-w-[200px]">{attachment.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeAttachment(attachment.id)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t shrink-0">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleSubmit}
                        disabled={!isValid()}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {editData ? "Update" : "Create"} Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAssignmentModal;
