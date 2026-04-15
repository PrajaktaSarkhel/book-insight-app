from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.book_list, name='book-list'),
    path('books/upload/', views.book_upload, name='book-upload'),
    path('books/<int:pk>/', views.book_detail, name='book-detail'),
    path('books/<int:pk>/recommend/', views.book_recommend, name='book-recommend'),
    path('books/<int:pk>/insights/', views.generate_insights, name='book-insights'),
    path('ask/', views.ask_question, name='ask-question'),
]