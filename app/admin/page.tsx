import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { BookMarked, FolderTree, Package, DollarSign } from "lucide-react"

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: bookCount },
    { count: categoryCount },
    { count: orderCount },
    { data: orders },
  ] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount").eq("status", "completed"),
  ])

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  return {
    bookCount: bookCount || 0,
    categoryCount: categoryCount || 0,
    orderCount: orderCount || 0,
    totalRevenue,
  }
}

async function getRecentBooks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select(`
      id,
      title,
      author,
      price,
      stock_quantity,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(5)
  return data || []
}

export default async function AdminDashboardPage() {
  const [stats, recentBooks] = await Promise.all([
    getDashboardStats(),
    getRecentBooks(),
  ])

  const statCards = [
    {
      title: "Total Books",
      value: stats.bookCount,
      icon: BookMarked,
      description: "Books in inventory",
    },
    {
      title: "Categories",
      value: stats.categoryCount,
      icon: FolderTree,
      description: "Book categories",
    },
    {
      title: "Orders",
      value: stats.orderCount,
      icon: Package,
      description: "Total orders",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "From completed orders",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your bookstore
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Books */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Books</CardTitle>
          <CardDescription>Recently added books to your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBooks.length > 0 ? (
              recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${book.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {book.stock_quantity} in stock
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No books added yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
