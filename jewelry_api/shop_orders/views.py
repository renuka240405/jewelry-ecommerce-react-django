from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from .serializers import OrderSerializer


from rest_framework.permissions import IsAdminUser
from .models import Order


class OrderCreateView(APIView):

    permission_classes=[IsAuthenticated]


    def post(self,request):

        product_ids = request.data.get("products")


        order = Order.objects.create(
            user=request.user
        )


        order.products.set(product_ids)


        return Response({

            "message":"Order created",

            "id":order.id

        })



class MyOrdersView(APIView):

    permission_classes = [IsAuthenticated]


    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        )


        data = []


        for order in orders:


            products = []


            for product in order.products.all():

                products.append({

                    "id": product.id,

                    "name": product.name,

                    "price": product.price

                })



            data.append({

                "id": order.id,

                "products": products,

                "user": order.user.username,

                "status": getattr(
                    order,
                    "status",
                    "Pending"
                )

            })



        return Response(data)
class UpdateStatusView(APIView):

    permission_classes = [IsAdminUser]


    def post(self,request,id):

        order = Order.objects.get(id=id)

        order.status = request.data.get("status")

        order.save()


        return Response({

            "message":"Status Updated",

            "status":order.status

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

            "message":
            "Order Cancelled"

        })

from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order



class UpdateOrderStatusView(APIView):

    def post(self, request, id):

        order = Order.objects.get(id=id)


        status = request.data.get("status")


        order.status = status

        order.save()


        return Response({

            "message":"Status Updated",

            "status":order.status

        })
from rest_framework.permissions import IsAdminUser


class AllOrdersView(APIView):

    permission_classes = [IsAdminUser]


    def get(self,request):

        orders = Order.objects.all()

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)

class AdminOrdersView(APIView):

    permission_classes=[IsAuthenticated]


    def get(self,request):


        if not request.user.is_staff:

            return Response(
                {
                    "error":"Admin only"
                },
                status=403
            )


        orders = Order.objects.all()


        serializer = OrderSerializer(
            orders,
            many=True
        )


        return Response(
            serializer.data
        )