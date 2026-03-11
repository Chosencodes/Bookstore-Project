import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import type { Category } from "@/types/database"

interface CategoryCardProps {
  category: Category
  bookCount?: number
}

export function CategoryCard({ category, bookCount }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group border-border hover:border-primary hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            {bookCount !== undefined && (
              <p className="text-sm text-muted-foreground mt-1">
                {bookCount} {bookCount === 1 ? "book" : "books"}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </CardContent>
      </Card>
    </Link>
  )
}
