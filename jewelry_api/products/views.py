from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Product, Category, Review
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    ReviewSerializer
)

class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


    def get_queryset(self):

        products = Product.objects.all()


        min_price = self.request.GET.get("min_price")
        max_price = self.request.GET.get("max_price")


        if min_price:
            products = products.filter(
                price__gte=min_price
            )


        if max_price:
            products = products.filter(
                price__lte=max_price
            )



        sort = self.request.GET.get("sort")


        if sort=="price_low":
            products=products.order_by("price")


        elif sort=="price_high":
            products=products.order_by("-price")


        elif sort=="latest":
            products=products.order_by("-id")


        return products



    def get_permissions(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy"
        ]:
            return [IsAdminUser()]


        return [IsAuthenticated()]






class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer


    permission_classes=[
        IsAuthenticated
    ]



    @action(
        detail=True,
        methods=["get"]
    )
    def products(self,request,pk=None):

        category=self.get_object()


        products=Product.objects.filter(
            category=category
        )


        serializer=ProductSerializer(
            products,
            many=True
        )


        return Response(
            serializer.data
        )

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product


class DeleteProductView(APIView):

    def delete(self,request,id):

        product = Product.objects.get(id=id)

        product.delete()


        return Response({

            "message":"Product Deleted"

        })


class ReviewView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, id):

        reviews = Review.objects.filter(product_id=id)

        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)


    def post(self, request):

        serializer = ReviewSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=request.user)

            return Response(serializer.data)

        return Response(serializer.errors)

from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        wishlist = Wishlist.objects.filter(user=request.user)

        serializer = WishlistSerializer(wishlist, many=True)

        return Response(serializer.data)


    def post(self, request):

        product_id = request.data.get("product")

        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user,
            product_id=product_id
        )

        return Response({
            "message": "Added to Wishlist ❤️"
        })


    def delete(self, request, id):

        Wishlist.objects.filter(
            user=request.user,
            product_id=id
        ).delete()

        return Response({
            "message": "Removed from Wishlist"
        })