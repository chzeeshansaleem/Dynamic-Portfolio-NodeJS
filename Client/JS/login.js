import users from "../db/user.json" assert { type: "json" };
// functions
//var users = JSON.parse(localStorage.getItem("users")) || [];
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
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginemail").value;
  const password = document.getElementById("loginpassword").value;
  const user1 = {
    email,
    password,
  };

  try {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user1), // Convert user object to JSON
    });
    const result = await res.json();
    // console.log(result);

    if (res.status === 200) {
      alert("User Login successfully");
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.token));
      const url = "http://127.0.0.1:5500/Client/HTML/index.html";
      window.location.href = url;
    } else if (res.status === 222) {
      alert("Admin Login successfully");
      localStorage.setItem("admin", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.token));

      const url = "http://127.0.0.1:5500/Client/HTML/adminUsers.html";
      window.location.href = url;
    } else if (res.status === 204) {
      alert("Email and password Required");
    } else if (res.status === 400) {
      alert("This user not Found");
    } else if (res.status === 401) {
      alert("invailed Password or email");
    } else {
      alert("Error ha login ma");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during login");
  }

  // else {
  //   if (user) {
  // if (user1.role === "admin") {
  //   alert(" ADMIN LOGIN SUCCESSFUL");
  //   localStorage.setItem("admin", JSON.stringify(user1.token));
  //   console.log(user1);

  //   const url = "http://127.0.0.1:5500/Client/HTML/adminUsers.html";
  //   window.location.href = url;
  // } else {
  //   alert("USER LOGIN SUCCESSFUL");
  //   console.log(user1);

  // }
}
const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", handleLogin);
