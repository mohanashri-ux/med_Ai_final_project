from rest_framework import serializers
from .models import Chat, Feedback
from django.contrib.auth.models import User
from main_app.models import consultation

class ChatSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    consultation_id = serializers.PrimaryKeyRelatedField(queryset=consultation.objects.all())
    
    class Meta:
        model = Chat
        fields = ['id', 'created', 'consultation_id', 'sender', 'sender_name', 'message']
        read_only_fields = ['sender']

class FeedbackSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    class Meta:
        model = Feedback
        fields = ['id', 'created', 'sender', 'sender_name', 'feedback']
        read_only_fields = ['sender']
