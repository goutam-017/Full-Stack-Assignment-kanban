from django.urls import path
from .views import *

urlpatterns = [
    path('', GetAllBoardListView.as_view()),
    path('create/', CreateBoardView.as_view()),
    path('<int:pk>/', BoardDetailView.as_view()),
    path('<int:board_id>/invite/', InviteMemberView.as_view()),
    path('<int:board_id>/members/', BoardMembersListView.as_view()),
    path('<int:board_id>/remove/<int:user_id>/', RemoveMemberView.as_view()),
]