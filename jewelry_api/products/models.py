from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    image_url = models.URLField()

    def __str__(self):
        return self.name



from django.db import models


class Product(models.Model):

    name = models.CharField(max_length=100)

    description = models.TextField()

    price = models.IntegerField()

    discount = models.IntegerField(default=0)

    rating = models.FloatField(default=0)
    
    category = models.CharField(
        max_length=100,
        default="Jewelry"
    )
    
    
    image = models.ImageField(
        upload_to="products/",
        null=True,
        blank=True
    )


    def __str__(self):

        return self.name