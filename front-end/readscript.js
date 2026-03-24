const token = localStorage.getItem("token");


async function loadReadBooks() {
  try {


    const response = await fetch(
      "http://localhost:8000/api/user/books?status=completed",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    const data = await response.json();


    displayBooks(data);


  } catch (error) {
    console.error("Error loading books:", error);
  }
}




// DISPLAY BOOKS
function displayBooks(books){


  const container = document.getElementById("readBooksContainer");


  container.innerHTML = "";


  books.forEach(item => {


    const book = item.bookId;


    const card = `
      <div class="book-card">


        <div class="cover">
          <img src="${book.coverImage || ''}" style="width:100%; height:100%; object-fit:cover; border-radius:18px;">
        </div>


        <div class="book-info">
          <h2>${book.title}</h2>
          <p class="author">${book.author}</p>
        </div>


        <div class="actions">
          <p class="date">Added on ${new Date(item.createdAt).toLocaleDateString()}</p>
        <button class="outline" onclick="removeBook('${item._id}')">
      Remove
    </button>
   
          </div>


      </div>
    `;


    container.innerHTML += card;


  });
  if (books.length === 0) {
  container.innerHTML = "<p>No books in your read pile yet.</p>";
  return;
}


}


loadReadBooks();
// ==========================
// YOUR SHELVES DROPDOWN
// ==========================


const dropdownToggle = document.getElementById("dropdownToggle");
const dropdownMenu = document.getElementById("dropdownMenu");
const arrow = document.querySelector(".arrow");


dropdownToggle.addEventListener("click", () => {


  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
    arrow.classList.remove("rotate");
  }
  else {
    dropdownMenu.style.display = "block";
    arrow.classList.add("rotate");
  }


});




// CLOSE DROPDOWN IF CLICK OUTSIDE
document.addEventListener("click", (e) => {


  if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {


    dropdownMenu.style.display = "none";
    arrow.classList.remove("rotate");


  }


});
async function removeBook(id){


  await fetch(`http://localhost:8000/api/user/books/${id}`,{
    method:"DELETE",
    headers:{
      Authorization:`Bearer ${token}`
    }
  });


  loadReadBooks();
}
const searchInput = document.getElementById("searchInput");


searchInput.addEventListener("input", function () {


  const query = this.value.toLowerCase();


  const books = document.querySelectorAll(".book-card");


  books.forEach(book => {


    const title = book.querySelector("h2").textContent.toLowerCase();


    if(title.includes(query)){
      book.style.display = "grid";
    } else {
      book.style.display = "none";
    }


  });


});
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