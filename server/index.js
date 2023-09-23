import http from "http";
import "dotenv/config";
import url from "url";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cors from "cors";
import users from "../server/db/user.json" assert { type: "json" };
import education from "../server/db/education.json" assert { type: "json" };
import experience from "../server/db/experience.json" assert { type: "json" };
import { verifyToken } from "./controllers/verify.js";
import projectData from "../server/db/projects.json" assert { type: "json" };
const port = process.env.PORT || 8000;
const secretKey = process.env.SECRET_KEY;
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  cors()(req, res, () => {
    if (req.url === "/") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(users));
        res.end();
      } catch (error) {
        console.error("Token verification failed");
        console.error(err);
        res.writeHead(403, { "Content-Type": "application/json" });
        res.write(JSON.stringify("nO USER fOUND"));
        res.end();
      }
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

              //  user.token = token;
              console.log(token);
              res.setHeader(
                "Set-Cookie",
                `token=${token}; Path=/; Max-Age=3600; SameSite=Strict`
              );

              verifyToken(token)
                .then((decoded) => {
                  // Token is valid, you can access the decoded data
                  console.log("Token is valid");
                  console.log(decoded);
                })

                .catch((err) => {
                  // Token is invalid or expired
                  console.error("Token verification failed");
                  console.error(err);
                });
              console.log("Login successful");
              if (user.role === "admin") {
                res.writeHead(222, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Admin Login Successfully",
                    token,
                    user,
                  })
                );
              } else {
                res.writeHead(200, { "Content-Type": "application/json" });

                res.end(
                  JSON.stringify({
                    message: "User Login successful",
                    token,
                    user,
                  })
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
    } else if (
      pathname.startsWith("/deleteUsers/") &&
      req.method === "DELETE"
    ) {
      const profileIdToDelete = pathname.split("/")[2];

      try {
        const userIndex = users.findIndex(
          (user) => user.email === profileIdToDelete
        );

        if (userIndex !== -1) {
          const projectsToDelete = projectData.filter(
            (project) => project.username === profileIdToDelete
          );
          projectsToDelete.forEach((project) => {
            const projectIndex = projectData.findIndex(
              (pro) => pro.projectId === project.projectId
            );
            if (projectIndex !== -1) {
              projectData.splice(projectIndex, 1);
            }
          });

          users.splice(userIndex, 1);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User and his projects deleted successfully",
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
    } else if (pathname.startsWith("/adminUsers/") && req.method === "PUT") {
      const profileIdToUpdate = pathname.split("/")[2];
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const editInfo = JSON.parse(requestBody);

          const userInputFields = ["role"];
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

          const newRole = editInfo.role;
          console.log(profileIdToUpdate);
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
          const userToEdit = users.find(
            (user) => user.email === profileIdToUpdate
          );

          if (userToEdit) {
            userToEdit.role = newRole;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User role updated successfully",
                userToEdit,
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
    } else if (pathname.startsWith("/profileUpdate/") && req.method === "PUT") {
      const profileIdToUpdate = pathname.split("/")[2];
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
          // if (
          //   !updatedInfo.email ||
          //   !updatedInfo.name ||
          //   !updatedInfo.password ||
          //   !updatedInfo.phoneNumber ||
          //   updatedInfo.skills.length === 0
          // ) {
          //   res.writeHead(400, { "Content-Type": "application/json" });
          //   return res.end(
          //     JSON.stringify({
          //       message:
          //         "All fields are required fields for updating the profile.",
          //     })
          //   );
          // }

          const userIndex = users.findIndex(
            (user) => user.email === profileIdToUpdate
          );

          if (userIndex !== -1) {
            users[userIndex].name = updatedInfo.name;
            users[userIndex].password = updatedInfo.password;
            users[userIndex].phoneNumber = updatedInfo.phoneNumber || "";
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
    } else if (req.url === "/profileUpdate" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    } else if (req.url === "/addEduaction" && req.method === "POST") {
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          console.log(requestBody);
          const newUser = JSON.parse(requestBody);
          console.log(newUser);
          // const userInputFields = [
          //   "username",
          //   "degree",
          //   "institute",
          //   "startDate",
          //   "endDate",
          // ];
          // const missingFields = userInputFields.filter(
          //   (field) => !newUser.hasOwnProperty(field)
          // );

          // if (missingFields.length > 0) {
          //   console.log(
          //     "Required fields are missing: " + missingFields.join(", ")
          //   );
          //   res.writeHead(400, { "Content-Type": "application/json" });
          //   res.end(
          //     JSON.stringify({
          //       message:
          //         "Required fields are missing: " + missingFields.join(", "),
          //     })
          //   );
          //   return;
          // }
          // if (
          //   newUser.degree === "" ||
          //   newUser.university === "" ||
          //   newUser.startDate === "" ||
          //   newUser.EndDate === ""
          // ) {
          //   console.log("All fields required");
          //   res.writeHead(400, { "Content-Type": "application/json" });
          //   res.end(
          //     JSON.stringify({
          //       message: "All fields required: ",
          //     })
          //   );
          //   return;
          // }

          const eduId = uuidv4();
          console.log(eduId);
          const educationWithId = { eduId, ...newUser };
          education.push(educationWithId);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "user added successfully", education })
          );
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
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
    } else if (req.url === "/education" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(education));
        res.end();
      } catch (error) {
        console.error("Data not found ", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "education Data not found ",
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

            if (!userExists) {
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

        if (!userExists) {
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

          if (!userExists) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User not Found",
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
    } else if (
      pathname.startsWith("/educationUpdate/") &&
      req.method === "PUT"
    ) {
      const projectIdToUpdate = pathname.split("/")[2];
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const updatedInfo = JSON.parse(requestBody);

          const userInputFields = [
            "eduId",
            "degree",
            "university",
            "startDate",
            "EndDate",
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
          // if (
          //   !updatedInfo.title.trim() ||
          //   !updatedInfo.description.trim() ||
          //   updatedInfo.tags.length === 0 ||
          //   !updatedInfo.img.trim() ||
          //   updatedInfo.languages.length === 0 ||
          //   updatedInfo.technology.length === 0
          // ) {
          //   res.writeHead(400, { "Content-Type": "application/json" });
          //   res.end(
          //     JSON.stringify({
          //       message:
          //         "All fields are required fields for updating the project.",
          //     })
          //   );
          //   return;
          // }

          const projectIndex = education.findIndex(
            (project) => project.eduId === projectIdToUpdate
          );
          //Check user authentication
          // const userExists = education.find(
          //   (user) => user.email === projectData[projectIndex].username
          // );

          // if (!userExists || !userExists.token) {
          //   res.writeHead(400, { "Content-Type": "application/json" });
          //   res.end(
          //     JSON.stringify({
          //       message: "User not logged in",
          //     })
          //   );
          //   return;
          // }
          console.log(projectIndex);
          if (projectIndex !== -1) {
            const updatedProject = {
              username: updatedInfo.username,
              eduId: projectIdToUpdate,
              degree: updatedInfo.degree,
              university: updatedInfo.university,
              startDate: updatedInfo.startDate,
              EndDate: updatedInfo.EndDate,
            };

            education[projectIndex] = updatedProject;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Project updated successfully",
                updated_Project: updatedProject,
                all_Projects: education,
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
    } else if (
      pathname.startsWith("/educationDelete/") &&
      req.method === "DELETE"
    ) {
      const DeleteIdToUpdate = pathname.split("/")[2];
      console.log("DeleteIdToUpdate:" + DeleteIdToUpdate);

      try {
        const educationIndex = education.findIndex((user) => {
          if (user.eduId === DeleteIdToUpdate) return user.eduId;
        });
        console.log(educationIndex);
        console.log(educationIndex);
        if (educationIndex !== -1) {
          // Corrected variable name to educationIndex
          education.splice(educationIndex, 1);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Education deleted successfully",
              education, // Is this variable defined? You might want to return education instead.
            })
          );
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Education not found" }));
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    } else if (req.url === "/addExperience" && req.method === "POST") {
      let requestBody = "";

      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          console.log(requestBody);
          const newExperience = JSON.parse(requestBody);
          console.log(newExperience);

          const expId = uuidv4();
          console.log(expId);
          const educationWithId = { expId, ...newExperience };
          experience.push(educationWithId);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "user added successfully", experience })
          );
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON data" }));
        }
      });
    } else if (
      pathname.startsWith("/experienceUpdate/") &&
      req.method === "PUT"
    ) {
      const expIdToUpdate = pathname.split("/")[2];
      let requestBody = "";
      console.log(expIdToUpdate);
      req.on("data", (chunk) => {
        requestBody += chunk;
      });

      req.on("end", () => {
        try {
          const updatedInfo = JSON.parse(requestBody);

          // Check if fields are empty

          const experienceIndex = experience.findIndex(
            (project) => project.expId === expIdToUpdate
          );

          console.log(experienceIndex);
          if (experienceIndex !== -1) {
            const updatedExperience = {
              username: updatedInfo.username,
              expId: expIdToUpdate,
              position: updatedInfo.position,
              company: updatedInfo.company,
              startDate: updatedInfo.startDate,
              endDate: updatedInfo.endDate,
            };

            experience[experienceIndex] = updatedExperience;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Project updated successfully",
                experience,
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
    } else if (
      pathname.startsWith("/experienceDelete/") &&
      req.method === "DELETE"
    ) {
      const DeleteIdToUpdate = pathname.split("/")[2];
      console.log("DeleteIdToUpdate:" + DeleteIdToUpdate);

      try {
        const expIndex = experience.findIndex((user) => {
          if (user.expId === DeleteIdToUpdate) return user.expId;
        });
        console.log(expIndex);
        console.log(expIndex);
        if (expIndex !== -1) {
          // Corrected variable name to educationIndex
          experience.splice(expIndex, 1);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "experience deleted successfully",
              experience, // Is this variable defined? You might want to return education instead.
            })
          );
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Education not found" }));
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    } else if (req.url === "/experience" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(experience));
        res.end();
      } catch (error) {
        console.error("Data not found ", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "experience Data not found ",
          })
        );
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log("Server Running on: " + port);
});
