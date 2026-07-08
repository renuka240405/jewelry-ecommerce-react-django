from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):

    customer = serializers.CharField(
        source="user.username",
        read_only=True
    )

    products = serializers.SerializerMethodField()

    def get_products(self, order):

        data = []

        for product in order.products.all():
            data.append({
                "id": product.id,
                "name": product.name,
                "price": product.price
            })

        return data

    class Meta:

        model = Order

        fields = [
            "id",
            "customer",
            "products",
            "status",
            "created_at",
            "total_price",
        ]