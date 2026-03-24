// ==========================
// TOKEN CHECK
// ==========================
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "login.html";
}




// ==========================
// LOAD TO READ BOOKS
// ==========================
async function loadToReadBooks() {


  try {


    const response = await fetch(
      "http://localhost:8000/api/user/books?status=to-read",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    const data = await response.json();


    console.log("API RESPONSE:", data); // 👈 VERY IMPORTANT


    if (!Array.isArray(data)) {
      console.error("Books API did not return an array:", data);
      return;
    }


    allBooks = data;


    displayBooks(allBooks);


  } catch (error) {
    console.error("Error loading books:", error);
  }


}
// ==========================
// DISPLAY BOOKS
// ==========================
function displayBooks(bookList) {


  const container = document.querySelector(".book-list");


  container.innerHTML = "";


  if (bookList.length === 0) {
    container.innerHTML = "<p>No books in your To-Read pile 📚</p>";
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


        <p class="series">Book series name #book number</p>


        <h2>${book.title}</h2>


        <p class="author">${book.author}</p>


        <p class="placeholder">
          pages • binding • first pub year • edition • no. of editions
        </p>


        <div class="tags">
          <button>n/f</button>
          <button>genre</button>
          <button>genre</button>
          <button>mood</button>
          <button>mood</button>
          <button>pace</button>
        </div>


      </div>


      <div class="actions">


        <button class="review">⭐ Add review</button>


        <div class="date">Started —</div>
        <div class="date">Finished —</div>


        <select onchange="changeShelf('${item._id}', this.value)">
          <option value="to-read" selected>to read</option>
          <option value="reading">currently reading</option>
          <option value="completed">read</option>
          <option value="dnf">did not finish</option>
        </select>


        <button class="owned" onclick="markOwned('${item._id}')">mark as owned ✓</button>


        <button class="outline" onclick="removeBook('${item._id}')">
          remove
        </button>


      </div>


    `;


    container.appendChild(card);


  });


}




// ==========================
// SEARCH BOOKS
// ==========================
const searchInput = document.querySelector(".search-read-books input");


searchInput.addEventListener("input", function () {


  const query = this.value.toLowerCase();


  const filtered = allBooks.filter(item => {


    const book = item.bookId;


    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );


  });


  displayBooks(filtered);


});




// ==========================
// CHANGE SHELF
// ==========================
async function changeShelf(userBookId, status) {


  try {


    await fetch(`http://localhost:8000/api/user/books/${userBookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });


    loadToReadBooks();


  } catch (error) {
    console.error("Error updating shelf:", error);
  }


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


    loadToReadBooks();


  } catch (error) {
    console.error("Error removing book:", error);
  }


}




// ==========================
// MARK AS OWNED
// ==========================
async function markOwned(userBookId) {


  try {


    await fetch(`http://localhost:8000/api/user/books/${userBookId}/owned`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    loadToReadBooks();


  } catch (error) {
    console.error("Error marking as owned:", error);
  }


}




// ==========================
// DROPDOWN 1
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
// DROPDOWN 2
// ==========================
const toggle2 = document.getElementById("dropdownToggle2");
const menu2 = document.getElementById("dropdownMenu2");


if (toggle2 && menu2) {


  toggle2.onclick = () => {
    menu2.style.display =
      menu2.style.display === "block" ? "none" : "block";
  };


}




// ==========================
// INIT
// ==========================
loadToReadBooks();
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
// LOGOUT
// ==========================


function logout() {


  localStorage.removeItem("token");


  window.location.href = "login.html";


}