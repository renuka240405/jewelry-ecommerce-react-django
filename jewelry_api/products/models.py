from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.IntegerField()
    discount = models.IntegerField(default=0)
    rating = models.FloatField(default=0)
    category = models.CharField(max_length=100, default="Jewelry")
    metal = models.CharField(max_length=50, default="Gold")
    image = models.ImageField(upload_to="products/", blank=True, null=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    rating = models.IntegerField()

    comment = models.TextField()

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


from django.contrib.auth.models import User

class Wishlist(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"