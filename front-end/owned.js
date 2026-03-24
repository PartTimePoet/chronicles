// ==========================
// TOKEN CHECK
// ==========================
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "login.html";
}


// ==========================
// LOAD OWNED BOOKS
// ==========================
let allOwnedBooks = [];


async function loadOwnedBooks() {


  try {


    const response = await fetch(
      "http://localhost:8000/api/user/books?owned=true",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    const books = await response.json();


    allOwnedBooks = books;


    displayBooks(allOwnedBooks);


  } catch (error) {
    console.error("Error loading owned books:", error);
  }


}




// ==========================
// DISPLAY BOOKS
// ==========================
function displayBooks(bookList) {


  const container = document.querySelector(".book-list");


  container.innerHTML = "";


  if (bookList.length === 0) {
    container.innerHTML = "<p>No owned books yet 📚</p>";
    return;
  }


  bookList.forEach(item => {


    const book = item.bookId;


    const card = document.createElement("article");
    card.classList.add("book-card");


    card.innerHTML = `


  <div class="cover">
    <img src="${book.coverImage || 'https://via.placeholder.com/180x260'}"
    style="width:180px;border-radius:16px;">
  </div>


  <div class="info">


    <h2>${book.title}</h2>


    <p class="author">${book.author}</p>


    <p class="shelf-status">
      Shelf: ${item.status}
    </p>


  </div>


  <div class="actions">


    <span class="owned-label">✓ Owned</span>


    <button class="outline" onclick="removeBook('${item._id}')">
      remove
    </button>


  </div>


`;
    container.appendChild(card);


  });


}
// ==========================
// SEARCH OWNED BOOKS
// ==========================
const searchInput = document.querySelector(".search-read-books input");


searchInput.addEventListener("input", function () {


  const query = this.value.toLowerCase();


  const filtered = allOwnedBooks.filter(item => {


    const book = item.bookId;


    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );


  });


  displayBooks(filtered);


});




// ==========================
// DROPDOWN
// ==========================
const toggle = document.getElementById("dropdownToggle");
const menu = document.getElementById("dropdownMenu");


if (toggle && menu) {


  toggle.onclick = () => {
    menu.style.display =
      menu.style.display === "block" ? "none" : "block";
  };


}




// ==========================
// INIT
// ==========================
loadOwnedBooks();
// ==========================
// PROFILE MENU
// ==========================


const profileIcon = document.querySelector(".profile-icon");
const profileMenu = document.getElementById("profileMenu");


if (profileIcon) {


  profileIcon.onclick = () => {


    profileMenu.style.display =
      profileMenu.style.display === "block" ? "none" : "block";


  };


}
// ==========================
// REMOVE BOOK
// ==========================
async function removeBook(userBookId) {


  try {


    await fetch(`http://localhost:8000/api/user/books/${userBookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    // reload owned books
    loadOwnedBooks();


  } catch (error) {
    console.error("Error removing book:", error);
  }


}




// ==========================
// LOGOUT
// ==========================


function logout() {


  localStorage.removeItem("token");


  window.location.href = "login.html";


}