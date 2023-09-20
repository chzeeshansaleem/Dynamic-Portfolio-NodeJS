//import projectData from "../db/projects.json" assert { type: "json" };

//console.log(projectData);
const redirctadmin = localStorage.getItem("admin");
if (!redirctadmin) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}
var deta = null;
const test1Data = async () =>
  await fetch("http://localhost:8000/projects")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

test1Data();

console.log(deta);
const projectsContainer = document.querySelector(".projects");
const modal = document.querySelector(".modal");
const testData = async () =>
  await fetch("http://localhost:8000/projects")
    .then((res) => res.json())
    .then((projectData) => {
      {
        projectData.forEach((project) => {
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
            console.log(project.description);
            projectDescription.textContent = project.description;
          }

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
              Technologies.appendChild(li);
            }
            for (let i = 0; i < project.tags.length; i++) {
              const li = document.createElement("li");
              li.textContent = project.tags[i];
              li.style.listStyle = "none";
              tagsUl.appendChild(li);
            }
            for (let i = 0; i < project.languages.length; i++) {
              const li = document.createElement("li");
              li.textContent = project.languages[i];
              languageUl.appendChild(li);
            }
            modalDetails.appendChild(protitle);
            modalDetails.appendChild(description);
            modalDetails.appendChild(tagsUl);
            modalDetails.appendChild(tech);
            modalDetails.appendChild(Technologies);
            modalDetails.appendChild(lang);
            modalDetails.appendChild(languageUl);
          }
          // sirf see live per click kr k
          liveBtn.onclick = modalProject;
          projectDescription.onclick = modalProject;
          // Close modal Btn
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
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });

testData();
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", searchProjects);
}

export function searchProjects() {
  const filter = searchInput.value.trim().toUpperCase();
  const projectRows = document.querySelectorAll(".ProjectRow");

  for (let i = 0; i < projectData.length; i++) {
    const title = projectData[i].title.toUpperCase();
    const description = projectData[i].description.toUpperCase();

    let tagsMatch = false;
    let languagesMatch = false;
    let technologiesMatch = false;
    // tags search kr raha ha
    for (let k = 0; k < projectData[i].tags.length; k++) {
      const tag = projectData[i].tags[k].toUpperCase();
      if (tag.includes(filter)) {
        tagsMatch = true;
        break;
      }
    }
    // languange search kr raha ha
    for (let k = 0; k < projectData[i].languages.length; k++) {
      const language = projectData[i].languages[k].toUpperCase();
      if (language.includes(filter)) {
        languagesMatch = true;
        break;
      }
    }
    // technology ko search kr raha ha
    for (let k = 0; k < projectData[i].technology.length; k++) {
      const technology = projectData[i].technology[k].toUpperCase();
      if (technology.includes(filter)) {
        technologiesMatch = true;
        break;
      }
    }

    if (
      title.includes(filter) ||
      description.includes(filter) ||
      tagsMatch ||
      languagesMatch ||
      technologiesMatch
    ) {
      projectRows[i].style.display = "";
    } else {
      projectRows[i].style.display = "none";
    }
  }
}

const logoutbtn = document.getElementById("logout");
export default function logoutAdmin() {
  localStorage.removeItem("admin");
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}
// Logout button for admin and user
if (logoutbtn) {
  logoutbtn.onclick = logoutAdmin;
}
