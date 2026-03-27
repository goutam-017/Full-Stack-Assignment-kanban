from rest_framework import serializers
from .models import Board,BoardMember
from django.contrib.auth.models import User

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'name']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Board name cannot be empty")
        return value
    
    def create(self, validated_data):
        return Board.objects.create(**validated_data)


class BoardMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = BoardMember
        fields = ['id', 'board', 'user', 'username', 'role']
        read_only_fields = ['board']


class InviteMemberSerializer(serializers.Serializer):
    username = serializers.CharField()
    role = serializers.ChoiceField(choices=['admin', 'member'], default='member')

    def validate_username(self, value):
        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value