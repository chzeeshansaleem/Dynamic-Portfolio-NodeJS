import logout from "../JS/index.js";

const redirct = localStorage.getItem("user");
if (!redirct) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}
var base64String;
var reader;
const user1 = JSON.parse(localStorage.getItem("user"));
// validation func
function ValidationInputByRegex(inputElement, regex) {
  inputElement.addEventListener("input", function (event) {
    const inputValue = event.target.value;

    if (regex.test(inputValue)) {
      event.target.value = inputValue.replace(regex, "");
    }
  });
}
// delete project
async function deleteUserProject(projectId) {
  try {
    const response = await fetch(
      `http://localhost:8000/projects/${projectId}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      // Project deleted successfully
      alert("Project deleted successfully");
      userpro();
    } else if (response.status === 404) {
      // Project not found
      alert("Project not found");
      userpro();
    } else {
      // Handle other possible error cases
      console.error("Error deleting project:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
const searchInput = document.getElementById("searchInput");
const searchInputRegex = /[^a-zA-Z0-9\s,_#-]/g;
ValidationInputByRegex(searchInput, searchInputRegex);
async function userpro() {
  const userProjectsContainer = document.querySelector(".usersprojects");
  userProjectsContainer.innerHTML = "";
  const userModal = document.querySelector(".modalmodal");
  const userModalDetails = document.querySelector(".usermodalDetails");
  const filter = searchInput.value.trim().toUpperCase();
  await fetch("http://localhost:8000/projects")
    .then((res) => res.json())
    .then((userProjectData) => {
      console.log(userProjectData);

      console.log(searchInput.value);
      //console.log("filter: " + filter);
      userProjectData.forEach((project) => {
        let languagesMatch = false;
        let technologiesMatch = false;
        let tagsMatch = false;
        for (let k = 0; k < project.languages.length; k++) {
          const language = project.languages[k].toUpperCase();
          if (language.includes(filter)) {
            languagesMatch = true;
            break;
          }
        }
        for (let k = 0; k < project.technology.length; k++) {
          const technology = project.technology[k].toUpperCase();
          if (technology.includes(filter)) {
            technologiesMatch = true;
            break;
          }
        }

        for (let k = 0; k < project.tags.length; k++) {
          const technology = project.tags[k].toUpperCase();
          if (technology.includes(filter)) {
            tagsMatch = true;
            break;
          }
        }
        const matchesSearchCriteria =
          (!filter ||
            project.title.toUpperCase().includes(filter) ||
            project.description.toUpperCase().includes(filter) ||
            languagesMatch ||
            tagsMatch ||
            technologiesMatch) &&
          user1.email === project.username;

        if (matchesSearchCriteria) {
          const userProjectRow = document.createElement("div");
          userProjectRow.classList.add("userProjectRow");
          const userProjectDetails = document.createElement("div");
          userProjectDetails.classList.add("userProjectDetails");
          const userProjectTitle = document.createElement("h3");
          userProjectTitle.textContent = project.title;
          const userProjectDescription = document.createElement("p");
          userProjectDescription.classList.add("userDetails");
          if (project.description.length > 100) {
            userProjectDescription.textContent =
              project.description.slice(0, 150) + "...";
          } else {
            userProjectDescription.textContent = project.description;
          }

          const userProjectBtn = document.createElement("div");
          userProjectBtn.classList.add("userProjectBtn");
          const UserEditProject = document.createElement("button");
          UserEditProject.classList.add("userliveBtn");
          UserEditProject.textContent = "Edit Project";
          const userProjectImg = document.createElement("div");
          userProjectImg.classList.add("userProjectImg");

          const imageFormat = "jpg" || "png" || "jpeg";
          userProjectImg.style.backgroundImage = `url(data:image/${imageFormat};base64,${project.img})`;

          // Only open modal when "Edit Project" is clicked
          const editProjectModal = document.querySelector(".editProjectModal");
          UserEditProject.onclick = function () {
            editProjectModal.style.display = "block";
            editProjectModal.innerHTML = "";
            const editform = document.createElement("form");
            const editTable = document.createElement("table");
            editTable.style.width = "90%";
            const editrow1 = document.createElement("tr");
            const editrow2 = document.createElement("tr");
            const editrow3 = document.createElement("tr");
            const editrow4 = document.createElement("tr");
            const editrow5 = document.createElement("tr");
            const editrow6 = document.createElement("tr");
            const editrow7 = document.createElement("tr");

            const editdata11 = document.createElement("td");
            const editdata12 = document.createElement("td");
            const editdata121 = document.createElement("input");
            const editdata121Regex = /[^a-zA-Z0-9\s_#-]/g;
            ValidationInputByRegex(editdata121, editdata121Regex);
            const editdata21 = document.createElement("td");
            const editdata22 = document.createElement("td");
            const editdata221 = document.createElement("textarea");
            const editdata221Regex = /[^a-zA-Z0-9\s.,_#-]/g;
            ValidationInputByRegex(editdata221, editdata221Regex);
            const editdata31 = document.createElement("td");
            const editdata32 = document.createElement("td");
            const editdata321 = document.createElement("input");
            const fileNameInput = document.createElement("input");
            const type = "png" || "jpg" || "jpeg";
            fileNameInput.value = atob(
              `data:image/${type};base64,${project.img}`
            );
            fileNameInput.id = "file-name";
            fileNameInput.readOnly = "true";
            editdata321.type = "file";

            editdata321.addEventListener("change", (event) => {
              const selectedFiles = event.target.files;

              for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                if (file) {
                  reader = new FileReader();

                  reader.onload = (fileEvent) => {
                    base64String = btoa(fileEvent.target.result);
                    console.log(base64String);
                  };

                  reader.readAsBinaryString(file);
                }
              }
            });
            const editdata41 = document.createElement("td");
            const editdata42 = document.createElement("td");
            const editdata421 = document.createElement("textarea");
            const editdata421Regex = /[^a-zA-Z0-9\s,_#-]/g;
            ValidationInputByRegex(editdata421, editdata421Regex);
            const editdata51 = document.createElement("td");
            const editdata52 = document.createElement("td");
            const editdata521 = document.createElement("textarea");
            ValidationInputByRegex(editdata521, editdata421Regex);
            const editdata61 = document.createElement("td");
            const editdata62 = document.createElement("td");
            const editdata621 = document.createElement("textarea");
            ValidationInputByRegex(editdata621, editdata421Regex);
            const editdata71 = document.createElement("td");
            const editdata72 = document.createElement("td");
            const savebtn = document.createElement("button");

            savebtn.textContent = "Save";
            savebtn.type = "submit";
            const cancelbtn = document.createElement("button");
            cancelbtn.textContent = "cancel ";
            editdata11.textContent = "Project Title:";
            editdata121.value = project.title;
            editdata21.textContent = "Project Description:";
            editdata221.value = project.description;
            editdata31.textContent = "image URL:";

            editdata321.addEventListener("change", function () {
              const file = editdata321.files[0];
              if (file) {
                fileNameInput.value = file.name;
              } else {
                fileNameInput.value = "";
              }
            });
            editdata41.textContent = "Tags:";
            editdata421.value = project.tags;
            editdata61.textContent = "Languages:";
            editdata621.value = project.languages;
            editdata51.textContent = "Technology:";
            editdata521.value = project.technology;
            editdata72.appendChild(cancelbtn);
            editdata71.appendChild(savebtn);

            editdata62.appendChild(editdata621);
            editdata52.appendChild(editdata521); //2nd td
            editdata42.appendChild(editdata421);
            editdata32.appendChild(editdata321);
            editdata32.appendChild(fileNameInput); //2nd td
            editdata22.appendChild(editdata221); //2nd td
            editdata12.appendChild(editdata121); //2nd td
            editrow1.appendChild(editdata11);
            editrow1.appendChild(editdata12);
            editrow2.appendChild(editdata21);
            editrow2.appendChild(editdata22);
            editrow3.appendChild(editdata31);
            editrow3.appendChild(editdata32);
            editrow4.appendChild(editdata41);
            editrow4.appendChild(editdata42);
            editrow5.appendChild(editdata51);
            editrow5.appendChild(editdata52);
            editrow6.appendChild(editdata61);
            editrow6.appendChild(editdata62);
            editrow7.appendChild(editdata71);
            editrow7.appendChild(editdata72);
            editTable.appendChild(editrow1);
            editTable.appendChild(editrow2);
            editTable.appendChild(editrow3);
            editTable.appendChild(editrow4);
            editTable.appendChild(editrow5);
            editTable.appendChild(editrow6);
            editTable.appendChild(editrow7);
            editform.appendChild(editTable);

            cancelbtn.onclick = function (e) {
              e.preventDefault();
              editProjectModal.style.display = "none";
            };
            //editform.appendChild(savebtn);
            editProjectModal.appendChild(editform);
            // editProjectModal.appendChild(cancelbtn);

            savebtn.onclick = async function (e) {
              e.preventDefault();
              const projectIndex = userProjectData.findIndex(
                (p) => p.projectId === project.projectId
              );

              console.log("after default edit project click submit");
              if (projectIndex !== -1) {
                userProjectData[projectIndex].username = user1.email;
                userProjectData[projectIndex].title = editdata121.value;
                userProjectData[projectIndex].description = editdata221.value;
                userProjectData[projectIndex].img = base64String;
                userProjectData[projectIndex].tags =
                  editdata421.value.split(",");
                userProjectData[projectIndex].languages =
                  editdata621.value.split(",");
                userProjectData[projectIndex].technology =
                  editdata521.value.split(",");
                console.log(userProjectData);

                //localStorage.setItem("allproject", JSON.stringify(userProjectData));

                try {
                  const updatedProject = userProjectData[projectIndex];
                  const res = await fetch(
                    `http://localhost:8000/projectUpdate/${project.projectId}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(updatedProject), // Convert user object to JSON
                    }
                  );

                  if (res.status === 200) {
                    alert("Project Updated successfully");
                    editProjectModal.style.display = "none";
                    userpro();
                    return;
                    userpro();
                  } else if (res.status === 204) {
                    alert("tags technology and languages required");
                  } else if (res.status === 400) {
                    alert("User not logged in");
                  } else if (res.status === 404) {
                    alert("User not found");
                  } else {
                    alert("Error ha Project added  ma");
                  }
                } catch (error) {
                  console.error("Error:", error);
                  alert("An error occurred during login");
                }
              }
            };
          };

          const deleteProject = document.createElement("button");
          //   userSourceBtn.href = "#";
          deleteProject.classList.add("usersourceBtn");
          deleteProject.textContent = "delete";
          deleteProject.onclick = async function (e) {
            e.preventDefault();
            deleteUserProject(project.projectId);
          };
          userProjectBtn.appendChild(UserEditProject);
          userProjectBtn.appendChild(deleteProject);

          userProjectDetails.appendChild(userProjectTitle);
          userProjectDetails.appendChild(userProjectDescription);
          userProjectDetails.appendChild(userProjectBtn);

          userProjectRow.appendChild(userProjectDetails);
          userProjectRow.appendChild(userProjectImg);

          if (userProjectsContainer) {
            userProjectsContainer.appendChild(userProjectRow);
          }
        }
      });
    });
}
searchInput.addEventListener("input", () => {
  if (searchInput.value !== "") {
    userpro();
  } else {
    userpro();
  }
});

