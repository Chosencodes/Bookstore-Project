import { Suspense } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/server"
import type { BookWithCategory, Category } from "@/types/database"

interface BooksPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    page?: string
  }>
}

async function getBooks(categorySlug?: string, sort?: string): Promise<BookWithCategory[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()
    
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "title":
      query = query.order("title", { ascending: true })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
      break
  }

  const { data } = await query
  return (data as BookWithCategory[]) || []
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  return (data as Category[]) || []
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

async function BookGrid({ categorySlug, sort }: { categorySlug?: string; sort?: string }) {
  const books = await getBooks(categorySlug, sort)

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No books found in this category.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/books">View All Books</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { category, sort } = await searchParams
  const categories = await getCategories()

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "title", label: "Title A-Z" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Browse Books</h1>
            <p className="mt-2 text-muted-foreground">
              Discover our complete collection of books
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    <Link href="/books">
                      <Badge
                        variant={!category ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        All Books
                      </Badge>
                    </Link>
                    {categories.map((cat) => (
                      <Link key={cat.id} href={`/books?category=${cat.slug}`}>
                        <Badge
                          variant={category === cat.slug ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {cat.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Sort By</h3>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    {sortOptions.map((option) => (
                      <Link
                        key={option.value}
                        href={`/books?${category ? `category=${category}&` : ""}sort=${option.value}`}
                      >
                        <Badge
                          variant={(sort || "newest") === option.value ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {option.label}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Book Grid */}
            <div className="flex-1">
              <Suspense fallback={<BookGridSkeleton />}>
                <BookGrid categorySlug={category} sort={sort} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
