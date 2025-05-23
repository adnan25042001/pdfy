"use client";

import { useRef, useState } from "react";
import { PdfUploader } from "@/components/pdf-uploader";
import { PdfOptions } from "@/components/pdf-options";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText } from "lucide-react";
import { createPdfProcessor, PdfProcessorOptions } from "@/lib/pdf-processor";
import { toast } from "sonner";
import { AnimatedButton } from "@/components/ui/animated-button";

export function PdfProcessorForm() {
  const [file, setFile] = useState<File | null>(null);
  const [removeInvoices, setRemoveInvoices] = useState(false);
  const [sortBySKU, setSortBySKU] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // const pdfProcessor = createPdfProcessor()
  const pdfProcessorRef = useRef(createPdfProcessor());

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessed(false);
    pdfProcessorRef.current.loadPdf(selectedFile).catch((error) => {
      toast.error("Error loading PDF", {
        description: error.message,
      });
    });
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please upload a PDF file first.",
      });
      return;
    }

    if (!removeInvoices && !sortBySKU) {
      toast.error("No options selected", {
        description: "Please select at least one processing option.",
      });
      return;
    }

    try {
      setIsProcessing(true);

      const options: PdfProcessorOptions = {
        removeInvoices,
        sortBySKU,
      };

      await pdfProcessorRef.current.loadPdf(file);

      await pdfProcessorRef.current.processPdf(options);
      setIsProcessed(true);

      toast.success("PDF Processed Successfully", {
        description: "Your PDF has been processed and is ready to download.",
      });
    } catch (error: any) {
      toast.error("Processing Error", {
        description:
          error.message || "An error occurred while processing the PDF.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      await pdfProcessorRef.current.downloadPdf();

      // Reset form after successful download
      setFile(null);
      setIsProcessed(false);
      setRemoveInvoices(false);
      setSortBySKU(false);
      setResetKey((prev) => prev + 1); // 👈 Trigger uploader reset

      toast.success("PDF Downloaded", {
        description: "Your processed PDF has been downloaded successfully.",
      });
    } catch (error: any) {
      toast.error("Download Error", {
        description:
          error.message || "An error occurred while downloading the PDF.",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <PdfUploader
        onFileSelect={handleFileSelect}
        resetKey={resetKey}
        className="min-h-[200px]"
      />

      <div className="space-y-6">
        <PdfOptions
          removeInvoices={removeInvoices}
          setRemoveInvoices={setRemoveInvoices}
          sortBySKU={sortBySKU}
          setSortBySKU={setSortBySKU}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <AnimatedButton
            onClick={handleProcess}
            disabled={!file || isProcessing || (!removeInvoices && !sortBySKU)}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Process PDF
              </>
            )}
          </AnimatedButton>

          {isProcessed && (
            <AnimatedButton
              onClick={handleDownload}
              variant="secondary"
              className="flex-1"
            >
              <Download className="h-4 w-4" />
              Download
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
}
