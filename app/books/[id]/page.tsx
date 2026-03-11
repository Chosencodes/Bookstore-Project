import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/server"
import { ShoppingCart, ArrowLeft, Check, X } from "lucide-react"
import type { BookWithCategory } from "@/types/database"

interface BookDetailPageProps {
  params: Promise<{ id: string }>
}

async function getBook(id: string): Promise<BookWithCategory | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", id)
    .single()
  return data as BookWithCategory | null
}

async function getRelatedBooks(categoryId: string, excludeId: string): Promise<BookWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(4)
  return (data as BookWithCategory[]) || []
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params
  const book = await getBook(id)

  if (!book) {
    notFound()
  }

  const relatedBooks = book.category_id
    ? await getRelatedBooks(book.category_id, book.id)
    : []

  const isOnSale = book.discount_percentage && book.discount_percentage > 0
  const discountedPrice = isOnSale
    ? book.price * (1 - (book.discount_percentage || 0) / 100)
    : book.price

  const inStock = book.stock_quantity > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Button variant="ghost" size="sm" asChild className="-ml-3">
              <Link href="/books">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Books
              </Link>
            </Button>
          </nav>

          {/* Book Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-[2/3] max-w-md mx-auto lg:mx-0 bg-secondary rounded-lg overflow-hidden">
              {book.cover_image_url ? (
                <Image
                  src={book.cover_image_url}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <span className="text-8xl font-serif">{book.title.charAt(0)}</span>
                </div>
              )}
              {isOnSale && (
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-lg px-3 py-1">
                  {book.discount_percentage}% OFF
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {book.category && (
                <Link href={`/categories/${book.category.slug}`}>
                  <Badge variant="outline" className="w-fit mb-4 hover:bg-secondary transition-colors">
                    {book.category.name}
                  </Badge>
                </Link>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mt-2">by {book.author}</p>

              <div className="flex items-center gap-3 mt-6">
                <span className="text-3xl font-bold text-foreground">
                  ${discountedPrice.toFixed(2)}
                </span>
                {isOnSale && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${book.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4">
                {inStock ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    <span className="text-muted-foreground">({book.stock_quantity} available)</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-destructive" />
                    <span className="text-destructive font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              <Separator className="my-6" />

              {book.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Book Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {book.isbn && (
                  <div>
                    <span className="text-sm text-muted-foreground">ISBN</span>
                    <p className="font-medium text-foreground">{book.isbn}</p>
                  </div>
                )}
                {book.publication_year && (
                  <div>
                    <span className="text-sm text-muted-foreground">Publication Year</span>
                    <p className="font-medium text-foreground">{book.publication_year}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button size="lg" className="flex-1" disabled={!inStock}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                More in {book.category?.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedBooks.map((relatedBook) => (
                  <BookCard key={relatedBook.id} book={relatedBook} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
