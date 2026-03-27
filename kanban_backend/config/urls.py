from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/boards/', include('boards.urls')),
    path('api/lists/', include('lists.urls')),
    path('api/tasks/', include('tasks.urls')),
]