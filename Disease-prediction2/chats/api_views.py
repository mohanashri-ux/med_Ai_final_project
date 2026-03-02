from rest_framework import viewsets, permissions
from .models import Chat, Feedback
from .serializers import ChatSerializer, FeedbackSerializer

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        consultation_id = self.request.query_params.get('consultation_id')
        if consultation_id:
            return self.queryset.filter(consultation_id=consultation_id)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
