from rest_framework import serializers
from .models import Product, Category, Review, Wishlist


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        required=True,
        max_length=100
    )

    price = serializers.IntegerField(
        min_value=1
    )

    description = serializers.CharField(
        required=True
    )

    class Meta:
        model = Product
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = "__all__"


class WishlistSerializer(serializers.ModelSerializer):

    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = "__all__"
