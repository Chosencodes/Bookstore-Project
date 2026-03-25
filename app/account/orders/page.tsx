import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order } from "@/types/database"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: orders } = await supabase
    .from("orders")
    .select("id,total,status,created_at")
    .order("created_at", { ascending: false })
    .limit(20)

  const list = (orders as Order[] | null) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">Your order history</p>
        </div>
        <Link href="/account" className="text-sm text-primary hover:underline">
          Back to Account
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>{list.length} orders</CardDescription>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-muted-foreground">You have no orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">{order.status}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/account/orders/${order.id}`} className="text-primary hover:underline">
                        View
                      </Link>
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
