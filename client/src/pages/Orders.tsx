import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Package, CheckCircle, Clock } from "lucide-react";


export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const sessionId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("session_id") : null;

  const { data: orders, isLoading: ordersLoading } = trpc.payments.getOrders.useQuery({
    limit: 20,
    offset: 0,
  });

  const { data: sessionOrder } = trpc.payments.getOrderBySession.useQuery(
    { sessionId: (sessionId as string) ?? "" },
    { enabled: !!sessionId }
  );

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>You must be logged in to view your orders.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Package className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">View and track your marketplace purchases</p>
        </div>

        {sessionOrder && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Payment Successful!</CardTitle>
              <CardDescription>Your order has been received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Order Number:</strong> {sessionOrder.orderNumber}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${(sessionOrder.totalAmount / 100).toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge className={getStatusColor(sessionOrder.status || "pending")}>
                    {sessionOrder.status || "pending"}
                  </Badge>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {ordersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders?.map((order: any) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <CardDescription>
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-semibold">${(order.totalAmount / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className="text-lg font-semibold capitalize">{order.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="text-lg font-semibold">
                        {order.items ? JSON.parse(order.items).length : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-lg font-semibold">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {order.items && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-semibold mb-2">Order Items:</p>
                      <div className="space-y-2">
                        {JSON.parse(order.items).map((item: any, idx: number) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            Product #{item.productId} - Qty: {item.quantity} @ ${item.price.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Track Shipment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You have not placed any orders yet.
              </p>
              <div className="text-center mt-4">
                <Button>
                  Start Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
