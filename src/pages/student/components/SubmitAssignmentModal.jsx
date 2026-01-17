import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Upload,
    FileText,
    Calendar,
    Award,
    X,
    Send,
    ExternalLink,
    AlertTriangle,
    Image,
    File,
} from "lucide-react";
import { format, isPast } from "date-fns";

const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return Image;
    if (['pdf'].includes(ext)) return FileText;
    return File;
};

const SubmitAssignmentModal = ({ open, onOpenChange, assignment, onSubmit }) => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const newFiles = selectedFiles.map((file) => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const handleSubmit = () => {
        if (files.length > 0 && assignment) {
            onSubmit({
                assignmentId: assignment.id,
                files: files,
            });
            setFiles([]);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setFiles([]);
    };

    if (!assignment) return null;

    const isLate = isPast(new Date(assignment.dueDate));

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-semibold">
                        Submit Assignment
                    </DialogTitle>
                    <DialogDescription>
                        Upload your work for "{assignment.title}"
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-6">
                    <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>

                        <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Due: {format(new Date(assignment.dueDate), "MMM d, h:mm a")}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span>{assignment.totalMarks} marks</span>
                            </div>
                        </div>

                        {assignment.attachments?.length > 0 && (
                            <div className="pt-2 border-t space-y-2">
                                <p className="text-xs text-muted-foreground">Assignment Files:</p>
                                {assignment.attachments.map((att, i) => (
                                    <a
                                        key={i}
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-blue-600 hover:underline text-sm mr-3"
                                    >
                                        <FileText className="h-4 w-4" />
                                        {att.name}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {isLate && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-amber-700 dark:text-amber-400">
                                    This is a late submission
                                </p>
                                <p className="text-sm text-amber-600 dark:text-amber-500">
                                    The deadline has passed. Your submission will be marked as late.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Your Submission *</Label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">Click to upload your files</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, DOCX, Images, and more (up to 10MB each)
                            </p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt,.zip"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((file) => {
                                    const FileIcon = getFileIcon(file.name);
                                    return (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500 rounded-lg">
                                                    <FileIcon className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
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
                        disabled={files.length === 0}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        Submit Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SubmitAssignmentModal;
