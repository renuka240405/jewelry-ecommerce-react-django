from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProductViewSet,
    CategoryViewSet,
    DeleteProductView,
    ReviewView,
    WishlistView,
)

router = DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"categories", CategoryViewSet)

urlpatterns = [
    path("", include(router.urls)),

    # Review
    path("review/", ReviewView.as_view()),              # POST
    path("review/<int:id>/", ReviewView.as_view()),     # GET

    # Wishlist
    path("wishlist/", WishlistView.as_view()),
    path("wishlist/<int:id>/", WishlistView.as_view()),

    # Delete Product
    path("delete/<int:id>/", DeleteProductView.as_view()),
]