const params = new URLSearchParams(window.location.search);
const token = params.get("token");


async function resetPassword(){


const password = document.getElementById("password").value;


if(!password){
alert("Please enter a new password");
return;
}


try{


const response = await fetch(
`http://localhost:8000/reset-password/${token}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({ password })
}
);


const data = await response.json();


document.getElementById("message").innerText = data.message;


}catch(error){


console.error("Reset error:", error);
alert("Server error");


}


}