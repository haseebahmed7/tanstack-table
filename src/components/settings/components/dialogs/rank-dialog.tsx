"use client";

import { Rank } from "@/lib/requests/core-setup/ranks/type";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  useCreateRanks,
  useGetPresignedUrl,
  useUpdateRanks,
} from "@/lib/requests/core-setup/ranks/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/context/toast-context";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/hook-form/fields";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/custom/custom-button";
import { X } from "lucide-react";

interface RankDialogProps {
  open: boolean;
  onClose: () => void;
  rankDetails: Rank | null;
  setRankDetail: (value: Rank | null) => void;
}

interface FileWithMeta extends File {
  preview?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Rank name is required.",
  }),
  minScore: z.number().min(1, {
    message: "Minimum score is required.",
  }),
  icon: z.string().optional(),
});

const defaultValues = {
  template: "",
  title: "",
  minScore: 0,
  icon: "",
};

export function AddRankDialog({
  open,
  onClose,
  rankDetails,
  setRankDetail,
}: RankDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [file, setFile] = useState<FileWithMeta | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [s3Key, setS3Key] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string>("");
  const fileRef = useRef<FileWithMeta | null>(null);

  const { mutateAsync: rankMut, isPending: IsRankLoading } = useCreateRanks();
  const { mutateAsync: updateRank, isPending: IsUpdateRankLoading } =
    useUpdateRanks();
  const { mutateAsync: presignedUrlMut } = useGetPresignedUrl();

  const toast = useToast();

  // File upload handlers
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const selectedFile = acceptedFiles[0];

      // Check if file is an image
      if (!selectedFile.type.startsWith("image/")) {
        toast.success("Only image files are allowed");
        return;
      }

      // Clean up previous file preview
      if (fileRef.current?.preview)
        URL.revokeObjectURL(fileRef.current.preview);

      const fileWithPreview = Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
      });
      setFile(fileWithPreview);
      fileRef.current = fileWithPreview;

      try {
        const uniqueId = crypto.randomUUID();
        const key = `/rank/${uniqueId}.png`;

        setS3Key(key);
        setIsUploading(true);

        const response = await presignedUrlMut({ s3Key: key });

        if (response?.url) {
          const uploadUrl = response.data.url;

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: selectedFile,
          });

          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
          }
          setIconUrl(key);
          // Trigger form validation to ensure the field is recognized
          form.trigger("icon");
          toast.success("Image uploaded successfully!");
        }
      } catch (err) {
        toast.error("Failed to upload image");
        // Clean up on error
        if (fileRef.current?.preview)
          URL.revokeObjectURL(fileRef.current.preview);
        setFile(null);
        setS3Key(null);
        fileRef.current = null;
      } finally {
        setIsUploading(false);
      }
    },
    [presignedUrlMut, form],
  );

  const removeFile = () => {
    if (fileRef.current?.preview) URL.revokeObjectURL(fileRef.current.preview);
    setFile(null);
    setS3Key(null);
    setIconUrl("");
    fileRef.current = null;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const iconPayload = s3Key || rankDetails?.icon || "";

      const rankPayload = {
        title: values.title,
        minScore: values.minScore,
        icon: iconPayload,
      };

      if (rankDetails?.id) {
        await updateRank({
          id: rankDetails.id,
          title: values.title,
          minScore: values.minScore,
          icon: iconPayload,
        });
      } else {
        await rankMut(rankPayload);
      }

      // Clean up file state
      if (fileRef.current?.preview)
        URL.revokeObjectURL(fileRef.current.preview);
      setFile(null);
      setS3Key(null);
      setIconUrl("");
      fileRef.current = null;

      form.reset(defaultValues);
      onClose();
      setRankDetail(null);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  useEffect(() => {
    if (open && rankDetails) {
      form.reset({
        title: rankDetails.title,
        minScore: rankDetails.minScore,
        icon: rankDetails.icon || "",
      });
      // Set iconUrl for display purposes (use iconUrl if available, otherwise use icon)
      setIconUrl(rankDetails.iconUrl || rankDetails.icon || "");
    } else if (open) {
      form.reset(defaultValues);
      setIconUrl("");
      // Clean up any existing file
      if (fileRef.current?.preview)
        URL.revokeObjectURL(fileRef.current.preview);
      setFile(null);
      setS3Key(null);
      fileRef.current = null;
    }
  }, [open, rankDetails, form]);

  useEffect(() => {
    if (!open) {
      if (fileRef.current?.preview)
        URL.revokeObjectURL(fileRef.current.preview);
      setFile(null);
      setS3Key(null);
      fileRef.current = null;
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
        <DialogPortal>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {rankDetails ? "Edit Rank" : "Add Rank"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                  <Field.Text name="title" label="Name" />
                  <Field.Text type="number" name="minScore" label="Score" />
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-medium">Rank Icon</Label>

                  {!file && (
                    <div
                      {...getRootProps()}
                      className={`mt-2 cursor-pointer rounded-lg border-2 border-dashed bg-gray-50 p-6 text-center transition-colors ${
                        isDragActive
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      } ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <input {...getInputProps()} disabled={isUploading} />
                      <div className="flex flex-col items-center space-y-2">
                        <img
                          src="/illustration_upload.png"
                          alt="Upload illustration"
                        />
                        <p className="text-sm text-gray-600">
                          Drop your
                          <span className="text-primary-500 font-medium">
                            image
                          </span>
                          here or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, JPEG, GIF, WebP
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Selected File */}
                  {file && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                        <div className="flex items-center space-x-3">
                          {file.preview && (
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                            {isUploading && (
                              <p className="text-xs text-blue-600">
                                Uploading...
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isUploading && (
                            <div className="flex items-center space-x-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                              <span className="text-xs text-blue-600">
                                Uploading...
                              </span>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={removeFile}
                            className="h-6 w-6 p-0"
                            disabled={isUploading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current Icon Display (for edit mode) */}
                  {iconUrl && !file && (
                    <div className="mt-2">
                      <Label className="text-xs text-gray-500">
                        Current Icon
                      </Label>
                      <div className="mt-1 flex items-center space-x-2">
                        <img
                          src={iconUrl}
                          alt="Current icon"
                          className="h-8 w-8 rounded object-cover"
                        />
                        <span className="text-sm text-gray-600">
                          Current rank icon
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={IsRankLoading || IsUpdateRankLoading}
                    disabled={
                      IsRankLoading || IsUpdateRankLoading || isUploading
                    }
                  >
                    {rankDetails ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
