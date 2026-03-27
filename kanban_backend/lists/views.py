from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ListSerializer

class CreateListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ListSerializer(data=request.data)

        if serializer.is_valid():
            list_obj = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UpdateListView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        from .models import List
        list_obj = List.objects.get(id=pk)

        serializer = ListSerializer(list_obj, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_202_ACCEPTED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)