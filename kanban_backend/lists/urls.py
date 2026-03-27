from django.urls import path
from .views import CreateListView, UpdateListView

urlpatterns = [
    path('', CreateListView.as_view()),
    path('<int:pk>/', UpdateListView.as_view()),
]