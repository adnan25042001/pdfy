import { PdfProcessorForm } from "@/components/pdf-processor-form";

export default function Home() {
  return (
    <div className="max-w-[1400px] py-10 md:py-16 mr-auto ml-auto w-full px-[2rem]">
      <div className="flex flex-col justify-center items-center space-y-4 text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Amazon PDF Cropper
        </h1>
        <p className="text-muted-foreground max-w-[700px] md:text-lg">
          Process Amazon shipping labels and invoices with ease. Organize your
          orders by SKU, remove invoice pages, and streamline your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 lg:order-2">
          <div className="bg-white rounded-xl shadow-lg border p-6 md:p-8">
            <PdfProcessorForm />
          </div>
        </div>

        <div className="lg:col-span-2 lg:order-1 flex flex-col justify-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                How It Works
              </h2>
              <p className="text-muted-foreground">
                Our tool helps you manage and organize your Amazon shipment PDFs
                with just a few clicks.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                  <span className="text-primary font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Upload your PDF</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by uploading your Amazon shipping PDF document
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                  <span className="text-primary font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Choose options</h3>
                  <p className="text-sm text-muted-foreground">
                    Select whether to remove invoice pages or sort by SKU
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                  <span className="text-primary font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Process and download</h3>
                  <p className="text-sm text-muted-foreground">
                    Click process and download your optimized PDF file
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <h3 className="font-medium mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                All PDF processing happens locally in your browser. We never
                store or transmit your files to any server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
