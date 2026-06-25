from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Order(models.Model):

    STATUS_CHOICES = (

        ("Pending","Pending"),

        ("Shipped","Shipped"),

        ("Delivered","Delivered"),

    )

    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )


    products = models.ManyToManyField(
    Product
)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

         return str(self.id)

class OrderItem(models.Model):

    order=models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )


    product=models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )


    quantity=models.IntegerField(
        default=1
    )


    price=models.IntegerField()



    
