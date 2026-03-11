import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturesSection } from "@/components/features-section"
import { FeaturedAuthor } from "@/components/featured-author"
import { Testimonials } from "@/components/testimonials"
import { CategoryGrid } from "@/components/category-grid"
import { Newsletter } from "@/components/newsletter"
import { StatsSection } from "@/components/stats-section"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight } from "lucide-react"
import type { BookWithCategory, Category } from "@/types/database"

async function getFeaturedBooks(): Promise<BookWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false })
    .limit(6)
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

async function getFavouriteReads(): Promise<BookWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false })
    .limit(9)
  return (data as BookWithCategory[]) || []
}

async function getAuthorBooks(): Promise<BookWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)
    .limit(4)
  return (data as BookWithCategory[]) || []
}

export default async function HomePage() {
  const [featuredBooks, categories, favouriteReads, authorBooks] = await Promise.all([
    getFeaturedBooks(),
    getCategories(),
    getFavouriteReads(),
    getAuthorBooks(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Features */}
        <FeaturesSection />

        {/* Featured Books */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Books</h2>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/books?featured=true">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/books?featured=true">View All Books</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Author */}
        <FeaturedAuthor authorBooks={authorBooks} />

        {/* Our Favourite Reads */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our Favourite Reads</h2>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/books">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favouriteReads.map((book) => (
                <BookCard key={book.id} book={book} showDescription />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Categories */}
        <CategoryGrid categories={categories} />

        {/* Newsletter */}
        <Newsletter />

        {/* Stats */}
        <StatsSection />
      </main>

      <Footer />
    </div>
  )
}
