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
const nameInput = document.getElementById("name");
const nameRegex = /[^a-zA-Z\s]/g;
ValidationInputByRegex(nameInput, nameRegex);
const emailInput = document.getElementById("email");
const emailRegex = /[^a-zA-Z0-9@._-]/g;
ValidationInputByRegex(emailInput, emailRegex);
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
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (name === "" || email === "" || password === "") {
    alert("Please enter all required fields");
  } else if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
  } else {
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user), // Convert user object to JSON
      });
      console.log(res.status);
      if (!res.status === 402) {
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
