console.log("Explore page loaded");


const searchInput = document.getElementById("searchInput");
const container = document.getElementById("exploreBooksContainer");




// ============================
// DISPLAY BOOKS
// ============================
function displayBooks(books){


  container.innerHTML = "";


  books.forEach(book => {


    const title = book.title;
    const author = book.author;
    const cover = book.coverImage || "assets/nocover.png";


    const card = document.createElement("div");
    card.className = "book-card";


    card.innerHTML = `
      <div class="cover">
        <img src="${cover}" style="width:100%; height:100%; object-fit:cover;">
      </div>


      <div class="info">
        <h2>${title}</h2>
        <p class="author">${author}</p>


        <select class="shelfSelect">
          <option value="">Add to shelf</option>
          <option value="to-read">To Read</option>
          <option value="reading">Currently Reading</option>
          <option value="completed">Read</option>
        </select>
      </div>
    `;


    const select = card.querySelector(".shelfSelect");


    select.addEventListener("change", () => {
      addToShelf(book, select.value);
    });


    container.appendChild(card);


  });


}




// ============================
// SEARCH BOOKS (YOUR BACKEND)
// ============================
async function searchBooks(query){


  try{


    const response = await fetch(
      `http://localhost:8000/api/search-books?q=${query}`
    );


    const books = await response.json();


    displayBooks(books);


  }catch(err){
    console.error("Search error:", err);
  }


}




// ============================
// LOAD TRENDING BOOKS
// ============================
async function loadTrending(){


  try{


    const res = await fetch("https://openlibrary.org/search.json?q=bestseller");


    const data = await res.json();


    const books = data.docs.slice(0,12).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name[0] : "Unknown",
      coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null
    }));


    displayBooks(books);


  }catch(err){
    console.error("Trending books error:", err);
  }


}




// ============================
// ADD BOOK TO DATABASE
// ============================
async function addToShelf(book, status){


  if(!status) return;


  const token = localStorage.getItem("token");


  try{


    const bookResponse = await fetch(
      "http://localhost:8000/api/books",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
        })
      }
    );


    const savedBook = await bookResponse.json();


    await fetch(
      "http://localhost:8000/api/user/books",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          bookId: savedBook._id,
          status: status
        })
      }
    );


    alert("Book added to shelf!");


  }catch(err){
    console.error("Add book error:", err);
  }


}




// ============================
// SEARCH INPUT
// ============================
searchInput.addEventListener("input",(e)=>{


  const query = e.target.value.trim();


  if(query.length < 2){
    loadTrending();
    return;
  }


  searchBooks(query);


});




// ============================
// INITIAL PAGE LOAD
// ============================
loadTrending();
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