// Fungsi untuk menghasilkan ID unik
function generateId() {
  return new Date().getTime();
}

// Fungsi untuk menyimpan data buku ke localStorage
function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Fungsi untuk mengambil data buku dari localStorage
function getBooksFromLocalStorage() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

// Fungsi untuk menambahkan buku baru
function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };

  const books = getBooksFromLocalStorage();
  books.push(newBook);
  saveBooksToLocalStorage(books);

  renderBooks();
  document.getElementById("bookForm").reset();

  // Scroll otomatis ke rak buku yang sesuai
  setTimeout(() => {
    const targetSection = isComplete
      ? document.getElementById("completeBookList")
      : document.getElementById("incompleteBookList");
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 300);
}

// Fungsi untuk memindahkan buku antar rak
function toggleBookStatus(bookId) {
  const books = getBooksFromLocalStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);
  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  saveBooksToLocalStorage(books);
  renderBooks();
}

// Fungsi untuk menghapus buku
function deleteBook(bookId) {
  const books = getBooksFromLocalStorage();
  const filteredBooks = books.filter((book) => book.id !== bookId);
  saveBooksToLocalStorage(filteredBooks);
  renderBooks();
}

// Fungsi untuk mengedit buku
function editBook(bookId) {
  const books = getBooksFromLocalStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);
  const book = books[bookIndex];

  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  deleteBook(bookId);

  // Scroll otomatis ke form edit
  document.getElementById("bookForm").scrollIntoView({ behavior: "smooth" });
}

// Fungsi untuk mencari buku
function searchBooks(event) {
  event.preventDefault();
  const searchTerm = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = getBooksFromLocalStorage();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );
  renderBooks(filteredBooks);
}

// Fungsi untuk merender buku ke dalam rak
function renderBooks(books = getBooksFromLocalStorage()) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton">${
                  book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
                }</button>
                <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                <button data-testid="bookItemEditButton">Edit Buku</button>
            </div>
        `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }

    // Tambahkan event listener untuk tombol-tombol
    bookElement
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => toggleBookStatus(book.id));
    bookElement
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => deleteBook(book.id));
    bookElement
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => editBook(book.id));
  });
}

// Event listener untuk form tambah buku
document.getElementById("bookForm").addEventListener("submit", addBook);

// Event listener untuk form pencarian buku
document.getElementById("searchBook").addEventListener("submit", searchBooks);

// Render buku saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderBooks(); // Pastikan ini dipanggil
});
