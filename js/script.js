const apply = document.getElementById("apply");
const searchInput = document.getElementById("ser-inp");
const booksContainer = document.getElementById("books-container");
const searchResults = document.getElementById("search-results");
const bookDetails = document.getElementById("book-details");
const bookDetailContainer = document.getElementById("book-detail-container");
searchInput.onfocus = () => document.querySelector('label[for="ser-inp"] i').classList.add("changeColor");
searchInput.onblur = () => document.querySelector('label[for="ser-inp"] i').classList.remove("changeColor");
window.onclick = (e) => {
  if (e.target.classList.contains("book-details")) {
    bookDetails.classList.remove("visible");
  }
}
let apiRequestCount = 0;
let booksArray = [];
let maxResults = 30;
let defaultBook = "novels";
apply.onclick = () => {
  // RESET COUNT REQUEST
  if (apiRequestCount == 3) {
    setTimeout(() => {
      apiRequestCount = 0;
    }, 2000);
  }

  if (apiRequestCount < 3 && searchInput.value.trim() !== "") {
    const searchValue = searchInput.value.trim();
    fetchBooks(searchValue, maxResults);
    searchResults.textContent = `Search Results : ${searchValue}`;
  }
  apiRequestCount++;
}
async function fetchBooks(topic, booksLimit) {
  try {
    const requestUrl = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${topic}&maxResults=${booksLimit}`);
    if (!requestUrl.ok) {
      throw new Error(`HTTP STATUS -> ${requestUrl.status}`);
    }
    const response = await requestUrl.json();
    const items = response.items || [];
    booksContainer.innerHTML = "";
    booksArray = [];
    items.forEach((book) => {
      const volumeInfo = book.volumeInfo;
      booksArray.push({
        id: book.id,
        title: volumeInfo.title || "Unavailable",
        authors: volumeInfo.authors || "Unavailable",
        publisher: volumeInfo.publisher || "Unavailable",
        publishedDate: volumeInfo.publishedDate || "Unavailable",
        description: volumeInfo.description || "Unavailable",
        imageLinks: volumeInfo.imageLinks || "",
        pageCount: volumeInfo.pageCount || "Unavailable",
        previewLink: volumeInfo.previewLink || "Unavailable",
        categories: volumeInfo.categories || "Unavailable"
      })
    })
    renderBooks(booksArray);
    console.log(items)
  } catch (error) {
    setTimeout(() => console.log(error), 0)
  }
}
function renderBooks(booksArray) {
  booksArray.forEach((book) => {
    booksContainer.innerHTML += `
  <div class="book-item" onclick="showDetails('${book.id}')">
      <img src="${book.imageLinks.thumbnail || ""}" alt="Book Cover">
      <div class="book-info">
     <h3>${book.title}</h3>
     <p>Author: ${Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}</p>
    </div>
  </div>
    `;
  })
}
fetchBooks(defaultBook, maxResults);
searchResults.textContent = `Search Results : ${defaultBook}`;
function showDetails(bookId) {
  document.getElementById('header').scrollIntoView({
    behavior: 'smooth'
  });
  booksArray.forEach((book) => {
    bookDetails.classList.add("visible");
    if (book.id == bookId) {
      bookDetailContainer.innerHTML = `
       <img src="${book.imageLinks.thumbnail || ""}"
        alt="book cover">
        <h2>${book.title}</h2>
        <ul class="details">
          <li><strong>Author:</strong> ${Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}</li>
          <li><strong>Publication Year:</strong> ${book.publishedDate}</li>
          <li><strong>Publisher:</strong>${book.publisher}</li>
          <li><strong>Pages:</strong> ${book.pageCount}</li>
          <li><strong>categories:</strong>${Array.isArray(book.categories) ? book.categories.join(", ") : book.categories}</li>
        <li class="book-description"><strong>Description:</strong> ${book.description}</li>
          </ul>
        <a href="${book.previewLink}" class="previewLink-btn" target="_blank">Learn More</a>
      `;
    }
  })
}
