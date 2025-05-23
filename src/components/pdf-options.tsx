"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"

interface PdfOptionsProps {
  removeInvoices: boolean
  setRemoveInvoices: (value: boolean) => void
  sortBySKU: boolean
  setSortBySKU: (value: boolean) => void
}

export function PdfOptions({
  removeInvoices,
  setRemoveInvoices,
  sortBySKU,
  setSortBySKU
}: PdfOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-base font-semibold">Processing Options</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want your PDF to be processed
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="removeInvoices" 
            checked={removeInvoices}
            onCheckedChange={(checked) => 
              setRemoveInvoices(checked as boolean)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <div className="flex items-center gap-1">
              <Label 
                htmlFor="removeInvoices" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remove Invoices (Even Pages)
              </Label>
              <div className="group relative">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 z-50">
                  Removes all even-numbered pages, which typically contain invoice information
                </span>
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Keep only the shipping labels and remove the invoice pages
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="sortBySKU" 
            checked={sortBySKU}
            onCheckedChange={(checked) => 
              setSortBySKU(checked as boolean)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <div className="flex items-center gap-1">
              <Label 
                htmlFor="sortBySKU" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sort by SKU and Print SKU + Quantity
              </Label>
              <div className="group relative">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 z-50">
                  Orders are sorted by SKU and quantities are printed on the label for easier identification
                </span>
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Sort all pages by SKU and add product information to the label pages
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}