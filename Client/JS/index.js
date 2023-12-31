const redirct = JSON.parse(localStorage.getItem("user"));
export function getLocalStorageWithExpiry(key) {
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
// Logout button for admin and user
const logoutbtn = document.getElementById("logout");
export async function logout(e) {
  e.preventDefault();
  const res = await fetch("http://localhost:8000/logout", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
    },
  });
  localStorage.removeItem("user");
  localStorage.removeItem("admin");
  localStorage.removeItem("token");
  console.log(res);
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}

if (logoutbtn) {
  logoutbtn.onclick = logout;
}
const token1 = getLocalStorageWithExpiry("token");
console.log(token1);
const token = `"${token1}"`;
console.log("User token:", token);
//const token = localStorage.getItem("token");
const AdmintokenRedirect = localStorage.getItem("Admintoken");
if (!token1 && !AdmintokenRedirect) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
} else if (token1 && AdmintokenRedirect) {
  const url = "http://127.0.0.1:5500/Client/HTML/PageNotFound.html";
  window.location.href = url;
} else if (AdmintokenRedirect) {
  const url = "http://127.0.0.1:5500/Client/HTML/adminUsers.html";
  window.location.href = url;
} else {
  window.innerHTML = "Page not found";
}

const name = document.getElementById("username");

// const uname = username.find((e) => e.email == redirct.name);

// console.log(uname.name);

const projectsContainer = document.querySelector(".projects");
const modal = document.querySelector(".modal");
async function userdata() {
  const response = await fetch("http://localhost:8000/profileUpdate", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
    },
  });

  if (!response.ok) {
    throw new error(`fetching ka  error Status: ${response.status}`);
  }

  const users = await response.json();

  console.log(users[0].name);

  if (name) {
    name.textContent = users[0].name;
  }
}
userdata();
const testData = async () =>
  await fetch("http://localhost:8000/projects?searchQuery=", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
    },
  })
    .then((res) => res.json())
    .then((projectData) => {
      console.log(projectData);
      projectData.projects.forEach((project) => {
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
        const imageFormat = "jpg" || "png" || "jpeg";
        projectImg.style.backgroundImage = `url(data:image/${imageFormat};base64,${project.img})`;

        // sirf see live per click kr k
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
          const techArr = project.technology.split(",");
          for (let i = 0; i < techArr.length; i++) {
            const li = document.createElement("li");
            li.textContent = techArr[i];
            li.style.listStyle = "none";
            Technologies.appendChild(li);
          }
          for (let i = 0; i < project.tags.length; i++) {
            const li = document.createElement("li");
            li.style.listStyle = "none";
            li.textContent = project.tags[i];
            tagsUl.appendChild(li);
          }
          const langArr = project.languages.split(",");
          for (let i = 0; i < langArr.length; i++) {
            const li = document.createElement("li");
            li.style.listStyle = "none";
            li.textContent = langArr[i];
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
      });
    });
testData();
