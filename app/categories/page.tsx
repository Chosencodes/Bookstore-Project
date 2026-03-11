import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryCard } from "@/components/category-card"
import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/types/database"

interface CategoryWithCount extends Category {
  book_count: number
}

async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (!categories) return []

  // Get book counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from("books")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
      
      return {
        ...category,
        book_count: count || 0,
      }
    })
  )

  return categoriesWithCounts
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="mt-2 text-muted-foreground">
              Browse books by genre and discover your next favorite read
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                bookCount={category.book_count}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
