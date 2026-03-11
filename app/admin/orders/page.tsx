import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import type { Order } from "@/types/database"

async function getOrders(): Promise<Order[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
  return (data as Order[]) || []
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "completed":
      return "default"
    case "processing":
      return "secondary"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage customer orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>{orders.length} orders total</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-2">
                        <p className="font-medium text-foreground font-mono text-sm">
                          {order.id.slice(0, 8)}...
                        </p>
                      </td>
                      <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-foreground">
                        ${order.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Orders will appear here when customers make purchases.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