userpro();
// add project function
const addProjectFunction = document.querySelector(".addProjectBtn");
addProjectFunction.onclick = (e) => {
  e.preventDefault();
  console.log("clicked addProject");
  const addProjectmodal = document.querySelector(".addprojectModal");
  addProjectmodal.style.display = "block";
  // addProjectmodal.style.width = "auto";
  addProjectmodal.innerHTML = "";
  const addform = document.createElement("form");

  addform.innerHTML = "";
  const addTable = document.createElement("table");
  addTable.style.width = "90%";
  const addrow1 = document.createElement("tr");
  const addrow2 = document.createElement("tr");
  const addrow3 = document.createElement("tr");
  const addrow4 = document.createElement("tr");
  const addrow5 = document.createElement("tr");
  const addrow6 = document.createElement("tr");
  const addrow7 = document.createElement("tr");
  const adddata11 = document.createElement("td");
  const adddata12 = document.createElement("td");
  const adddata121 = document.createElement("input");

  const adddata121Regex = /[^a-zA-Z0-9\s_,-]/g;
  ValidationInputByRegex(adddata121, adddata121Regex);

  const adddata21 = document.createElement("td");
  const adddata22 = document.createElement("td");
  const adddata221 = document.createElement("textarea");

  const adddata221Regex = /[^a-zA-Z0-9\s_,-]/g;
  ValidationInputByRegex(adddata221, adddata221Regex);
  adddata221.addEventListener("input", (e) => {
    const inputValue = e.target.value;
    const maxLength = 280;

    if (inputValue.length > maxLength) {
      e.target.value = inputValue.slice(0, maxLength);
    }
  });
  const adddata31 = document.createElement("td");
  const adddata32 = document.createElement("td");
  // file uploading
  const adddata321 = document.createElement("input");
  adddata321.type = "file";

  adddata321.addEventListener("change", (event) => {
    const selectedFiles = event.target.files;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (file) {
        reader = new FileReader();

        reader.onload = (fileEvent) => {
          base64String = btoa(fileEvent.target.result);
          console.log(base64String);
        };

        reader.readAsBinaryString(file);
      }
    }
  });

  const adddata41 = document.createElement("td");
  const adddata42 = document.createElement("td");
  const adddata421 = document.createElement("textarea");
  const adddata421Regex = /[^a-zA-Z0-9\s,#_-]/g;
  ValidationInputByRegex(adddata421, adddata421Regex);
  const adddata51 = document.createElement("td");
  const adddata52 = document.createElement("td");
  const adddata521 = document.createElement("textarea");
  const adddata521Regex = /[^a-zA-Z0-9\s,_#-]/g;
  ValidationInputByRegex(adddata521, adddata521Regex);
  const adddata61 = document.createElement("td");
  const adddata62 = document.createElement("td");
  const adddata621 = document.createElement("textarea");
  const adddata621Regex = /[^a-zA-Z0-9\s,_#-]/g;
  ValidationInputByRegex(adddata621, adddata621Regex);
  const adddata71 = document.createElement("td");
  const adddata72 = document.createElement("td");
  const adddata711 = document.createElement("button");
  adddata711.textContent = "Cancel";
  const savebtn = document.createElement("button");
  savebtn.textContent = "Save";
  savebtn.type = "submit";
  adddata72.appendChild(savebtn);
  adddata71.appendChild(adddata711);
  adddata11.textContent = "Project Title:";
  //   adddata121.value = user1.name;
  adddata21.textContent = "Project Description:";
  //   adddata221.value = user1.password;
  adddata31.textContent = "Project Img URL:";
  //   adddata321.value = user1.phoneNumber;
  adddata41.textContent = "Tags:";
  //   editdata421.value = user1.education;
  adddata51.textContent = "Languages:";
  //   editdata521.value = user1.skills;
  adddata61.textContent = "Technology:";
  //   editdata621.value = user1.experience;
  adddata62.appendChild(adddata621); //2nd td
  adddata52.appendChild(adddata521); //2nd td
  adddata42.appendChild(adddata421);
  adddata32.appendChild(adddata321); //2nd td
  adddata22.appendChild(adddata221); //2nd td
  adddata12.appendChild(adddata121); //2nd td
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
  addrow6.appendChild(adddata61);
  addrow6.appendChild(adddata62);
  addrow7.appendChild(adddata71);
  addrow7.appendChild(adddata72);
  addTable.appendChild(addrow1);
  addTable.appendChild(addrow2);
  addTable.appendChild(addrow3);
  addTable.appendChild(addrow4);
  addTable.appendChild(addrow5);
  addTable.appendChild(addrow6);
  addTable.appendChild(addrow7);
  addform.appendChild(addTable);

  // addform.appendChild(savebtn);

  addProjectmodal.appendChild(addform);

  // cancel btn
  adddata711.onclick = function (e) {
    e.preventDefault();
    addProjectmodal.style.display = "none";
  };
  savebtn.onclick = async function (e) {
    e.preventDefault();
    console.log("after default add project click submit");
    const addprojectDataForm = {
      username: user1.email,

      title: adddata121.value,
      description: adddata221.value,
      img: base64String,
      tags: adddata421.value.split(","),
      languages: adddata521.value.split(","),
      technology: adddata621.value.split(","),
    };

    try {
      const res = await fetch("http://localhost:8000/userAddProjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addprojectDataForm), // Convert user object to JSON
      });

      if (res.status === 200) {
        alert("Project Added successfully");
        addProjectmodal.style.display = "none";
        userpro();
      } else if (res.status === 204) {
        alert("img title and description required");
      } else if (res.status === 400) {
        alert("User not logged in");
      } else {
        alert("Error ha Project added  ma");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login");
    }
  };

  const modalOpen = document.querySelector("#appProjectCross");
  if (modalOpen) {
    // userpro();
    modalOpen.onclick = () => {
      console.log("clicked addProjectCross");
      addProjectmodal.style.display = "none";
    };
  }
};

// Logout button for admin and user
const logoutbtn = document.getElementById("logout");
if (logoutbtn) {
  logoutbtn.onclick = logout;
}
