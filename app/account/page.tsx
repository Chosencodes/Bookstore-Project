import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order, OrderItem, Book, Profile } from "@/types/database"
import { SignOutButton } from "@/components/account/sign-out-button"

interface OrderWithItems extends Order {
  items?: (OrderItem & { book?: Book })[]
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      status,
      created_at,
      items:order_items(
        id,
        quantity,
        price,
        book:books(
          id,
          title,
          author,
          cover_image
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const safeProfile = profile as Profile | null
  const recentOrders = (orders as OrderWithItems[] | null) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Account</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and view your recent orders</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{safeProfile?.email ?? user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline" className="capitalize">
                  {(safeProfile?.role ?? "user")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">
                  {safeProfile?.created_at ? new Date(safeProfile.created_at).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Common actions for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/books"
                className="border border-border rounded-md px-4 py-3 hover:border-primary hover:text-primary transition-colors"
              >
                Browse Books
              </Link>
              <Link
                href="/categories"
                className="border border-border rounded-md px-4 py-3 hover:border-primary hover:text-primary transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/account/orders"
                className="border border-border rounded-md px-4 py-3 hover:border-primary hover:text-primary transition-colors"
              >
                My Orders
              </Link>
              <Link
                href="/account/profile"
                className="border border-border rounded-md px-4 py-3 hover:border-primary hover:text-primary transition-colors"
              >
                Profile Settings
              </Link>
              <Link
                href="/"
                className="border border-border rounded-md px-4 py-3 hover:border-primary hover:text-primary transition-colors"
              >
                Home
              </Link>
              <SignOutButton className="border border-border rounded-md px-4 py-3 hover:border-primary hover:text-primary transition-colors text-left" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground">You have no orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.items?.map((it) => it.book?.title).filter(Boolean).join(", ") || "-"}
                    </TableCell>
                    <TableCell>
                      {order.status === "completed" ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Completed
                        </Badge>
                      ) : order.status === "processing" ? (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Processing
                        </Badge>
                      ) : order.status === "cancelled" ? (
                        <Badge variant="outline" className="text-destructive border-destructive">
                          Cancelled
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      ${order.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
