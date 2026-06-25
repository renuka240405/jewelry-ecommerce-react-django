from django.urls import path
from . import views


urlpatterns = [

    path(
        "create/",
        views.OrderCreateView.as_view()
    ),


    path(
        "myorders/",
        views.MyOrdersView.as_view()
    ),


    path(
        "cancel/<int:id>/",
        views.CancelOrderView.as_view()
    ),


    path(
        "update-status/<int:id>/",
        views.UpdateStatusView.as_view()
    ),


    path(
        "allorders/",
        views.AllOrdersView.as_view()
    ),

    path(
"allorders/",
views.AdminOrdersView.as_view()
),

]