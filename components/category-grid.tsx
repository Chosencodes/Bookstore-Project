import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/types/database"

interface CategoryGridProps {
  categories: Category[]
}

const categorySubItems: Record<string, string[]> = {
  "Fiction": ["Classic Books", "Contemporary Literature", "Foreign Language Fiction", "Genre Fiction", "History & Criticism"],
  "Non-Fiction": ["Biographies", "Self-Help", "History", "Science", "Business"],
  "Mystery & Thriller": ["Crime Books", "Detective Books", "Mystery Books", "Suspense Books", "Thrillers"],
  "Science Fiction & Fantasy": ["Action & Adventure", "Coming of Age Sci-Fi", "Historical Sci-Fi", "Sci-Fi Horror", "Sci-Fi Humor"],
  "Romance": ["Contemporary Romance", "Romantic Fantasy", "Romantic Historical", "Romantic Mystery", "Romantic Sci-Fi"],
  "Children's Books": ["Action & Adventure", "Children's Animal Books", "Children's Humor", "Sci-Fi & Fantasy", "Classic Children's Books"],
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Shop by Category</h2>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/categories">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const subItems = categorySubItems[category.name] || ["Explore our collection", "Find your favorites", "New arrivals", "Bestsellers", "Staff picks"]
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Link href={`/categories/${category.slug}`}>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                  <ul className="mt-4 space-y-2">
                    {subItems.slice(0, 5).map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={`/categories/${category.slug}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center text-sm font-medium text-primary mt-4 hover:underline"
                  >
                    View More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
