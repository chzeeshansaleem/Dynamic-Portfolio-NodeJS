import http from "http";
import "dotenv/config";
import url from "url";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cors from "cors";
import users from "../server/db/user.json" assert { type: "json" };
import projectData from "../server/db/projects.json" assert { type: "json" };
const port = process.env.PORT || 8000;
const secretKey = process.env.SECRET_KEY;
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  cors()(req, res, () => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(users));
      res.end();
    } else if (req.url === "/signup" && req.method === "POST") {
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const newUser = JSON.parse(requestBody);
          const userInputFields = ["email", "password", "name", "role"];
          const missingFields = userInputFields.filter(
            (field) => !newUser.hasOwnProperty(field)
          );

          if (missingFields.length > 0) {
            console.log(
              "Required fields are missing: " + missingFields.join(", ")
            );
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Required fields are missing: " + missingFields.join(", "),
              })
            );
            return;
          }

          if (!newUser.hasOwnProperty("userRole")) {
            newUser.role = "user";
          } else if (newUser.role !== "user") {
            console.log("Role can only be 'user'");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Role can only be 'user'",
              })
            );
            return;
          }
          // remove extraData
          for (const key in newUser) {
            if (!userInputFields.includes(key)) {
              delete newUser[key];
            }
          }

          if (Object.keys(newUser).length === 0) {
            console.log("All fields required");
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "All fields required",
              })
            );
            return;
          }
          if (
            newUser.name === "" ||
            newUser.password === "" ||
            newUser.name === ""
          ) {
            console.log("All fields required");
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "All fields required",
              })
            );
          } else {
            //  email already exists
            console.log(requestBody);
            const userExistsIndex = users.find((user) => {
              if (user.email === newUser.email) {
                return true;
              }
            });
            console.log(userExistsIndex);
            if (userExistsIndex) {
              console.log("User already exists");
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Signup unsuccessful - User already exists",
                })
              );
            } else {
              console.log("User does not exist");

              users.push(newUser);
              console.log(users);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Signup successful", users }));
            }
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
        }
      });
    } else if (req.url === "/login" && req.method === "POST") {
      let requestBody = "";
      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const loginUser = JSON.parse(requestBody);
          const userInputFields = ["email", "password"];
          const missingFields = userInputFields.filter(
            (field) => !loginUser.hasOwnProperty(field)
          );

          if (missingFields.length > 0) {
            console.log(
              "Required fields are missing: " + missingFields.join(", ")
            );
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Required fields are missing: " + missingFields.join(", "),
              })
            );
            return;
          }
          console.log(loginUser);
          if (loginUser.name === "" || loginUser.password === "") {
            console.log("All fields required");
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "All fields required",
              })
            );
          } else {
            const user = users.find((u) => {
              if (
                u.email === loginUser.email &&
                u.password === loginUser.password
              ) {
                return true;
              }
            });

            if (user) {
              const token = jwt.sign({ email: user.email }, secretKey, {
                expiresIn: "1m",
              });

              user.token = token;
              console.log("Login successful");
              if (user.role === "admin") {
                res.writeHead(222, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Admin Login Successfully",
                    token,
                  })
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });

                res.end(
                  JSON.stringify({ message: "User Login successful", token })
                );
              }
              // // Verify the token using the secret key
              // const decoded = jwt.verify(token, secretKey);

              // // Token is valid, you can access decoded data
              // console.log("User authenticated:", decoded);
              // res.writeHead(200, { "Content-Type": "application/json" });

              // res.end(JSON.stringify({ message: "Login successful", token }));
            } else {
              console.log("Login unsuccessful");
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Login unsuccessful - Invalid credentials",
                })
              );
            }
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
        }
      });
    } else if (req.url === "/adminUsers" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    } else if (req.url === "/deleteUser" && req.method === "DELETE") {
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const deleteInfo = JSON.parse(requestBody);
          const emailToDelete = deleteInfo.email;

          const userIndex = users.findIndex(
            (user) => user.email === emailToDelete
          );

          if (userIndex !== -1) {
            users.splice(userIndex, 1);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "User deleted successfully", users })
            );
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
        }
      });
    } else if (req.url === "/editUserRole" && req.method === "PUT") {
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const editInfo = JSON.parse(requestBody);

          const userInputFields = ["email", "role"];
          const missingFields = userInputFields.filter(
            (field) => !editInfo.hasOwnProperty(field)
          );

          if (missingFields.length > 0) {
            console.log(
              "Required fields are missing: " + missingFields.join(", ")
            );
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Required fields are missing: " + missingFields.join(", "),
              })
            );
            return;
          }

          const emailToEdit = editInfo.email;
          const newRole = editInfo.role;
          console.log(emailToEdit);
          if (newRole === "") {
            console.log("Required fields are missing:  ");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Required fields are missing: ",
              })
            );
            return;
          }
          const userToEdit = users.find((user) => user.email === emailToEdit);

          if (userToEdit) {
            userToEdit.role = newRole;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User role updated successfully",
                users,
              })
            );
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
        }
      });
    } else if (req.url === "/add_users" && req.method === "POST") {
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const newUser = JSON.parse(requestBody);
          const userInputFields = ["name", "email", "password", "role"];
          const missingFields = userInputFields.filter(
            (field) => !newUser.hasOwnProperty(field)
          );

          if (missingFields.length > 0) {
            console.log(
              "Required fields are missing: " + missingFields.join(", ")
            );
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Required fields are missing: " + missingFields.join(", "),
              })
            );
            return;
          }
          if (
            newUser.name === "" ||
            newUser.password === "" ||
            newUser.name === "" ||
            newUser.role === ""
          ) {
            console.log("All fields required");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "All fields required: ",
              })
            );
            return;
          }
          //  email already exists
          console.log(requestBody);
          const userExistsIndex = users.find((user) => {
            if (user.email === newUser.email) {
              return true;
            }
          });
          console.log(userExistsIndex);
          if (userExistsIndex) {
            console.log("User already exists");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: " User already exists",
              })
            );
          } else {
            console.log("User does not exist");

            users.push(newUser);
            console.log(users);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "user added successfully", users })
            );
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
        }
      });
    } else if (req.url === "/updateProfile" && req.method === "PUT") {
      let requestBody = "";
      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const updatedInfo = JSON.parse(requestBody);

          const userInputFields = [
            "email",
            "name",
            "password",
            "phoneNumber",
            "skills",
            "experience",
            "education",
          ];
          const missingFields = userInputFields.filter(
            (field) => !updatedInfo.hasOwnProperty(field)
          );

          if (missingFields.length > 0) {
            console.log(
              "Required fields are missing: " + missingFields.join(", ")
            );
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Required fields are missing: " + missingFields.join(", "),
              })
            );
            return; // Exit early to prevent further processing
          }

          // check fields empty na ho
          if (
            !updatedInfo.email ||
            !updatedInfo.name ||
            !updatedInfo.password ||
            !updatedInfo.phoneNumber ||
            updatedInfo.skills.length === 0 ||
            updatedInfo.experience.length === 0 ||
            updatedInfo.education.length === 0
          ) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({
                message:
                  "All fields are required fields for updating the profile.",
              })
            );
          }

          const userIndex = users.findIndex(
            (user) => user.email === updatedInfo.email
          );

          if (userIndex !== -1) {
            users[userIndex].name = updatedInfo.name;
            users[userIndex].education = updatedInfo.education || [];
            users[userIndex].phoneNumber = updatedInfo.phoneNumber || "";
            users[userIndex].experience = updatedInfo.experience || [];
            users[userIndex].skills = updatedInfo.skills || [];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User updated successfully" }));
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Invalid JSON data. Error in parsing the request body.",
            })
          );
        }
      });
    } else if (req.url === "/projects" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(projectData));
        res.end();
      } catch (error) {
        console.error("Data not found ", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "project Data not found ",
          })
        );
      }
    } else if (req.url === "/userAddProjects" && req.method === "POST") {
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const newUserProject = JSON.parse(requestBody);
          const userInputFields = [
            "username",
            "title",
            "description",
            "img",
            "languages",
            "tags",
            "technology",
          ];
          const missingFields = userInputFields.filter(
            (field) => !newUserProject.hasOwnProperty(field)
          );

          if (missingFields.length > 0) {
            console.log(
              "Required fields are missing: " + missingFields.join(", ")
            );
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Required fields are missing: " + missingFields.join(", "),
              })
            );
            return;
          }

          // remove extraData
          for (const key in newUserProject) {
            if (!userInputFields.includes(key)) {
              delete newUserProject[key];
            }
          }

          if (Object.keys(newUserProject).length === 0) {
            console.log("All fields required");
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "All fields required",
              })
            );
            return;
          }
          if (
            newUserProject.title === "" ||
            newUserProject.description === "" ||
            newUserProject.img === ""
          ) {
            console.log("All fields required");
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "All fields required",
              })
            );
          } else {
            // console.log(requestBody);
            const userExists = users.find(
              (user) => user.email === newUserProject.username
            );

            if (!userExists || !userExists.token) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "User not logged in",
                })
              );
              return;
            }

            if (userExists) {
              const projectId = uuidv4();
              console.log(projectId);
              const projectWithId = { projectId, ...newUserProject };
              projectData.push(projectWithId);
              console.log(projectData);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Project added successfully",
                  projectData,
                })
              );
            }
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
        }
      });
    } else if (pathname.startsWith("/projects/") && req.method === "DELETE") {
      // Handle DELETE request to delete a project
      const projectIdToDelete = pathname.split("/")[2];

      try {
        const projectIndex = projectData.findIndex(
          (project) => project.projectId === projectIdToDelete
        );

        const userExists = users.find(
          (user) => user.email === projectData[projectIndex].username
        );
        console.log(userExists.email);

        if (!userExists || !userExists.token) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User not logged in",
            })
          );
          return;
        }
        console.log(projectIndex);
        if (projectIndex !== -1) {
          projectData.splice(projectIndex, 1);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User deleted successfully",
              projectData,
            })
          );
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User not found" }));
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    } else if (pathname.startsWith("/projectUpdate/") && req.method === "PUT") {
      const projectIdToUpdate = pathname.split("/")[2];
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const updatedInfo = JSON.parse(requestBody);

          const userInputFields = [
            "username",
            "title",
            "description",
            "img",
            "tags",
            "languages",
            "technology",
          ];
          const missingFields = userInputFields.filter(
            (field) => !updatedInfo.hasOwnProperty(field)
          );

          if (missingFields.length > 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Required fields are missing: " + missingFields.join(", "),
              })
            );
            return;
          }

          // Check if fields are empty
          if (
            !updatedInfo.title.trim() ||
            !updatedInfo.description.trim() ||
            updatedInfo.tags.length === 0 ||
            !updatedInfo.img.trim() ||
            updatedInfo.languages.length === 0 ||
            updatedInfo.technology.length === 0
          ) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "All fields are required fields for updating the project.",
              })
            );
            return;
          }

          const projectIndex = projectData.findIndex(
            (project) => project.projectId === projectIdToUpdate
          );
          //Check user authentication
          const userExists = users.find(
            (user) => user.email === projectData[projectIndex].username
          );

          if (!userExists || !userExists.token) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User not logged in",
              })
            );
            return;
          }
          console.log(projectIndex);
          if (projectIndex !== -1) {
            const updatedProject = {
              username: projectData[projectIndex].username,
              projectId: projectIdToUpdate,
              title: updatedInfo.title,
              description: updatedInfo.description,
              img: updatedInfo.img,
              tags: updatedInfo.tags,
              technology: updatedInfo.technology,
              languages: updatedInfo.languages,
            };

            projectData[projectIndex] = updatedProject;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Project updated successfully",
                updatedProject,
              })
            );
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Project not found" }));
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Invalid JSON data. Error in parsing the request body.",
            })
          );
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log("Server Running on: " + port);
});
