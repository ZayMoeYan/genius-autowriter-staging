"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon } from "lucide-react";

type DropzoneProps = {
    onFilesAccepted: (files: File[]) => void;
    onChange: any
};

export function Dropzone({ onFilesAccepted }: DropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                onFilesAccepted(acceptedFiles);
            }
        },
        [onFilesAccepted]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".jpeg2000"],
        },
        multiple: true,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                isDragActive ? "border-accent bg-accent/10" : "border-border/80"
            }`}
        >
            <input {...getInputProps()} />
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-base text-muted-foreground">
                {isDragActive ? "Drop your images here..." : "Drop your images here, or browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
                Supports: JPG, JPEG2000, PNG
            </p>
        </div>
    );
}
