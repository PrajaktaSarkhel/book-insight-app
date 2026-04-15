import requests
from bs4 import BeautifulSoup
import time

BASE_URL = "https://books.toscrape.com/catalogue/"
START_URL = "https://books.toscrape.com/catalogue/page-1.html"

RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}

def scrape_books(max_pages=5):
    books = []
    url = START_URL

    for page in range(max_pages):
        print(f"Scraping page {page + 1}...")
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        for article in soup.select("article.product_pod"):
            # Title
            title = article.h3.a["title"]

            # Rating
            rating_word = article.p["class"][1]
            rating = RATING_MAP.get(rating_word, 0)

            # URL
            book_url = BASE_URL + article.h3.a["href"].replace("../", "")

            # Get description from book's own page
            book_response = requests.get(book_url)
            book_soup = BeautifulSoup(book_response.text, 'html.parser')

            desc_tag = book_soup.select_one("article.product_page > p")
            description = desc_tag.text.strip() if desc_tag else ""

            genre_tag = book_soup.select("ul.breadcrumb li")
            genre = genre_tag[2].text.strip() if len(genre_tag) >= 3 else "Unknown"

            books.append({
                "title": title,
                "author": "Unknown",   # site doesn't show author on listing
                "rating": rating,
                "description": description,
                "genre": genre,
                "url": book_url,
            })
            print(f"  ✓ {title}")
            time.sleep(0.5)  # be polite, don't hammer the server

        # Go to next page
        next_btn = soup.select_one("li.next a")
        if next_btn:
            url = BASE_URL + next_btn["href"]
        else:
            break

    return books


if __name__ == "__main__":
    books = scrape_books(max_pages=2)  # start with 2 pages = ~40 books
    print(f"\nScraped {len(books)} books!")

    # Send each book to Django API
    for book in books:
        response = requests.post("http://127.0.0.1:8000/api/books/upload/", json=book)
        if response.status_code == 201:
            print(f"✓ Saved: {book['title']}")
        else:
            print(f"✗ Failed: {book['title']} → {response.text}")