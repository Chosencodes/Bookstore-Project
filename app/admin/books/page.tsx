import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DeleteBookButton } from "@/components/admin/delete-book-button"
import type { BookWithCategory } from "@/types/database"

async function getBooks(): Promise<BookWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false })
  return (data as BookWithCategory[]) || []
}

export default async function AdminBooksPage() {
  const books = await getBooks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Books</h1>
          <p className="text-muted-foreground mt-1">
            Manage your book inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/books/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Books</CardTitle>
          <CardDescription>{books.length} books in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {books.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Author</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">Stock</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-foreground">{book.title}</p>
                          <p className="text-sm text-muted-foreground sm:hidden">{book.author}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">{book.author}</td>
                      <td className="py-3 px-2 hidden md:table-cell">
                        {book.category && (
                          <Badge variant="outline">{book.category.name}</Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <span className="text-foreground">${book.price.toFixed(2)}</span>
                          {book.discount_percentage && book.discount_percentage > 0 && (
                            <Badge className="ml-2 bg-accent text-accent-foreground text-xs">
                              -{book.discount_percentage}%
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 hidden lg:table-cell text-muted-foreground">
                        {book.stock_quantity}
                      </td>
                      <td className="py-3 px-2">
                        {book.stock_quantity > 0 ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-destructive border-destructive">
                            Out of Stock
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/books/${book.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No books yet</p>
              <Button asChild>
                <Link href="/admin/books/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Book
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
