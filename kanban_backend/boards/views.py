from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from lists.models import List
from tasks.models import Task
from tasks.serializers import TaskSerializer
from .serializers import BoardSerializer, InviteMemberSerializer, BoardMemberSerializer
from django.contrib.auth.models import User
from .models import Board, BoardMember
from .permissions import *

class CreateBoardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BoardSerializer(data=request.data)

        if serializer.is_valid():
            board = serializer.save(owner=request.user)
            return Response(
                {
                "msg": "Board created successfully"
            },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GetAllBoardListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        boards = Board.objects.filter(owner=request.user)

        serializer = BoardSerializer(boards, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class BoardDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            board = Board.objects.get(id=pk)
        except Board.DoesNotExist:
            return Response({"msg": "Board not found"}, status=status.HTTP_404_NOT_FOUND)

        lists = List.objects.filter(board=board).order_by('position')

        data = []

        for lst in lists:
            tasks = Task.objects.filter(list=lst).order_by('position')

            data.append({
                "list_id": lst.id,
                "title": lst.title,
                "position": lst.position,
                "tasks": TaskSerializer(tasks, many=True).data
            })

        return Response({
            "id": board.id,
            "name": board.name,
            "lists": data
        }, status=status.HTTP_200_OK)



class InviteMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, board_id):
        serializer = InviteMemberSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            role = serializer.validated_data['role']

            user = User.objects.get(username=username)
            board = Board.objects.get(id=board_id)

            if board.owner != request.user:
                return Response({"msg": "Only owner can invite"}, status=status.HTTP_403_FORBIDDEN)

            if BoardMember.objects.filter(board=board, user=user).exists():
                return Response({"msg": "User already a member"}, status=status.HTTP_400_BAD_REQUEST)

            BoardMember.objects.create(
                board=board,
                user=user,
                role=role
            )

            return Response({"msg": "Member added successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class BoardMembersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, board_id):
        board = Board.objects.get(id=board_id)

        members = BoardMember.objects.filter(board=board)
        serializer = BoardMemberSerializer(members, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class RemoveMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, board_id, user_id):
        board = Board.objects.get(id=board_id)

        if board.owner != request.user:
            return Response({"msg": "Only owner can remove"}, status=status.HTTP_403_FORBIDDEN)

        try:
            member = BoardMember.objects.get(board=board, user_id=user_id)
            member.delete()
            return Response({"msg": "Member removed"}, status=status.HTTP_200_OK)
        except BoardMember.DoesNotExist:
            return Response({"msg": "Member not found"}, status=status.HTTP_404_NOT_FOUND)