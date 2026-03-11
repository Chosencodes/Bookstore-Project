import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft } from "lucide-react"
import type { Category, BookWithCategory } from "@/types/database"

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()
  return data as Category | null
}

async function getBooksByCategory(categoryId: string): Promise<BookWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
  return (data as BookWithCategory[]) || []
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const books = await getBooksByCategory(category.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Button variant="ghost" size="sm" asChild className="-ml-3">
              <Link href="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-muted-foreground">{category.description}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {books.length} {books.length === 1 ? "book" : "books"} in this category
            </p>
          </div>

          {/* Books Grid */}
          {books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found in this category yet.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/books">Browse All Books</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
