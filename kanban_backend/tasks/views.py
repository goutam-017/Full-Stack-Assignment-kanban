from django.tasks import task
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from boards.models import BoardMember
from .serializers import TaskSerializer
from .models import Task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class CreateTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            list_obj = serializer.validated_data['list']
            board = list_obj.board

            if board.owner != request.user:
                return Response({"msg": "Action not allowed"}, status=status.HTTP_403_FORBIDDEN)

            task = serializer.save()

            channel_layer = get_channel_layer()

            async_to_sync(channel_layer.group_send)(
                f"board_{task.list.board.id}",
                {
                    "type": "send_update",
                    "data": {
                        "type": "task_created",
                        "task_id": task.id,
                        "title": task.title,
                        "list": task.list_id,
                        "position": task.position
                    }
                }
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        task = Task.objects.get(id=pk)
        new_list = request.data.get('list')
        new_position = request.data.get('position')
        new_title = request.data.get('title')
        new_description = request.data.get('description')
        new_due_date = request.data.get('due_date')
        new_assigned_to = request.data.get('assigned_to')

        if new_list:
            task.list_id = new_list

        if new_position is not None:
            task.position = new_position

        if new_title:
            task.title = new_title

        if new_description:
            task.description = new_description

        if new_due_date:
            task.due_date = new_due_date

        if new_assigned_to:
            task.assigned_to_id = new_assigned_to

        task.save()

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"board_{task.list.board.id}",
            {
                "type": "send_update",
                "data": {
                    "type": "task_updated",
                    "task_id": task.id,
                    "title": task.title,
                    "list": task.list_id,
                    "position": task.position
                }
            }
        )
        return Response({"msg": "Task updated"},status=status.HTTP_200_OK)
    
class DeleteTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        task = Task.objects.get(id=pk)
        board_id = task.list.board.id
        task_id = task.id

        task.delete()

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"board_{board_id}",
            {
                "type": "send_update",
                "data": {
                    "type": "task_deleted",
                    "task_id": task_id
                }
            }
        )
        return Response({"msg": "Deleted"}, status=status.HTTP_204_NO_CONTENT)