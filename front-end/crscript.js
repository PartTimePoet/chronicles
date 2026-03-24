// ===============================
// TOKEN
// ===============================
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "login.html";
}




// ===============================
// DROPDOWN - YOUR SHELVES
// ===============================
const toggle = document.getElementById("dropdownToggle");
const menu = document.getElementById("dropdownMenu");
const arrow = document.querySelector(".arrow");


toggle.onclick = () => {


  if (menu.style.display === "block") {
    menu.style.display = "none";
    arrow.style.transform = "rotate(0deg)";
  } else {
    menu.style.display = "block";
    arrow.style.transform = "rotate(180deg)";
  }


};




// ===============================
// DROPDOWN - SORT
// ===============================
const toggle2 = document.getElementById("dropdownToggle2");
const menu2 = document.getElementById("dropdownMenu2");
const arrow2 = document.querySelector(".arrow2");


toggle2.onclick = () => {


  if (menu2.style.display === "block") {
    menu2.style.display = "none";
    arrow2.style.transform = "rotate(0deg)";
  } else {
    menu2.style.display = "block";
    arrow2.style.transform = "rotate(180deg)";
  }


};




// ===============================
// LOAD CURRENTLY READING BOOKS
// ===============================
async function loadBooks() {


  try {


    const response = await fetch(
      "http://localhost:8000/api/user/books?status=reading",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    const books = await response.json();


    const container = document.getElementById("bookList");


    container.innerHTML = "";


    books.forEach(item => {


      const book = item.bookId;


      const card = document.createElement("article");
      card.classList.add("book-card");


      card.innerHTML = `
     
      <div class="cover">
        <img src="${book.coverImage || 'assets/book-placeholder.png'}">
      </div>


      <div class="info">
        <h2>${book.title}</h2>
        <p class="author">${book.author}</p>
      </div>


      <div class="actions">


        <button class="review">⭐ Add review</button>


        <select class="shelf-select" data-id="${item._id}">
          <option value="to-read">to read</option>
          <option value="reading" selected>currently reading</option>
          <option value="completed">read</option>
        </select>


        <button class="remove-btn" data-id="${item._id}">
          Remove
        </button>


      </div>
      `;


      container.appendChild(card);


    });


  } catch (error) {


    console.log("Error loading books:", error);


  }


}




// ===============================
// SEARCH
// ===============================
document.getElementById("searchInput").addEventListener("input", function () {


  const search = this.value.toLowerCase();


  const books = document.querySelectorAll(".book-card");


  books.forEach(book => {


    const title = book.querySelector("h2").textContent.toLowerCase();


    if (title.includes(search)) {
      book.style.display = "flex";
    } else {
      book.style.display = "none";
    }


  });


});




// ===============================
// CHANGE SHELF
// ===============================
document.addEventListener("change", async function(e){


  if(e.target.classList.contains("shelf-select")){


    const id = e.target.dataset.id;
    const status = e.target.value;


    await fetch(`http://localhost:8000/api/user/books/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({status})
    });


    loadBooks();


  }


});




// ===============================
// REMOVE BOOK
// ===============================
document.addEventListener("click", async function(e){


  if(e.target.classList.contains("remove-btn")){


    const id = e.target.dataset.id;


    await fetch(`http://localhost:8000/api/user/books/${id}`,{
      method:"DELETE",
      headers:{
        Authorization:`Bearer ${token}`
      }
    });


    loadBooks();


  }


});




// ===============================
// INITIAL LOAD
// ===============================
loadBooks();
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