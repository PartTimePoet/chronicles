// DROPDOWN
const toggle = document.getElementById("dropdownToggle");
const menu = document.getElementById("dropdownMenu");
const arrow = document.querySelector(".arrow");

toggle.onclick = () => {
  menu.style.display = menu.style.display === "block" ? "none" : "block";
  arrow.style.transform = menu.style.display === "block" ? "rotate(180deg)" : "rotate(0)";
};

// DROPDOWN
const toggle2 = document.getElementById("dropdownToggle2");
const menu2 = document.getElementById("dropdownMenu2");
const arrow2 = document.querySelector(".arrow2");

toggle2.onclick = () => {
  menu2.style.display = menu2.style.display === "block" ? "none" : "block";
  arrow2.style.transform = menu2.style.display === "block" ? "rotate(180deg)" : "rotate(0)";
};

document.querySelectorAll(".sort-menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".sort-menu button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    sortMenu.style.display = "none";
  });
});