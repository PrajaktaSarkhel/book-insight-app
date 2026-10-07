from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import Book

class BookAPITests(TestCase):
    def setUp(self):
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            genre="Fiction",
            rating=4.5,
            description="A thrilling test book story.",
            url="https://books.toscrape.com/test",
        )

    def test_get_book_list(self):
        response = self.client.get(reverse('book-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Test Book")

    def test_get_book_detail(self):
        response = self.client.get(reverse('book-detail', kwargs={'pk': self.book.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Test Book")

    def test_ask_question_empty(self):
        response = self.client.post(
            reverse('ask-question'),
            data={'question': ''},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

