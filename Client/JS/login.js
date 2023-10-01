const redirct = localStorage.getItem("user");
const redirctadmin = localStorage.getItem("admin");
const tokenRedirect = localStorage.getItem("token");
const AdmintokenRedirect = localStorage.getItem("Admintoken");
if (tokenRedirect) {
  const url = "http://127.0.0.1:5500/Client/HTML/index.html";
  const url2 = "http://127.0.0.1:5500/Client/HTML/userProfile.html";
  const url3 = "http://127.0.0.1:5500/Client/HTML/userProjects.html";
  window.location.href = url || url2 || url3;
} else if (AdmintokenRedirect) {
  const url = "http://127.0.0.1:5500/Client/HTML/adminUsers.html";
  const url2 = "http://127.0.0.1:5500/Client/HTML/adminProject.html";
  window.location.href = url || url2;
}
function ValidationInputByRegex(inputElement, regex) {
  inputElement.addEventListener("input", function (event) {
    const inputValue = event.target.value;

    if (regex.test(inputValue)) {
      event.target.value = inputValue.replace(regex, "");
    }
  });
}
function setLocalStorageWithExpiry(key, value, minutes) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + minutes * 60000, // Convert minutes to milliseconds
  };
  localStorage.setItem(key, JSON.stringify(item));
}

const emailInput = document.getElementById("loginemail");
const emailRegex = /[^a-zA-Z0-9@._-]/g;
ValidationInputByRegex(emailInput, emailRegex);

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginemail").value;
  const password = document.getElementById("loginpassword").value;
  const user1 = {
    email,
    password,
  };

  if (email === "" && password === "") {
    alert("all fields are required");
    return;
  }
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
      setLocalStorageWithExpiry("token", result.token, 30);
      const url = "http://127.0.0.1:5500/Client/HTML/index.html";
      window.location.href = url;
    } else if (res.status === 222) {
      alert("Admin Login successfully");
      setLocalStorageWithExpiry("Admintoken", result.Admintoken, 30);
      localStorage.setItem("admin", JSON.stringify(result.user));

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
}
const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", handleLogin);
