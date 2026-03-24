document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();


  // Get values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const repeatEmail = document.getElementById("repeatEmail").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const repeatPassword = document.getElementById("repeatPassword").value.trim();


  // Validation
  if (email !== repeatEmail) {
    alert("Emails do not match");
    return;
  }


  if (password !== repeatPassword) {
    alert("Passwords do not match");
    return;
  }


  try {
    const response = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName,
        email,
        username,
        password
      })
    });


    const data = await response.json();


    if (response.ok) {
      alert(data.message);
      window.location.href = "login.html";
    } else {
      alert(data.message);
      console.error("Backend error:", data);
    }


  } catch (error) {
    console.error("Network error:", error);
    alert("Network error. Is backend running?");
  }
});