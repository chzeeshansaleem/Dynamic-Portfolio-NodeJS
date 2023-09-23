//import jsonfile from "../db/user.json" assert { type: "json" };
//console.log(jsonfile);
import userProjectData from "../db/projects.json" assert { type: "json" };
console.log(userProjectData);
import logoutAdmin from "../JS/AdminViewProjects.js";
const redirct = localStorage.getItem("admin");
if (!redirct) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}

// delete project
async function deleteUserProject(usermail) {
  console.log("delete Project Clicked by admin");

  const res = await fetch(`http://localhost:8000/deleteUsers/${usermail}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    alert("Project Not deleted");
    usershow();
  } else {
    alert("Project deleted");
    usershow();
  }
}
const adminuser = document.querySelector(".adminUser");
function deleteUser(useremail) {
  const index = users.findIndex((user) => user.email === useremail);
  if (index !== -1) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
  }
}
const adminTable = document.createElement("table");
adminTable.setAttribute("id", "myTable");
const AdminEditUserRole = document.querySelector(".AdminEditUserRole");
async function usershow() {
  if (adminuser) {
    adminTable.innerHTML = "";

    const adminTableHeader = document.createElement("tr");
    const adminTableHeadName = document.createElement("th");
    adminTableHeadName.textContent = "Name";
    const adminTableHeadEmail = document.createElement("th");
    adminTableHeadEmail.textContent = "Email";
    const adminTableHeadRole = document.createElement("th");
    adminTableHeadRole.textContent = "Role";
    const adminTableHeadActions = document.createElement("th");
    adminTableHeadActions.colSpan = "2";
    adminTableHeadActions.textContent = "Actions";

    adminTableHeader.appendChild(adminTableHeadName);
    adminTableHeader.appendChild(adminTableHeadEmail);
    adminTableHeader.appendChild(adminTableHeadRole);
    adminTableHeader.appendChild(adminTableHeadActions);
    adminTable.appendChild(adminTableHeader);

    const currentAdminEmail = JSON.parse(localStorage.getItem("admin"));

    try {
      const res = await fetch("http://localhost:8000/adminUsers");
      const jsonfile = await res.json();
      console.log(jsonfile);

      jsonfile.forEach((user) => {
        if (
          user.role === "user" ||
          (user.role === "admin" && user.email !== currentAdminEmail.email)
        ) {
          const adminTableRow = document.createElement("tr");
          const adminTableRowTdName = document.createElement("td");
          adminTableRowTdName.textContent = user.name;
          const adminTableRowTdEmail = document.createElement("td");
          const adminTableRowTdRole = document.createElement("td");
          adminTableRowTdRole.textContent = user.role;
          adminTableRowTdEmail.textContent = user.email;
          const adminTableRowTdAction = document.createElement("td");
          const adminTableRowTdAction2 = document.createElement("td");
          const adminEdit = document.createElement("button");
          adminEdit.textContent = "Edit Role";
          adminTableRowTdAction2.appendChild(adminEdit);
          const adminAction = document.createElement("button");
          adminAction.textContent = "Delete";
          adminAction.style.background = "red";

          adminTableRowTdAction.appendChild(adminAction);
          adminTableRow.appendChild(adminTableRowTdName);
          adminTableRow.appendChild(adminTableRowTdEmail);
          adminTableRow.appendChild(adminTableRowTdRole);

          adminTableRow.appendChild(adminTableRowTdAction2);

          adminTableRow.appendChild(adminTableRowTdAction);

          adminTable.appendChild(adminTableRow);
          // Edit Button
          adminEdit.onclick = function () {
            AdminEditUserRole.style.display = "block";
            AdminEditUserRole.innerHTML = "";
            const addform = document.createElement("form");
            //   addform.innerHTML = "";
            const addTable = document.createElement("table");
            const addrow3 = document.createElement("tr");
            const addrow5 = document.createElement("tr");
            const adddata31 = document.createElement("td");
            const adddata51 = document.createElement("td");
            const adddata52 = document.createElement("td");
            const cancelAddUser = document.createElement("button");
            cancelAddUser.textContent = "Cancel";
            const saveEditbtn = document.createElement("button");
            saveEditbtn.textContent = "Save";
            adddata31.textContent = "Role";
            const adddata32 = document.createElement("td");
            const userRadio = document.createElement("select");
            const userCurrentRole = document.createElement("option");
            userCurrentRole.textContent = user.role;
            userCurrentRole.value = user.role;
            userCurrentRole.selected = true;
            const userSelect = document.createElement("option");
            userSelect.textContent = "user";
            userSelect.value = "user";
            const adminSelect = document.createElement("option");
            adminSelect.textContent = "admin";
            adminSelect.value = "admin";
            userRadio.onclick = () => {
              userCurrentRole.style.display = "none";
            };

            console.log(userRadio.value);
            adddata52.appendChild(saveEditbtn);
            adddata51.appendChild(cancelAddUser);
            userRadio.appendChild(userCurrentRole);
            userRadio.appendChild(userSelect);
            userRadio.appendChild(adminSelect);
            adddata32.appendChild(userRadio);
            addrow3.appendChild(adddata31);
            addrow3.appendChild(adddata32);
            addrow5.appendChild(adddata51);
            addrow5.appendChild(adddata52);
            addTable.appendChild(addrow3);
            addTable.appendChild(addrow5);
            addform.appendChild(addTable);
            AdminEditUserRole.appendChild(addform);
            //admin modal cancel ka btn
            cancelAddUser.onclick = function (e) {
              e.preventDefault();
              AdminEditUserRole.style.display = "none";
            };
            // edit data ko save ka btn
            saveEditbtn.onclick = function (e) {
              e.preventDefault();
              const selectedRole = {
                role: userRadio.value,
              };

              editRole(user.email, selectedRole);
              AdminEditUserRole.style.display = "none";
            };
          };
          // delete user ya admin button
          adminAction.onclick = function (e) {
            e.preventDefault();
            deleteUserProject(user.email);
          };
        }
      });
    } catch (error) {}
    adminuser.appendChild(adminTable);
  }
}

usershow();
const AdminAddUser = document.querySelector(".AdminAddUser");
const AdminAddUserBtn = document.querySelector(".AdminAddUserBtn");
// Add new user btn
AdminAddUserBtn.onclick = function () {
  AdminAddUser.style.display = "block";
  AdminAddUser.style.height = "auto";

  const adminCross = document.querySelector("adminCross");
  AdminAddUser.innerHTML = "";
  const addform = document.createElement("form");
  //   addform.innerHTML = "";
  const addTable = document.createElement("table");
  const addrow1 = document.createElement("tr");
  const addrow2 = document.createElement("tr");
  const addrow3 = document.createElement("tr");
  const addrow4 = document.createElement("tr");
  const addrow5 = document.createElement("tr");

  const adddata11 = document.createElement("td");
  const adddata12 = document.createElement("td");
  const adddata121 = document.createElement("input");
  adddata121.setAttribute("type", "email");

  const adddata21 = document.createElement("td");
  const adddata22 = document.createElement("td");
  const adddata221 = document.createElement("input");
  adddata221.setAttribute("type", "password");
  const adddata31 = document.createElement("td");
  const adddata32 = document.createElement("td");
  const userRadio = document.createElement("select");
  const choose = document.createElement("option");
  choose.textContent = "choose";
  choose.value = "choose";
  choose.selected = true;
  choose.disabled = true;
  const userSelect = document.createElement("option");
  userSelect.textContent = "user";
  userSelect.value = "user";
  const adminSelect = document.createElement("option");
  adminSelect.textContent = "admin";
  adminSelect.value = "admin";
  const adddata51 = document.createElement("td");
  const adddata52 = document.createElement("td");
  const cancelAddUser = document.createElement("button");
  userRadio.appendChild(choose);
  userRadio.appendChild(userSelect);
  userRadio.appendChild(adminSelect);

  const adddata41 = document.createElement("td");
  const adddata42 = document.createElement("td");
  const adddata421 = document.createElement("input");
  adddata421.addEventListener("input", function (event) {
    const inputValue = event.target.value;
    const regex = /[^a-zA-Z\s]/;
    if (regex.test(inputValue)) {
      event.target.value = inputValue.replace(/[^a-zA-Z\s,]/, "");
    }
  });
  const savebtn = document.createElement("button");
  savebtn.textContent = "Save";
  savebtn.type = "submit";
  adddata11.textContent = "Email:";
  adddata21.textContent = "Password:";
  adddata31.textContent = "Role:";
  adddata41.textContent = "Name:";
  cancelAddUser.textContent = "Cancel";
  adddata52.appendChild(savebtn);
  adddata51.appendChild(cancelAddUser);
  adddata42.appendChild(adddata421);

  adddata32.appendChild(userRadio);
  //   adddata32.appendChild(userlable);
  //   adddata32.appendChild(adminRadio); //2nd td
  //   adddata32.appendChild(adminlable);

  //2nd td
  adddata22.appendChild(adddata221); //2nd td
  adddata12.appendChild(adddata121);
  addrow1.appendChild(adddata11);
  addrow1.appendChild(adddata12);
  addrow2.appendChild(adddata21);
  addrow2.appendChild(adddata22);
  addrow3.appendChild(adddata31);
  addrow3.appendChild(adddata32);
  addrow4.appendChild(adddata41);
  addrow4.appendChild(adddata42);
  addrow5.appendChild(adddata51);
  addrow5.appendChild(adddata52);
  addTable.appendChild(addrow1);
  addTable.appendChild(addrow2);
  addTable.appendChild(addrow3);
  addTable.appendChild(addrow4);
  addTable.appendChild(addrow5);
  addform.appendChild(addTable);

  AdminAddUser.appendChild(addform);

  savebtn.onclick = async function (e) {
    e.preventDefault();
    const selectedRole = userRadio.value;
    console.log("after default add project click submit");
    try {
      const adduserDataForm = {
        email: adddata121.value,
        password: adddata221.value,
        role: selectedRole,
        name: adddata421.value,
        phoneNumber: "",
        skills: [],
      };

      if (
        adddata121.value.trim() == "" ||
        adddata221.value.trim() == "" ||
        selectedRole.trim() == "choose"
      ) {
        alert("name,email,password and role  is required");
        return;
      }
      const res = await fetch("http://localhost:8000/add_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adduserDataForm),
      });

      // const user = jsonfile.find((user) => user.email === adddata121.value);
      if (res.status === 400) {
        alert("this email already exist");
        return;
      } else if (res.ok) {
        alert("user added successfully");
      } else {
        alert("error fron backend");
      }
    } catch (error) {
      console.log(error);
    }
    // jsonfile.unshift(adduserDataForm);
    // localStorage.setItem("users", JSON.stringify(jsonfile));

    AdminAddUser.style.display = "none";
    adminTable.innerHTML = "";
    usershow();
  };
  // Close Modal
  cancelAddUser.onclick = function () {
    AdminAddUser.style.display = "none";
  };
};
async function editRole(userEmail, newRole) {
  try {
    const res = await fetch(`http://localhost:8000/adminUsers/${userEmail}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newRole),
    });
    if (!res.ok) {
      alert("kuch tou garh barh ha ");
    } else {
      alert("user role successfully change");
    }
  } catch (error) {
    console.log(error);
  }
  usershow();
}

//Search Bar
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", SearchSuggestion);
}
async function SearchSuggestion() {
  try {
    const res = await fetch("http://localhost:8000/adminUsers");
    const jsonfile = await res.json();
    console.log(jsonfile);
    const filter = document.getElementById("searchInput").value.toLowerCase();
    let myTable = document.getElementById("myTable");
    let tr = myTable.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
      let email = jsonfile[i].email.toLowerCase();
      let name = jsonfile[i].name.toLowerCase();
      let phoneNumber = jsonfile[i].phoneNumber.toLowerCase();

      if (
        email.includes(filter) ||
        name.includes(filter) ||
        phoneNumber.includes(filter)
      ) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  } catch (error) {}
}

const logoutbtn = document.getElementById("logout");

// Logout button for admin and user
if (logoutbtn) {
  logoutbtn.onclick = logoutAdmin;
}
