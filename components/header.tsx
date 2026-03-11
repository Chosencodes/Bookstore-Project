"use client"

import Link from "next/link"
import { BookOpen, Search, ShoppingCart, User, Menu, X, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* Top bar */}
      <div className="hidden lg:block bg-secondary/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-xs text-muted-foreground">
            <p>Free shipping on orders over $35</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-foreground transition-colors">Track Order</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Help</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Bookory</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 mx-8">
            <div className="relative w-full flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-r-none border-r-0 bg-secondary/50">
                    Categories
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/categories">All Categories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/books?category=fiction">Fiction</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/books?category=non-fiction">Non-Fiction</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/books?category=mystery-thriller">Mystery & Thriller</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search for books..."
                  className="rounded-l-none pl-4 pr-10 h-10"
                />
                <Button size="icon" className="absolute right-0 top-0 h-10 rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex relative">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                0
              </span>
              <span className="sr-only">Cart</span>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/auth/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
            <Button asChild className="hidden lg:flex">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 py-3 border-t border-border">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/books" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Browse Books
          </Link>
          <Link href="/categories" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/books?featured=true" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Featured
          </Link>
          <Link href="/books?sort=newest" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            New Arrivals
          </Link>
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Admin
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 px-4 border-t border-border bg-background">
          <div className="flex flex-col gap-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for books..."
                className="pl-10"
              />
            </div>
            
            {/* Mobile Nav */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/books"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Books
              </Link>
              <Link
                href="/categories"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/books?featured=true"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Featured
              </Link>
              <Link
                href="/admin"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
              <Link
                href="/auth/login"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
