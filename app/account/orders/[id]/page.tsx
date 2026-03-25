import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order, OrderItem, Book } from "@/types/database"

interface OrderWithItems extends Order {
  items?: (OrderItem & { book?: Book })[]
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data } = await supabase
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
          author
        )
      )
    `)
    .eq("id", id)
    .single()

  if (!data) notFound()
  const order = data as OrderWithItems

  const subtotal = (order.items || []).reduce((sum, it) => sum + (it.price * it.quantity), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString()} • Status: {order.status}
          </p>
        </div>
        <Link href="/account/orders" className="text-sm text-primary hover:underline">
          Back to Orders
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Books included in this order</CardDescription>
        </CardHeader>
        <CardContent>
          {(!order.items || order.items.length === 0) ? (
            <p className="text-muted-foreground">No items found for this order.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Author</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.book?.title ?? "-"}</TableCell>
                    <TableCell className="hidden sm:table-cell">{it.book?.author ?? "-"}</TableCell>
                    <TableCell>{it.quantity}</TableCell>
                    <TableCell>${it.price.toFixed(2)}</TableCell>
                    <TableCell>${(it.price * it.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="mt-6 flex justify-end">
            <div className="text-right">
              <div className="text-muted-foreground">Subtotal</div>
              <div className="text-lg font-semibold text-foreground">${subtotal.toFixed(2)}</div>
              <div className="text-muted-foreground mt-1">Order Total</div>
              <div className="text-xl font-bold text-foreground">${order.total.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
