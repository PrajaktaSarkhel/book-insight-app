from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .ai_service import generate_summary, generate_sentiment

# GET - List all books
@api_view(['GET'])
def book_list(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

# GET - Single book detail
@api_view(['GET'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = BookSerializer(book)
    return Response(serializer.data)

# GET - Recommend books by same genre
@api_view(['GET'])
def book_recommend(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    similar = Book.objects.filter(genre=book.genre).exclude(pk=pk)[:5]
    serializer = BookSerializer(similar, many=True)
    return Response(serializer.data)

# POST - Add a new book
@api_view(['POST'])
def book_upload(request):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# POST - Ask a question about books (RAG)
@api_view(['POST'])
def ask_question(request):
    question = request.data.get('question', '')
    if not question:
        return Response({'error': 'No question provided'}, status=status.HTTP_400_BAD_REQUEST)

    # Simple RAG - search books by matching keywords
    words = question.lower().split()
    books = Book.objects.all()

    # Find most relevant books
    relevant_books = []
    for book in books:
        text = (book.title + " " + book.description + " " + book.genre).lower()
        matches = sum(1 for word in words if word in text)
        if matches > 0:
            relevant_books.append((matches, book))

    relevant_books.sort(reverse=True, key=lambda x: x[0])
    top_books = [b for _, b in relevant_books[:3]]

    if not top_books:
        return Response({'answer': 'No relevant books found for your question.'})

    # Build context from top books
    context = "\n\n".join([
        f"Title: {b.title}\nGenre: {b.genre}\nDescription: {b.description}"
        for b in top_books
    ])

    # Ask LM Studio
    prompt = f"""Based on these books:

{context}

Answer this question: {question}

Answer:"""

    from .ai_service import ask_lm_studio
    answer = ask_lm_studio(prompt)

    return Response({
        'question': question,
        'answer': answer,
        'sources': [{'id': b.id, 'title': b.title} for b in top_books]
    })


# POST - Generate AI insights for a book
@api_view(['POST'])
def generate_insights(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

    book.summary = generate_summary(book.description)
    book.sentiment = generate_sentiment(book.description)
    book.save()

    serializer = BookSerializer(book)
    return Response(serializer.data)