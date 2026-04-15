from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=300)
    author = models.CharField(max_length=200, blank=True)
    rating = models.FloatField(default=0)
    description = models.TextField(blank=True)
    genre = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=500)
    summary = models.TextField(blank=True)        # AI-generated
    sentiment = models.CharField(max_length=50, blank=True)  # AI-generated
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title