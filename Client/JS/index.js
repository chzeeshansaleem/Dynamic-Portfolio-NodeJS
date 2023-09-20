const redirct = JSON.parse(localStorage.getItem("user"));
const redirctadmin = localStorage.getItem("admin");
if (!redirct && !redirctadmin) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
} else if (redirct && redirctadmin) {
  const url = "http://127.0.0.1:5500/Client/HTML/PageNotFound.html";
  window.location.href = url;
} else if (redirctadmin) {
  const url = "http://127.0.0.1:5500/Client/HTML/adminUsers.html";
  window.location.href = url;
} else {
  window.innerHTML = "Page not found";
}
//import projectData from "../db/projects.json" assert { type: "json" };
// import username from "../db/user.json" assert { type: "json" };

//console.log(projectData);

// console.log(redirct);
// const name = document.getElementById("username");
// const uname = username.find((e) => e.email == redirct);
// if (name) {
//   name.textContent = uname.name;
// }
// console.log(uname.name);

const projectsContainer = document.querySelector(".projects");
const modal = document.querySelector(".modal");

const testData = async () =>
  await fetch("http://localhost:8000/projects")
    .then((res) => res.json())
    .then((projectData) => {
      projectData.forEach((project) => {
        if (project.username == redirct) {
          console.log(project.username);

          const projectRow = document.createElement("div");
          projectRow.classList.add("ProjectRow");
          const projectDetails = document.createElement("div");
          projectDetails.classList.add("projectDetails");
          const projectTitle = document.createElement("h3");
          projectTitle.textContent = project.title;
          const projectDescription = document.createElement("p");
          projectDescription.classList.add("details");
          if (project.description.length > 150) {
            projectDescription.textContent =
              project.description.slice(0, 150) + "...";
          } else {
            projectDescription.textContent = project.description;
          }
          projectDescription.onclick = modalProject;

          const projectBtn = document.createElement("div");
          projectBtn.classList.add("projectBtn");
          const probtn1 = document.createElement("div");
          probtn1.classList.add("proBtn1");
          const probtn2 = document.createElement("div");
          probtn2.classList.add("proBtn1");
          const liveBtn = document.createElement("button");
          liveBtn.classList.add("liveBtn");
          liveBtn.textContent = "Details";
          const projectImg = document.createElement("div");
          projectImg.classList.add("projectImg");
          projectImg.style.backgroundImage = `url(${project.img})`;
          // sirf see live per click kr k
          function modalProject() {
            modal.style.display = "block";

            const modalPic = document.querySelector(".modalPic");
            modalPic.style.backgroundImage = `url(${project.img})`;

            const modalDetails = document.querySelector(".modalDetails");
            modalDetails.innerHTML = "";

            const protitle = document.createElement("h3");
            protitle.textContent = project.title;

            const description = document.createElement("p");
            description.textContent = project.description;

            const tech = document.createElement("p");
            tech.textContent = "Technologies:";
            tech.style.fontWeight = "bold";
            const lang = document.createElement("p");
            lang.textContent = "Languages:";
            lang.style.fontWeight = "bold";
            const tagsHeading = document.createElement("p");
            tagsHeading.textContent = "Tags";
            tagsHeading.style.fontWeight = "bold";
            const tagsUl = document.createElement("ul");
            tagsUl.style.display = "flex";
            const Technologies = document.createElement("ul");
            Technologies.style.display = "flex";
            Technologies.style.justifyContent = "space-around";
            const languageUl = document.createElement("ul");
            languageUl.style.display = "flex";
            languageUl.style.justifyContent = "space-around";
            for (let i = 0; i < project.technology.length; i++) {
              const li = document.createElement("li");
              li.textContent = project.technology[i];
              // li.style.listStyle = "none";
              Technologies.appendChild(li);
            }
            for (let i = 0; i < project.tags.length; i++) {
              const li = document.createElement("li");
              li.style.listStyle = "none";
              li.textContent = project.tags[i];
              tagsUl.appendChild(li);
            }
            for (let i = 0; i < project.languages.length; i++) {
              const li = document.createElement("li");
              li.textContent = project.languages[i];
              languageUl.appendChild(li);
            }
            // Technologies.textContent = "technologies:" + project.technology;

            modalDetails.appendChild(protitle);
            modalDetails.appendChild(description);
            modalDetails.appendChild(tagsUl);
            modalDetails.appendChild(tech);
            modalDetails.appendChild(Technologies);
            modalDetails.appendChild(lang);
            modalDetails.appendChild(languageUl);
          }
          liveBtn.onclick = modalProject;

          const cross = document.getElementById("cross");
          if (cross) {
            cross.onclick = () => {
              modal.style.display = "none";
            };
          }
          const sourceBtn = document.createElement("a");
          sourceBtn.href = "#";
          sourceBtn.classList.add("sourceBtn");
          sourceBtn.textContent = "Source Code";

          projectBtn.appendChild(liveBtn);
          projectBtn.appendChild(sourceBtn);

          projectDetails.appendChild(projectTitle);
          projectDetails.appendChild(projectDescription);
          projectDetails.appendChild(projectBtn);

          projectRow.appendChild(projectDetails);
          projectRow.appendChild(projectImg);
          if (projectsContainer) {
            projectsContainer.appendChild(projectRow);
          }
        }
      });
    });
testData();
const logoutbtn = document.getElementById("logout");
export default function logout(e) {
  e.preventDefault();
  localStorage.removeItem("user");
  localStorage.removeItem("admin");
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}
// Logout button for admin and user
if (logoutbtn) {
  logoutbtn.onclick = logout;
}
