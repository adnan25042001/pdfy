import Link from "next/link"
import { FileText, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="max-w-[1400px] flex flex-col md:flex-row items-center justify-between py-10 md:h-24 md:py-0 mr-auto ml-auto w-full px-[2rem]">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Amazon PDF Cropper</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Amazon PDF Cropper. All rights reserved.
          </p>
          <div className="flex items-center justify-center md:justify-end gap-4">
            <Link 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}