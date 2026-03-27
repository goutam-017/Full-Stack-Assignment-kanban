from django.urls import path
from .views import CreateTaskView, UpdateTaskView, DeleteTaskView

urlpatterns = [
    path('', CreateTaskView.as_view()),
    path('<int:pk>/', UpdateTaskView.as_view()),
    path('delete/<int:pk>/', DeleteTaskView.as_view()),
]