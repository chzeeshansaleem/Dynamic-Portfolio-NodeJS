import http from "http";
import "dotenv/config";
import url from "url";
import {
  handleSignup,
  handleLogin,
  showUserProfile,
  addUser,
  updateUserRole,
  deleteUserByAdmin,
  showProjects,
  updateProfileByUser,
  showUserForProfile,
  addEduactionOfUser,
  showEducation,
  deleteEducation,
  updateEducation,
  showExperience,
  addExperience,
  updateExperience,
  deleteExperiences,
  addProject,
  deleteProject,
  updateProject,
  logout,
  tokenshow,
} from "./controllers/controllers.js";
const port = process.env.PORT || 8000;
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,Authentication"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  if (req.url === "/" && req.method === "GET") {
    showUserProfile(req, res);
  } else if (req.url === "/signup" && req.method === "POST") {
    handleSignup(req, res);
  } else if (req.url === "/login" && req.method === "POST") {
    handleLogin(req, res);
  } else if (req.url === "/adminUsers" && req.method === "GET") {
    showUserProfile(req, res);
  } else if (pathname.startsWith("/deleteUsers/") && req.method === "DELETE") {
    const profileIdToDelete = pathname.split("/")[2];
    deleteUserByAdmin(req, res, profileIdToDelete);
  } else if (pathname.startsWith("/adminUsers/") && req.method === "PUT") {
    const profileIdToUpdate = pathname.split("/")[2];
    updateUserRole(req, res, profileIdToUpdate);
  } else if (req.url === "/add_users" && req.method === "POST") {
    addUser(req, res);
  } else if (pathname.startsWith("/profileUpdate/") && req.method === "PUT") {
    const profileIdToUpdate = pathname.split("/")[2];
    updateProfileByUser(req, res, profileIdToUpdate);
  } else if (req.url === "/profileUpdate" && req.method === "GET") {
    showUserForProfile(req, res);
  } else if (req.url === "/addEduaction" && req.method === "POST") {
    addEduactionOfUser(req, res);
  } else if (req.url === "/projects" && req.method === "GET") {
    showProjects(req, res);
  } else if (req.url === "/education" && req.method === "GET") {
    showEducation(req, res);
  } else if (req.url === "/userAddProjects" && req.method === "POST") {
    addProject(req, res);
  } else if (pathname.startsWith("/projects/") && req.method === "DELETE") {
    const projectIdToDelete = pathname.split("/")[2];
    deleteProject(req, res, projectIdToDelete);
  } else if (pathname.startsWith("/projectUpdate/") && req.method === "PUT") {
    const projectIdToUpdate = pathname.split("/")[2];
    updateProject(req, res, projectIdToUpdate);
  } else if (pathname.startsWith("/educationUpdate/") && req.method === "PUT") {
    const projectIdToUpdate = pathname.split("/")[2];
    updateEducation(req, res, projectIdToUpdate);
  } else if (
    pathname.startsWith("/educationDelete/") &&
    req.method === "DELETE"
  ) {
    const DeleteIdToUpdate = pathname.split("/")[2];

    deleteEducation(req, res, DeleteIdToUpdate);
  } else if (req.url === "/addExperience" && req.method === "POST") {
    addExperience(req, res);
  } else if (
    pathname.startsWith("/experienceUpdate/") &&
    req.method === "PUT"
  ) {
    const expIdToUpdate = pathname.split("/")[2];
    updateExperience(req, res, expIdToUpdate);
  } else if (
    pathname.startsWith("/experienceDelete/") &&
    req.method === "DELETE"
  ) {
    const DeleteIdToUpdate = pathname.split("/")[2];
    deleteExperiences(req, res, DeleteIdToUpdate);
  } else if (req.url === "/experience" && req.method === "GET") {
    showExperience(req, res);
  } else if (req.url === "/logout") {
    logout(req, res);
  } else if (req.url === "/token") {
    tokenshow(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Server Running on: " + port);
});
