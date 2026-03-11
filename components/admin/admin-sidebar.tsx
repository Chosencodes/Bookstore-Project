"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, LayoutDashboard, BookMarked, FolderTree, Package, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Books", href: "/admin/books", icon: BookMarked },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Orders", href: "/admin/orders", icon: Package },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden lg:flex w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <span className="font-bold text-foreground">PageTurner</span>
          <span className="ml-2 text-xs text-muted-foreground">Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 mt-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <BookOpen className="h-5 w-5" />
          View Store
        </Link>
      </div>
    </aside>
  )
}
