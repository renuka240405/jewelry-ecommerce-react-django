from rest_framework.permissions import IsAuthenticated

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer



class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = []


    def get_queryset(self):

        products = Product.objects.all()

        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')

        if min_price:
            products = products.filter(price__gte=min_price)

        if max_price:
            products = products.filter(price__lte=max_price)


        metal = self.request.GET.get('metal')

        if metal:
            products = products.filter(base_metal=metal)


        sort = self.request.GET.get('sort')

        if sort == 'price_low':
            products = products.order_by('price')

        elif sort == 'price_high':
            products = products.order_by('-price')

        elif sort == 'latest':
            products = products.order_by('-id')


        return products



class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):

        category = self.get_object()

        products = Product.objects.filter(
            category=category
        )

        serializer = ProductSerializer(
            products,
            many=True
        )

        return Response(serializer.data)

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Product
from .serializers import ProductSerializer



class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer


    def get_permissions(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy"
        ]:
            return [IsAdminUser()]

        return [IsAuthenticated()]