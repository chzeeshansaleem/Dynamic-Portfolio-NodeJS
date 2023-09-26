import users from "../../server/db/user.json" assert { type: "json" };
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import "dotenv/config";
import education from "../../server/db/education.json" assert { type: "json" };
import experience from "../../server/db/experience.json" assert { type: "json" };
import { verifyToken1 } from "../Authentication/verify.js";
import projectData from "../../server/db/projects.json" assert { type: "json" };
import tokenData from "../../server/db/tokenSession.json" assert { type: "json" };
const secretKey = process.env.SECRET_KEY;
// check field ma data sahi  ha ya nai
function maskText(text, allowedRegex) {
  if (allowedRegex.test(text)) {
    return true;
  } else {
    return false;
  }
}

// signup ka function
function handleSignup(req, res) {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const newUser = JSON.parse(requestBody);
      console.log(newUser);
      const userInputFields = ["email", "password", "name", "role"];
      const missingFields = userInputFields.filter(
        (field) => !newUser.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(402, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }
      for (const key in newUser) {
        if (!userInputFields.includes(key)) {
          delete newUser[key];
        }
      }

      if (Object.keys(newUser).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
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
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
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
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON data" }));
    }
  });
}
// Login ka function
function handleLogin(req, res) {
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
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }
      // remove extra entries
      for (const key in loginUser) {
        if (!userInputFields.includes(key)) {
          delete loginUser[key];
        }
      }
      // again check object keys
      if (Object.keys(loginUser).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }
      console.log(loginUser);
      if (loginUser.name === "" || loginUser.password === "") {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            " message": "All fields required",
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
          console.log("Login successful");
          if (user.role === "admin") {
            const Admintoken = jwt.sign(
              { email: user.email, role: user.role },
              secretKey,
              {
                expiresIn: "5m",
              }
            );
            const tokensession = {
              username: user.email,
              token: Admintoken,
            };
            tokenData.push(tokensession);

            res.writeHead(222, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Admin Login Successfully",
                Admintoken,
                user,
              })
            );
          } else {
            const token = jwt.sign({ email: user.email }, secretKey, {
              expiresIn: "5m",
            });
            const tokensession = {
              username: user.email,
              token: token,
            };
            tokenData.push(tokensession);
            console.log(token);

            res.writeHead(200, { "Content-Type": "application/json" });

            res.end(
              JSON.stringify({
                message: "User Login successful",
                token,
                user,
              })
            );
          }
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
}
// show user profile on admin pannel
function showUserProfile(req, res) {
  const token1 = req.headers["authorization"];
  console.log(token1);
  const token = token1.split(" ")[1];
  console.log("token: ", token);
  if (!token) {
    console.error("Token is missing");
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Token is missing" }));
    return;
  }
  try {
    const verified = verifyToken1(token);
    console.log("verified token", verified);

    //  find user from token session table
    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      // if user exist in token table
      if (tokenExist) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      }
    } else {
      const tokenExistIndex = tokenData.findIndex(
        (user) => user.token === token
      );

      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");
      console.error("from  show user profile Token verification failed");

      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: " User Not Authenticated",
        })
      );
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
// add user by admin
function addUser(req, res) {
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
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }
      if (
        newUser.email === "" ||
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
      // now doing masking
      const allowedRegexMail = /[^a-zA-Z0-9@.]/g;
      const AfterMaskingeMail = maskText(newUser.email, allowedRegexMail);
      const allowedRegexName = /[^a-zA-Z]/g;
      const AfterMaskingeName = maskText(newUser.name, allowedRegexName);
      const allowedRegexUser = /[^a-zA-Z]/g;
      const AfterMaskingeUser = maskText(newUser.role, allowedRegexUser);

      if (
        AfterMaskingeMail === false &&
        AfterMaskingeName === false &&
        AfterMaskingeUser === false
      ) {
        console.log("AfterMaskingeMail: ", AfterMaskingeMail);
        console.log("AfterMaskingeName: ", AfterMaskingeName);
        console.log("AfterMaskingeUser: ", AfterMaskingeUser);
        const token1 = req.headers["authorization"];
        const token = token1.split(" ")[1];
        console.log(token);
        //  now call verifyToken function
        const verified = verifyToken1(token);
        console.log("verified token", verified);
        //  find user from token session table
        if (verified != null) {
          const tokenExist = tokenData.find((user) => {
            if (user.username === verified.email && user.token === token) {
              return true;
            }
          });
          // if user exist in token table
          if (tokenExist) {
            console.log("   Add user profile  Token is valid");

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
          } else {
            console.error("from  Add user profile Token verification failed");
            console.error(err);
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: " User Not Authenticated",
              })
            );
          }
        } else {
          const tokenExistIndex = tokenData.findIndex(
            (user) => user.token === token
          );

          console.log("results", tokenExistIndex);
          if (tokenExistIndex !== -1) {
            tokenData.splice(tokenExistIndex, 1);
          }
          console.log("User logged out");
          console.error("from  Add user profile Token verification failed");

          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: " User Not Authenticated",
            })
          );
        }
      } else {
        console.log("entery wrong entry");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: " entery wrong entry" }));
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON data" }));
    }
  });
}
// update user role by admin
function updateUserRole(req, res, userId) {
  const profileIdToUpdate = userId;
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
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
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
      const token1 = req.headers["authorization"];
      const token = token1.split(" ")[1];
      console.log(token);
      const verified = verifyToken1(token);
      console.log("verified token", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });

        if (tokenExist) {
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
        }
      } else {
        const tokenExistIndex = tokenData.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        if (tokenExistIndex !== -1) {
          tokenData.splice(tokenExistIndex, 1);
        }
        console.log("User logged out");
        console.error("from  Update user profile Token verification failed");

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authenticated",
          })
        );
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON data" }));
    }
  });
}
// delete user by admin panel
function deleteUserByAdmin(req, res, userId) {
  const profileIdToDelete = userId;
  try {
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];
    console.log(token);
    const verified = verifyToken1(token);
    console.log("verified token for delete", verified);
    //  find user from token session table

    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      if (tokenExist) {
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
      }
    } else {
      console.error(" Delete user func Token verification failed");
      console.error(err);
      const tokenExistIndex = tokenData.findIndex(
        (user) => user.token === token
      );

      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");

      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: " User Not Authorized",
        })
      );
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
// show projects list
function showProjects(req, res) {
  try {
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];
    console.log(token);
    if (!token) {
      console.error("Token is missing");
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Token is missing" }));
      return;
    }
    const verified = verifyToken1(token);
    console.log("verified token", verified);
    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      if (tokenExist) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(projectData));
        res.end();
      }
    } else {
      console.error(" Project View  Token verification failed");
      const tokenExistIndex = tokenData.findIndex(
        (user) => user.token === token
      );

      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");
      console.error("from  show user profile Token verification failed");

      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: " User Not Authorized",
        })
      );
    }
  } catch (error) {
    console.error("Data not found ", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "project Data not found ",
      })
    );
  }
}
// add project by user
function addProject(req, res) {
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
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
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
        res.writeHead(400, { "Content-Type": "application/json" });
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
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields Value required",
          })
        );
      } else {
        const userExists = users.find(
          (user) => user.email === newUserProject.username
        );

        const token1 = req.headers["authorization"];
        const token = token1.split(" ")[1];
        console.log(token);
        const verified = verifyToken1(token);
        console.log("verified token", verified);
        //  find user from token session table
        if (verified != null) {
          const tokenExist = tokenData.find((user) => {
            if (user.username === verified.email && user.token === token) {
              return true;
            }
          });
          // if user exist in token table
          if (tokenExist) {
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
        } else {
          console.error("Token verification failed");
          const tokenExistIndex = tokenData.findIndex(
            (user) => user.token === token
          );

          console.log("results", tokenExistIndex);
          if (tokenExistIndex !== -1) {
            tokenData.splice(tokenExistIndex, 1);
          }
          console.log("User logged out");
          console.error("from  add user project Token verification failed");

          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: " User Not Authenticated",
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
}
// delete the project
function deleteProject(req, res, projectId) {
  const projectIdToDelete = projectId;

  try {
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];
    console.log(token);
    const verified = verifyToken1(token);
    console.log("verified token", verified);
    //  find user from token session table
    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      // if user exist in token table
      if (tokenExist) {
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
      } else {
        console.error("Token verification failed");
        console.error(err);
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "user not autherized",
          })
        );
      }
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
// update project
function updateProject(req, res, projectId) {
  const projectIdToUpdate = projectId;
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
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }

      // Check if fields are empty
      if (
        !updatedInfo.title.trim() ||
        !updatedInfo.description.trim() ||
        updatedInfo.tags.length === 0 ||
        updatedInfo.languages.length === 0 ||
        updatedInfo.technology.length === 0
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields are required fields for updating the project.",
          })
        );
        return;
      }

      for (const key in updatedInfo) {
        if (!userInputFields.includes(key)) {
          delete updatedInfo[key];
        }
      }

      if (Object.keys(updatedInfo).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }

      const projectIndex = projectData.findIndex(
        (project) => project.projectId === projectIdToUpdate
      );
      //Check user authentication

      const token1 = req.headers["authorization"];
      const token = token1.split(" ")[1];
      console.log(token);
      const verified = verifyToken1(token);
      console.log("verified token", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });
        // if user exist in token table
        if (tokenExist) {
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
        }
      } else {
        console.error("Token verification failed");
        const tokenExistIndex = tokenData.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        if (tokenExistIndex !== -1) {
          tokenData.splice(tokenExistIndex, 1);
        }
        console.log("User logged out");
        console.error("from  show user profile Token verification failed");

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authenticated",
          })
        );
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
}
// update profile by user
function updateProfileByUser(req, res, userId) {
  const profileIdToUpdate = userId;
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
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
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
        updatedInfo.skills.length === 0
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "All fields are required fields for updating the profile.",
          })
        );
      }
      for (const key in updatedInfo) {
        if (!userInputFields.includes(key)) {
          delete updatedInfo[key];
        }
      }

      if (Object.keys(updatedInfo).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }
      const userIndex = users.findIndex(
        (user) => user.email === profileIdToUpdate
      );

      const token1 = req.headers["authorization"];
      const token = token1.split(" ")[1];
      console.log(token);
      const verified = verifyToken1(token);
      console.log("verified token", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });

        if (tokenExist) {
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
        }
      } else {
        console.error("Token verification failed");
        console.error(err);
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "user not autherized",
          })
        );
      }

      // verifyToken(token)
      //   .then((decoded) => {
      //     // Token is valid
      //     console.log("Token is valid");
      //     console.log(decoded);
      //     if (userIndex !== -1) {
      //       users[userIndex].name = updatedInfo.name;
      //       users[userIndex].password = updatedInfo.password;
      //       users[userIndex].phoneNumber = updatedInfo.phoneNumber || "";
      //       users[userIndex].skills = updatedInfo.skills || [];
      //       res.writeHead(200, { "Content-Type": "application/json" });
      //       res.end(JSON.stringify({ message: "User updated successfully" }));
      //     } else {
      //       res.writeHead(404, { "Content-Type": "application/json" });
      //       res.end(JSON.stringify({ message: "User not found" }));
      //     }
      //   })

      //   .catch((err) => {
      //     // Token is invalid or expired
      //     console.error("Token verification failed");
      //     console.error(err);
      //     res.writeHead(403, { "Content-Type": "application/json" });
      //     res.end(
      //       JSON.stringify({
      //         message: "user not autherized",
      //       })
      //     );
      //   });
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
}
// show user profile
function showUserForProfile(req, res) {
  const token1 = req.headers["authorization"];
  const token = token1.split(" ")[1];
  console.log(token);
  if (!token) {
    console.error("Token is missing");
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Token is missing" }));
    return;
  }
  try {
    const verified = verifyToken1(token);
    console.log("verified token for show profile", verified);
    //  find user from token session table
    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      // if user exist in token table
      if (tokenExist) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      }
    } else {
      console.error("Token verification failed");
      const tokenExistIndex = tokenData.findIndex(
        (user) => user.token === token
      );

      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");
      console.error("from  show user profile Token verification failed");

      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: " User Not Authorized",
        })
      );
    }

    //   verifyToken(token)
    //     .then((decoded) => {
    //       // Token is valid
    //       console.log("Token is valid");
    //       console.log(decoded);

    //     .catch((err) => {
    //       // Token is invalid or expired

    //     });
    // } catch (error) {
    //   console.error("Error parsing JSON:", error);
    //   res.writeHead(400, { "Content-Type": "application/json" });
    //   res.end(JSON.stringify({ message: "Invalid JSON data" }));
    // }
  } catch (error) {
    console.log(error);
  }
}
// show education in profile
function showEducation(req, res) {
  const token1 = req.headers["authorization"];
  const token = token1.split(" ")[1];

  if (!token) {
    console.error("Token is missing");
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Token is missing" }));
    return;
  }
  try {
    const verified = verifyToken1(token);
    console.log("verified token for show education", verified);
    //  find user from token session table
    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      // if user exist in token table
      if (tokenExist) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(education));
        res.end();
      } else {
        console.error("Token verification failed");
        console.error(err);
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "user not autherized",
          })
        );
      }
    } else {
      console.error("Token verification failed");
      const tokenExistIndex = tokenData.findIndex(
        (user) => user.token === token
      );

      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");
      console.error("from  show educatiom profile Token verification failed");

      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: " User Not Authorized",
        })
      );
    }
  } catch (error) {
    console.error("Data not found ", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "education Data not found ",
      })
    );
  }
}
// add education information
function addEduactionOfUser(req, res) {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      console.log(requestBody);
      const newUser = JSON.parse(requestBody);
      console.log(newUser);
      const userInputFields = [
        "username",
        "degree",
        "university",
        "startDate",
        "endDate",
      ];
      const missingFields = userInputFields.filter(
        (field) => !newUser.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }
      if (
        newUser.degree === "" ||
        newUser.university === "" ||
        newUser.startDate === "" ||
        newUser.endDate === ""
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
      for (const key in newUser) {
        if (!userInputFields.includes(key)) {
          delete newUser[key];
        }
      }

      if (Object.keys(newUser).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }
      const token1 = req.headers["authorization"];
      const token = token1.split(" ")[1];
      console.log(token);
      const verified = verifyToken1(token);
      console.log("verified token for add education", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });
        // if user exist in token table
        if (tokenExist) {
          const eduId = uuidv4();
          console.log(eduId);
          const educationWithId = { eduId, ...newUser };
          education.push(educationWithId);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "user added successfully", education })
          );
        }
      } else {
        console.error("Token verification failed");

        const tokenExistIndex = tokenData.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        if (tokenExistIndex !== -1) {
          tokenData.splice(tokenExistIndex, 1);
        }
        console.log("User logged out");
        console.error("from  add education profile Token verification failed");

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authorized",
          })
        );
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON data" }));
    }
  });
}
// update education
function updateEducation(req, res, EducationId) {
  const projectIdToUpdate = EducationId;
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const updatedInfo = JSON.parse(requestBody);

      const userInputFields = [
        "username",
        "eduId",
        "degree",
        "university",
        "startDate",
        "endDate",
      ];
      const missingFields = userInputFields.filter(
        (field) => !updatedInfo.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }

      //Check if fields are empty
      if (
        !updatedInfo.degree.trim() ||
        !updatedInfo.university.trim() ||
        !updatedInfo.startDate.trim() ||
        !updatedInfo.endDate === 0
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields are required fields for updating the project.",
          })
        );
        return;
      }
      for (const key in updatedInfo) {
        if (!userInputFields.includes(key)) {
          delete updatedInfo[key];
        }
      }

      if (Object.keys(updatedInfo).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }
      const projectIndex = education.findIndex(
        (project) => project.eduId === projectIdToUpdate
      );
      //Check user authentication
      const token1 = req.headers["authorization"];
      const token = token1.split(" ")[1];
      console.log(token);
      const verified = verifyToken1(token);
      console.log("verified token", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });
        // if user exist in token table
        if (tokenExist) {
          console.log(projectIndex);
          if (projectIndex !== -1) {
            const updatedProject = {
              username: updatedInfo.username,
              eduId: projectIdToUpdate,
              degree: updatedInfo.degree,
              university: updatedInfo.university,
              startDate: updatedInfo.startDate,
              endDate: updatedInfo.endDate,
            };

            education[projectIndex] = updatedProject;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "education updated successfully",
                updated_Project: updatedProject,
                all_Projects: education,
              })
            );
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "education not found" }));
          }
        }
      } else {
        console.error("Token verification failed");
        const tokenExistIndex = tokenData.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        if (tokenExistIndex !== -1) {
          tokenData.splice(tokenExistIndex, 1);
        }
        console.log("User logged out");
        console.error(
          "from  Update education profile Token verification failed"
        );

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authorized",
          })
        );
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
}
// delete education
function deleteEducation(req, res, EducationId) {
  const DeleteIdToUpdate = EducationId;
  console.log("DeleteIdToUpdate:" + DeleteIdToUpdate);

  try {
    const educationIndex = education.findIndex((user) => {
      if (user.eduId === DeleteIdToUpdate) return user.eduId;
    });
    console.log(educationIndex);
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];
    console.log(token);
    const verified = verifyToken1(token);
    console.log("verified token", verified);
    //  find user from token session table
    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      if (tokenExist) {
        if (educationIndex !== -1) {
          education.splice(educationIndex, 1);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Education deleted successfully",
              education,
            })
          );
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Education not found" }));
        }
      }
    } else {
      // Token is invalid or expired
      console.error("Token verification failed");
      const tokenExistIndex = tokenData.findIndex(
        (user) => user.token === token
      );

      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");
      console.error("from  delete education profile Token verification failed");

      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: " User Not Authorized",
        })
      );
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
// show Experience
function showExperience(req, res) {
  {
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];
    console.log(token);
    if (!token) {
      console.error("Token is missing");
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Token is missing" }));
      return;
    }

    try {
      const verified = verifyToken1(token);
      console.log("verified token", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });

        if (tokenExist) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(experience));
          res.end();
        }
      } else {
        console.error("Token verification failed");
        const tokenExistIndex = tokenData.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        if (tokenExistIndex !== -1) {
          tokenData.splice(tokenExistIndex, 1);
        }
        console.log("User logged out");
        console.error(
          "from  show experience profile Token verification failed"
        );

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authorized",
          })
        );
      }
    } catch (error) {
      console.error("Data not found ", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "experience Data not found ",
        })
      );
    }
  }
}
//  add experience
function addExperience(req, res) {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      console.log(requestBody);
      const newExperience = JSON.parse(requestBody);
      console.log(newExperience);

      const userInputFields = [
        "username",
        "position",
        "company",
        "startDate",
        "endDate",
      ];
      const missingFields = userInputFields.filter(
        (field) => !newExperience.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }

      if (
        newExperience.position === "" ||
        newExperience.company === "" ||
        newExperience.startDate === "" ||
        newExperience.endDate === ""
      ) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            " message": "All fields required",
          })
        );
        return;
      }
      for (const key in newExperience) {
        if (!userInputFields.includes(key)) {
          delete newExperience[key];
        }
      }

      if (Object.keys(newExperience).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }

      const token1 = req.headers["authorization"];
      const token = token1.split(" ")[1];
      console.log(token);
      const verified = verifyToken1(token);
      console.log("verified token", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });
        // if user exist in token table
        if (tokenExist) {
          const expId = uuidv4();
          console.log(expId);
          const educationWithId = { expId, ...newExperience };
          experience.push(educationWithId);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "user added successfully", experience })
          );
        }
      } else {
        console.error("Token verification failed");
        const tokenExistIndex = tokenData.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        if (tokenExistIndex !== -1) {
          tokenData.splice(tokenExistIndex, 1);
        }
        console.log("User logged out");
        console.error(
          "from  add education user profile Token verification failed"
        );

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authorized",
          })
        );
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON data" }));
    }
  });
}
// update experience
function updateExperience(req, res, experienceId) {
  const expIdToUpdate = experienceId;
  let requestBody = "";
  console.log(expIdToUpdate);
  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const updatedInfo = JSON.parse(requestBody);
      const userInputFields = [
        "username",
        "position",
        "company",
        "startDate",
        "endDate",
        "expId",
      ];
      const missingFields = userInputFields.filter(
        (field) => !updatedInfo.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        console.log("Required fields are missing: " + missingFields.join(", "));
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Required fields are missing: " + missingFields.join(", "),
          })
        );
        return;
      }
      // Check if fields are empty
      if (
        updatedInfo.position === "" ||
        updatedInfo.company === "" ||
        updatedInfo.startDate === "" ||
        updatedInfo.endDate === ""
      ) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            " message": "All fields required",
          })
        );
        return;
      }
      for (const key in updatedInfo) {
        if (!userInputFields.includes(key)) {
          delete updatedInfo[key];
        }
      }

      if (Object.keys(updatedInfo).length === 0) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }

      const experienceIndex = experience.findIndex(
        (project) => project.expId === expIdToUpdate
      );
      const token1 = req.headers["authorization"];
      const token = token1.split(" ")[1];
      console.log(token);
      const verified = verifyToken1(token);
      console.log("verified token", verified);
      //  find user from token session table
      if (verified != null) {
        const tokenExist = tokenData.find((user) => {
          if (user.username === verified.email && user.token === token) {
            return true;
          }
        });
        // if user exist in token table
        if (tokenExist) {
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
                message: "experience updated successfully",
                experience,
              })
            );
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "experience not found" }));
          }
        }
      } else {
        console.error("Token verification failed");
        const tokenExistIndex = tokenData.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        if (tokenExistIndex !== -1) {
          tokenData.splice(tokenExistIndex, 1);
        }
        console.log("User logged out");
        console.error(
          "from update education user profile Token verification failed"
        );

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authorized",
          })
        );
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
}
// delete the experience
function deleteExperiences(req, res, experienceId) {
  const DeleteIdToUpdate = experienceId;
  console.log("DeleteIdToUpdate:" + DeleteIdToUpdate);

  try {
    const expIndex = experience.findIndex((user) => {
      if (user.expId === DeleteIdToUpdate) return user.expId;
    });
    console.log(expIndex);
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];
    console.log(token);
    const verified = verifyToken1(token);
    console.log("verified token", verified);
    //  find user from token session table
    if (verified != null) {
      const tokenExist = tokenData.find((user) => {
        if (user.username === verified.email && user.token === token) {
          return true;
        }
      });
      // if user exist in token table
      if (tokenExist) {
        if (expIndex !== -1) {
          experience.splice(expIndex, 1);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "experience deleted successfully",
              experience,
            })
          );
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Education not found" }));
        }
      }
    } else {
      console.error("Token verification failed");
      const tokenExistIndex = tokenData.findIndex(
        (user) => user.token === token
      );

      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");
      console.error(
        "from  delete experience user profile Token verification failed"
      );

      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: " User Not Authorized",
        })
      );
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
// logout user and admin
function logout(req, res) {
  try {
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];

    const verified = verifyToken1(token);
    console.log("verified token", verified);
    if (verified !== null) {
      const tokenExistIndex = tokenData.findIndex((user) => {
        return user.username === verified.email && user.token === token;
      });
      console.log("results", tokenExistIndex);
      if (tokenExistIndex !== -1) {
        tokenData.splice(tokenExistIndex, 1);
      }
      console.log("User logged out");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User logged out ", tokenData }));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found " }));
    }
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "invalid json " }));
  }
}

// token showing

function tokenshow(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(tokenData));
    res.end();
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.write(JSON.stringify(error));
    res.end();
  }
}
export {
  handleSignup,
  handleLogin,
  showUserProfile,
  addUser,
  updateUserRole,
  deleteUserByAdmin,
  showProjects,
  addProject,
  deleteProject,
  updateProject,
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
  logout,
  tokenshow,
};
