import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DeleteCategoryButton } from "@/components/admin/delete-category-button"
import type { Category } from "@/types/database"

interface CategoryWithCount extends Category {
  book_count: number
}

async function getCategories(): Promise<CategoryWithCount[]> {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (!categories) return []

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

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage book categories
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>{categories.length} categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Slug</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Books</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-2">
                        <p className="font-medium text-foreground">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">
                        {category.slug}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {category.book_count}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <DeleteCategoryButton 
                            categoryId={category.id} 
                            categoryName={category.name}
                            bookCount={category.book_count}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No categories yet</p>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Category
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
