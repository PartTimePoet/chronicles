const form = document.getElementById("loginForm");


form.addEventListener("submit", async (e) => {
  e.preventDefault();


  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;


  try {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });


    const data = await res.json();


    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }


    localStorage.setItem("token", data.token);


    alert("Login successful!");


    window.location.href = "dashboard.html";


  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});