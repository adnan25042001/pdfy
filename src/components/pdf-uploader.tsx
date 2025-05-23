"use client";

import { useEffect, useRef, useState } from "react";
import { File, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
  className?: string;
  resetKey?: string | number;
}

export function PdfUploader({
  onFileSelect,
  className,
  resetKey,
}: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset all UI state
    setFileName(null);
    setIsUploading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetKey]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        processFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setFileName(file.name);

    // Simulate a small delay to show the loading state
    setTimeout(() => {
      onFileSelect(file);
      setIsUploading(false);
    }, 800);
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg transition-all",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        id="pdfInput"
        accept="application/pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Processing PDF...</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
            <p className="text-sm font-medium mb-1">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              PDF loaded successfully
            </p>
            <p className="text-xs text-primary mt-4">
              Click or drag to upload a different file
            </p>
          </div>
        ) : (
          <>
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              Upload your Amazon PDF
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF files only
            </p>
          </>
        )}
      </div>
    </div>
  );
}
