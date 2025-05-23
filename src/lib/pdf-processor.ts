"use client";

import * as PDFLib from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Destructure the commonly used objects from PDFLib
const { PDFDocument, StandardFonts, rgb } = PDFLib;

// Options interface for processing the PDF.
export interface PdfProcessorOptions {
  removeInvoices: boolean;
  sortBySKU: boolean;
}

// Interface for SKU/Quantity Pair.
interface SKUQtyPair {
  sku: string;
  qty: string;
}

// Interface for an order record that contains an array of SKU/Quantity pairs and its associated label page index.
interface SKUPages {
  skuQtyPairs: SKUQtyPair[];
  pageIndex: number;
}

export class PdfProcessor {
  private originalPdfBytes: ArrayBuffer | null = null;
  private currentPdfDoc: PDFLib.PDFDocument | null = null;
  private originalFileName: string = "updated-amazon-label.pdf"; // default fallback

  // Load PDF from a File
  async loadPdf(file: File): Promise<void> {
    this.originalFileName = file.name.replace(/\.pdf$/i, ""); // remove .pdf
    this.originalPdfBytes = await file.arrayBuffer();
    this.currentPdfDoc = await PDFDocument.load(this.originalPdfBytes);
  }

  // Process the PDF based on provided options
  async processPdf(options: PdfProcessorOptions): Promise<void> {
    console.log(this.originalPdfBytes, this.currentPdfDoc);

    if (!this.originalPdfBytes || !this.currentPdfDoc) {
      throw new Error("Please upload a PDF first");
    }

    if (options.sortBySKU) {
      await this.sortBySKUAndLabel();
    }

    if (options.removeInvoices) {
      await this.removeEvenPages();
    }
  }

  // Remove even-numbered pages (assumed as invoices)
  async removeEvenPages(): Promise<void> {
    if (!this.currentPdfDoc) return;

    const newPdfDoc = await PDFDocument.create();
    const pages = this.currentPdfDoc.getPages();

    // Loop over pages and keep only the odd-numbered ones (1-indexed)
    for (let i = 0; i < pages.length; i++) {
      if ((i + 1) % 2 !== 0) {
        const [copiedPage] = await newPdfDoc.copyPages(this.currentPdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);
      }
    }

    this.currentPdfDoc = newPdfDoc;
  }

  // Sort orders by SKU and update the label pages with SKU and Quantity text.
  async sortBySKUAndLabel(): Promise<void> {
    if (!this.originalPdfBytes || !this.currentPdfDoc) return;

    // We are using a locally hosted worker file (ES module version)
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    // Load the PDF using PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: this.originalPdfBytes });
    const pdf = await loadingTask.promise;

    const skuPages: SKUPages[] = [];

    // Loop over each two-page order (label/invoice)
    // Here, we assume that the invoice page (from which text is extracted) is the even page (i+1)
    for (let i = 1; i < pdf.numPages; i += 2) {
      const pdfPage = await pdf.getPage(i + 1);
      const content = await pdfPage.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ");

      // Extract all SKU entries and quantities from the text using matchAll.
      const skuMatches = [
        ...text.matchAll(/\|\s*B0[A-Z0-9]{8}\s*\(([^)]+)\)/gi),
      ];
      const qtyMatches = [
        ...text.matchAll(/₹\s*\d+[.,]?\d*\s+(\d+)\s+₹\s*\d+[.,]?\d*/gi),
      ];

      const skuQtyPairs: SKUQtyPair[] = [];
      for (let j = 0; j < skuMatches.length; j++) {
        const sku = skuMatches[j] ? skuMatches[j][1] : "ZZZ";
        const qty = qtyMatches[j] ? qtyMatches[j][1] : "?";
        skuQtyPairs.push({ sku, qty });
      }

      skuPages.push({
        skuQtyPairs,
        pageIndex: i - 1, // Assumes that the corresponding label page is the preceding page
      });
    }

    // Sort orders based on the first SKU in each order (alphabetically)
    skuPages.sort((a, b) =>
      a.skuQtyPairs[0].sku.localeCompare(b.skuQtyPairs[0].sku)
    );

    const newPdfDoc = await PDFDocument.create();
    const font = await newPdfDoc.embedFont(StandardFonts.HelveticaBold);
    let orderCount = 0;

    // Iterate each order and update the label page with SKU/Quantity details
    for (const order of skuPages) {
      const { skuQtyPairs, pageIndex } = order;
      // Copy the label and invoice pages from the current PDF document.
      const [labelPage, invoicePage] = await newPdfDoc.copyPages(
        this.currentPdfDoc,
        [pageIndex, pageIndex + 1]
      );
      orderCount++;

      const { width, height } = labelPage.getSize();
      let yOffset = height - 655;

      // Draw each SKU/Quantity pair on its own line.
      skuQtyPairs.forEach(({ sku, qty }) => {
        labelPage.drawText(`${sku} | Qty - ${qty}`, {
          x: 50,
          y: yOffset,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        yOffset -= 18;
      });

      // Add an order identifier (for example)
      labelPage.drawText(`Order - ${orderCount}`, {
        x: width / 2 - 20,
        y: height - 830,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      newPdfDoc.addPage(labelPage);
      newPdfDoc.addPage(invoicePage);
    }

    this.currentPdfDoc = newPdfDoc;
  }

  // async downloadPdf(
  // ): Promise<void> {
  //   if (!this.currentPdfDoc) {
  //     throw new Error("No processed PDF to download");
  //   }

  //   // Get the PDF bytes as a Uint8Array.
  //   const pdfBytes = await this.currentPdfDoc.save();

  //   // Convert Uint8Array into a standard ArrayBuffer.
  //   const arrayBuffer = pdfBytes.buffer.slice(0, pdfBytes.byteLength);

  //   // Ensure strict conversion to ArrayBuffer.
  //   const fixedArrayBuffer = new Uint8Array(arrayBuffer).buffer;

  //   // Create the blob using the fixed ArrayBuffer.
  //   const blob = new Blob([pdfBytes], { type: "application/pdf" });
  //   const link = document.createElement("a");

  //   const filename = `${this.originalFileName}_success.pdf`;

  //   link.href = URL.createObjectURL(blob);
  //   link.download = filename;
  //   link.click();
  // }

  async downloadPdf(): Promise<void> {
    if (!this.currentPdfDoc) {
      throw new Error("No processed PDF to download");
    }
  
    const pdfBytes = await this.currentPdfDoc.save();
    const blob = new Blob([pdfBytes as Uint8Array], { type: "application/pdf" });
  
    const filename = `${this.originalFileName}_success.pdf`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
  
}

export const createPdfProcessor = () => new PdfProcessor();
