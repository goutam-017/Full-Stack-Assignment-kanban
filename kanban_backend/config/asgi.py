import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import kanban_backend.tasks.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kanban_backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": AuthMiddlewareStack(
        URLRouter(
            kanban_backend.tasks.routing.websocket_urlpatterns
        )
    ),
})