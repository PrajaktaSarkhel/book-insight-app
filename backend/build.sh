#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Auto-seed initial books if database is empty
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from books.models import Book
from django.core.management import call_command
if not Book.objects.exists():
    print('Empty database detected. Seeding books from fixture...')
    call_command('loaddata', 'initial_books.json')
    print('Seeding completed!')
else:
    print(f'Database ready with {Book.objects.count()} books.')
"
