from django.urls import path

from .views import (
    OrderCreateView,
    MyOrdersView,
    UpdateStatusView,
    CancelOrderView,
    AllOrdersView,
    AdminOrdersView,
)

urlpatterns = [
    path("create/", OrderCreateView.as_view()),
    path("myorders/", MyOrdersView.as_view()),
    path("update-status/<int:id>/", UpdateStatusView.as_view()),
    path("cancel/<int:id>/", CancelOrderView.as_view()),
    path("allorders/", AllOrdersView.as_view()),
    path("adminorders/", AdminOrdersView.as_view()),
]