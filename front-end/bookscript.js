// DROPDOWN
const toggle = document.getElementById("dropdownToggle");
const menu = document.getElementById("dropdownMenu");
const arrow = document.querySelector(".arrow");

toggle.onclick = () => {
  menu.style.display = menu.style.display === "block" ? "none" : "block";
  arrow.style.transform = menu.style.display === "block" ? "rotate(180deg)" : "rotate(0)";
};
document.querySelector('.buttons').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        alert(`You clicked: ${event.target.innerText}`);
    }
});
// BOOK CLICK / DOUBLE CLICK
document.querySelectorAll(".book").forEach(book => {
  let clickTimer;
 book.addEventListener("click", () => {
  window.location.href = "book-details.html";
  });
});