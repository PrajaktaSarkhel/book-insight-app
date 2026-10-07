from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "status": "online",
        "service": "Biblios — AI Book Intelligence API",
        "endpoints": {
            "books": "/api/books/",
            "ask_ai": "/api/ask/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('books.urls')),
]