// ==========================
// TOKEN CHECK
// ==========================
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "login.html";
}




// ==========================
// LOAD USER
// ==========================
async function loadUser() {


  try {


    const response = await fetch("http://localhost:8000/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    if (!response.ok) {
      handleInvalidToken();
      return;
    }


    const data = await response.json();


    const username = document.getElementById("username");


    if (username) {
      username.innerText = data.user.fullName;
    }


  } catch (error) {
    console.error("Error loading user:", error);
  }


}




// ==========================
// LOAD USER SHELF BOOKS
// ==========================
async function loadBooks() {


  try {


// ---------- TO READ ----------
const toReadResponse = await fetch(
  "http://localhost:8000/api/user/books?status=to-read",
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);


const toReadBooks = await toReadResponse.json();


const toReadContainer = document.getElementById("toReadContainer");


if (toReadContainer) {


  toReadContainer.innerHTML = "";


  toReadBooks.forEach(item => {


    const book = item.bookId;


    // safety check
    if (!book) return;


    const card = document.createElement("div");
    card.classList.add("book");


    card.innerHTML = `
  <div class="book-card">


    <img src="${book.coverImage || 'https://via.placeholder.com/150'}"
    class="book-cover">


    <button onclick="moveToReading('${item._id}')">
      Start Reading
    </button>


    <button onclick="removeBook('${item._id}')">
      Remove
    </button>


  </div>
`;
    toReadContainer.appendChild(card);


  });


}


    // ---------- CURRENTLY READING ----------
    const currentResponse = await fetch(
      "http://localhost:8000/api/user/books?status=reading",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );


    const currentBooks = await currentResponse.json();


    const currentContainer = document.getElementById("currentlyReadingContainer");


    if (currentContainer) {


      currentContainer.innerHTML = "";


      currentBooks.forEach(item => {


        const book = item.bookId;


        const div = document.createElement("div");
        div.classList.add("reading-item");


        div.innerHTML = `
          <div class="book">
            <img
              src="${book.coverImage || 'assets/book-placeholder.png'}"
              style="width:100%; height:100%; object-fit:cover; border-radius:12px;"
            >
          </div>


          <div>
            <div class="book-name">${book.title}</div>
            <div class="author-name">${book.author}</div>
          </div>
        `;


        currentContainer.appendChild(div);


      });


    }


  }


  catch (error) {
    console.error("Error loading books:", error);
  }


}


// ==========================
// REMOVE BOOK FROM SHELF
// ==========================
async function removeBook(userBookId) {


  try {


    await fetch(`http://localhost:8000/api/user/books/${userBookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    alert("Book removed from shelf ❌");


    loadBooks(); // refresh UI


  }


  catch (error) {
    console.error("Error removing book:", error);
  }


}


// ==========================
// SEARCH BOOKS
// ==========================
async function searchBooks() {


  const query = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("searchResults");


  if (query === "") {
    container.innerHTML = "";
    return;
  }


  try {


    const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    const data = await response.json();


    container.innerHTML = "";


    data.docs.slice(0, 10).forEach(book => {


      const title = book.title;
      const author = book.author_name ? book.author_name[0] : "Unknown Author";


      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/150x220?text=No+Cover";


      const card = document.createElement("div");
      card.classList.add("book-card");


      card.innerHTML = `
        <img src="${cover}" class="book-cover">
        <h3>${title}</h3>
        <p>${author}</p>
        <button onclick="addBookToShelf('${title.replace(/'/g,"")}', '${author.replace(/'/g,"")}', '${cover}')">
          Add to Read Pile
        </button>
      `;


      container.appendChild(card);


    });


  } catch (error) {
    console.error("Error fetching books:", error);
  }


}




// ==========================
// ADD BOOK TO SHELF
// ==========================
async function addBookToShelf(title, author, coverImage) {


  try {


    let savedBook;


    // Try to create book
    const createBook = await fetch("http://localhost:8000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        author,
        coverImage
      })
    });


    if (createBook.status === 400) {


      // Book already exists → get it
      const books = await fetch(`http://localhost:8000/api/books?search=${title}`);
      const data = await books.json();


      savedBook = data.find(b => b.title === title);


    } else {


      savedBook = await createBook.json();


    }


    // Add to user shelf
    await fetch("http://localhost:8000/api/user/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        bookId: savedBook._id,
        status: "to-read"
      })
    });


    alert("Book added to Read Pile 📚");


    loadBooks();


  }


  catch (error) {
    console.error("Error adding book:", error);
  }


}
// ==========================
// MOVE BOOK TO CURRENTLY READING
// ==========================
async function moveToReading(userBookId) {


  try {


    await fetch(`http://localhost:8000/api/user/books/${userBookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: "reading"
      })
    });


    alert("Book moved to Currently Reading 📖");


    loadBooks();


  } catch (error) {
    console.error("Error moving book:", error);
  }


}


// ==========================
// PROFILE DROPDOWN
// ==========================
const profileIcon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");


if (profileIcon && profileDropdown) {


  profileIcon.addEventListener("click", function (e) {


    e.stopPropagation();
    profileDropdown.classList.toggle("show");


  });


  document.addEventListener("click", function () {


    profileDropdown.classList.remove("show");


  });


}
// ==========================
// SHELF DROPDOWN
// ==========================
const dropdownToggle = document.getElementById("dropdownToggle");
const dropdownMenu = document.getElementById("dropdownMenu");
const arrow = document.querySelector(".arrow");


if (dropdownToggle && dropdownMenu) {


  dropdownToggle.addEventListener("click", function (e) {


    e.stopPropagation();


    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
      arrow.classList.remove("rotate");
    }
    else {
      dropdownMenu.style.display = "block";
      arrow.classList.add("rotate");
    }


  });


  document.addEventListener("click", function () {
    dropdownMenu.style.display = "none";
    arrow.classList.remove("rotate");
  });


}


// ==========================
// LOAD RECOMMENDATIONS
// ==========================
async function loadRecommendations() {


  try {


    const response = await fetch("http://localhost:8000/api/books");
    const books = await response.json();


    const container = document.getElementById("recommendationContainer");
    container.innerHTML = "";


    books.slice(0,6).forEach(book => {


      const card = document.createElement("div");
      card.classList.add("book-card");


      card.innerHTML = `
        <img src="${book.coverImage || 'assets/book-placeholder.png'}" class="book-cover">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <button onclick="addBookToShelf('${book.title}', '${book.author}', '${book.coverImage}')">
          Add to Read Pile
        </button>
      `;


      container.appendChild(card);


    });


  } catch (error) {
    console.error("Error loading recommendations:", error);
  }


}
// ==========================
// LOGOUT
// ==========================
const logoutBtn = document.getElementById("logoutBtn");


if (logoutBtn) {


  logoutBtn.addEventListener("click", function () {


    localStorage.removeItem("token");
    localStorage.removeItem("user");


    window.location.href = "login.html";


  });


}




// ==========================
// INVALID TOKEN
// ==========================
function handleInvalidToken() {


  localStorage.removeItem("token");
  window.location.href = "login.html";


}




// ==========================
// INIT
// ==========================
loadUser();
loadBooks();
loadRecommendations();