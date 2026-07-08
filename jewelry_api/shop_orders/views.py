from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Order
from .serializers import OrderSerializer


class OrderCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        product_ids = request.data.get("products")
        payment_method = request.data.get("payment_method", "COD")

        order = Order.objects.create(
            user=request.user,
            payment_method=payment_method,
            payment_status="Pending"
        )

        order.products.set(product_ids)

        total = 0

        for product in order.products.all():
            total += product.price

        order.total_price = total
        order.save()

        return Response({
            "message": "Order created",
            "id": order.id,
            "total": total,
            "payment_method": order.payment_method,
            "payment_status": order.payment_status
        })


class MyOrdersView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(user=request.user)

        result = []

        for order in orders:

            items = []

            for product in order.products.all():

                items.append({
                    "id": product.id,
                    "name": product.name,
                    "price": product.price
                })

            result.append({
                "id": order.id,
                "products": items,
                "status": order.status,
                "payment_method": order.payment_method,
                "payment_status": order.payment_status,
                "total_price": order.total_price,
                "created_at": order.created_at
            })

        return Response(result)


class UpdateStatusView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, id):

        order = Order.objects.get(id=id)

        order.status = request.data.get("status")

        order.save()

        return Response({
            "message": "Status Updated",
            "status": order.status
        })


class CancelOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, id):

        order = Order.objects.get(
            id=id,
            user=request.user
        )

        order.status = "Cancelled"
        order.save()

        return Response({
            "message": "Order Cancelled"
        })


class AllOrdersView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        orders = Order.objects.all()

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)


class AdminOrdersView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:
            return Response(
                {"error": "Admin only"},
                status=403
            )

        orders = Order.objects.all()

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)