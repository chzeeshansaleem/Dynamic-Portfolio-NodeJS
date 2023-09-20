const redirct = localStorage.getItem("user");
const redirctadmin = localStorage.getItem("admin");
if (redirct) {
  const url = "http://127.0.0.1:5500/Client/HTML/index.html";
  const url2 = "http://127.0.0.1:5500/Client/HTML/userProfile.html";
  const url3 = "http://127.0.0.1:5500/Client/HTML/userProjects.html";
  window.location.href = url || url2 || url3;
} else if (redirctadmin) {
  const url = "http://127.0.0.1:5500/Client/HTML/adminUsers.html";
  const url2 = "http://127.0.0.1:5500/Client/HTML/adminProject.html";
  window.location.href = url || url2;
}

async function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = {
    name,
    email,
    password,
    role: "user",
  };

  try {
    const res = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user), // Convert user object to JSON
    });
    if (res.status === 204) {
      alert("fields are empty");
      emprtyFields();
      return;
    } else if (res.status === 200) {
      alert("User signed up successfully");
      const url = "http://127.0.0.1:5500/Client/HTML/login.html";
      window.location.href = url;
    } else if (res.status === 400) {
      alert("User Already Registered");
      emprtyFields();
    } else {
      alert("Error ha signup ma");
      emprtyFields();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during signup");
  }
  // //input fields empty k liyeh
  function emprtyFields() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }
}

const signupForm = document.getElementById("signupform");
signupForm.addEventListener("submit", handleSignup);
