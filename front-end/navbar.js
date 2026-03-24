// ==========================
// PROFILE MENU TOGGLE
// ==========================


const profileIcon = document.querySelector(".profile-icon");
const profileMenu = document.querySelector(".profile-menu");


if (profileIcon && profileMenu) {


  profileIcon.addEventListener("click", () => {


    profileMenu.style.display =
      profileMenu.style.display === "block" ? "none" : "block";


  });


}




// ==========================
// LOGOUT
// ==========================


const logoutBtn = document.querySelector(".logout-btn");


if (logoutBtn) {


  logoutBtn.addEventListener("click", () => {


    localStorage.removeItem("token");


    window.location.href = "login.html";


  });


}