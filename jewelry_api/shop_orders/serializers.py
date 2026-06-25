from rest_framework import serializers

from .models import Order, OrderItem



from rest_framework import serializers

from .models import Order



class OrderSerializer(serializers.ModelSerializer):

    products = serializers.SerializerMethodField()


    customer = serializers.CharField(
        source="user.username",
        read_only=True
    )


    class Meta:

        model = Order

        fields = [
            "id",
            "customer",
            "products",
            "status",
            "created_at"
        ]



    def get_products(self,obj):

        data=[]

        for product in obj.products.all():

            data.append({

                "id":product.id,

                "name":product.name,

                "price":product.price

            })


        return data