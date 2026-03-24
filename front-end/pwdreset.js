async function sendResetEmail() {


const email = document.getElementById("email").value.trim();


if (!email) {
alert("Please enter your email");
return;
}


try {


const response = await fetch("http://localhost:8000/forgot-password", {


method: "POST",


headers: {
"Content-Type": "application/json"
},


body: JSON.stringify({ email })


});


const data = await response.json();


alert(data.message);


} catch (error) {


console.error("Reset request error:", error);
alert("Server error. Please try again.");


}


}