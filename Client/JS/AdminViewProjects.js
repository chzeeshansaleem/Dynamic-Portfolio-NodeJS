function getLocalStorageWithExpiry(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const parsedItem = JSON.parse(item);
  const now = new Date();

  if (now.getTime() > parsedItem.expiry) {
    // Item has expired, so remove it from localStorage
    localStorage.removeItem(key);
    return null;
  }

  return parsedItem.value;
}
const Admintoken1 = getLocalStorageWithExpiry("Admintoken");
console.log(Admintoken1);
const Admintoken = `"${Admintoken1}"`;
console.log("Admintoken:", Admintoken);
if (!Admintoken1) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}

const projectsContainer = document.querySelector(".projects");
const modal = document.querySelector(".modal");
async function testData() {
  projectsContainer.innerHTML = "";
  const searchProject = document.getElementById("searchInput").value.trim();

  const res = await fetch(
    `http://localhost:8000/projects?searchQuery=${searchProject}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Admintoken.substring(
          1,
          Admintoken.length - 1
        )}`,
      },
    }
  );

  const projectData = await res.json();
  if (projectData.message === "No projects found.") {
    const noProjectsMessage = document.createElement("p");
    noProjectsMessage.textContent = "Project not found";
    projectsContainer.appendChild(noProjectsMessage);
  } else {
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
      // projectImg.style.backgroundImage = `url(${project.img})`;
      const imageFormat = "jpg" || "png" || "jpeg";
      projectImg.style.backgroundImage = `url(data:image/${imageFormat};base64,${project.img})`;

      function modalProject() {
        modal.style.display = "block";
        const modalPic = document.querySelector(".modalPic");
        const imageFormat = "jpg" || "png" || "jpeg";
        modalPic.style.backgroundImage = `url(data:image/${imageFormat};base64,${project.img})`;
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
        const techn = project.technology.split(",");
        for (let i = 0; i < techn.length; i++) {
          const li = document.createElement("li");
          li.textContent = techn[i];
          Technologies.appendChild(li);
        }
        const tag = project.tags.split(",");
        for (let i = 0; i < tag.length; i++) {
          const li = document.createElement("li");
          li.textContent = tag[i];
          li.style.listStyle = "none";
          tagsUl.appendChild(li);
        }
        const langua = project.languages.split(",");
        for (let i = 0; i < langua.length; i++) {
          const li = document.createElement("li");
          li.textContent = langua[i];
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
      liveBtn.onclick = () => {
        console.log("Live Button Clicked");
        modalProject();
      };
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
}

testData();

const searchInput = document.getElementById("searchInput");
let timeoutId;
if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(testData, 1000);
  });
}

const logoutbtn = document.getElementById("logout");
const insidebtn = document.getElementById("insideLogout");
insidebtn.style.backgroundColor = "#D0312D";
insidebtn.style.padding = "5px 10px";
insidebtn.style.border = "none";
insidebtn.style.boxShadow = "2px 2px 5px gray,-2px -2px 5px gray";
insidebtn.style.fontWeight = "bold";
export default async function logoutAdmin() {
  localStorage.removeItem("admin");
  localStorage.removeItem("Admintoken");
  const res = await fetch("http://localhost:8000/logout", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Admintoken.substring(1, Admintoken.length - 1)}`,
    },
  });
  console.log(res);
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}
// Logout button for admin and user
if (logoutbtn) {
  logoutbtn.onclick = logoutAdmin;
}
