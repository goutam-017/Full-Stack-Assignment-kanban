from rest_framework.permissions import BasePermission
from .models import BoardMember, Board

class IsBoardMember(BasePermission):

    def has_permission(self, request, view):
        board_id = request.data.get('board') or view.kwargs.get('board_id')

        if not board_id:
            return False

        try:
            board = Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            return False

        if board.owner == request.user:
            return True

        return BoardMember.objects.filter(
            board=board,
            user=request.user
        ).exists()