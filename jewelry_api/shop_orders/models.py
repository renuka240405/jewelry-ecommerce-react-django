from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Order(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    products = models.ManyToManyField(
        Product
    )

    status = models.CharField(
        max_length=50,
        default="Pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    total_price = models.IntegerField(
        default=0
    )

    payment_method = models.CharField(
        max_length=20,
        default="COD"
    )

    payment_status = models.CharField(
        max_length=20,
        default="Pending"
    )

    def __str__(self):
        return f"Order {self.id}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.IntegerField(
        default=1
    )

    price = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"