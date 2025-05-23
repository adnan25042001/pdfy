import Link from "next/link"
import { FileText } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1400px] flex h-16 items-center justify-between py-4 mr-auto ml-auto w-full px-[2rem]">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Amazon PDF Cropper</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            How It Works
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}