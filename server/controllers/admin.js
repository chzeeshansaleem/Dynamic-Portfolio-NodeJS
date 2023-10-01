import { data } from "../index.js";
import { connectionString as con } from "../config/config.js";
import sql from "msnodesqlv8";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import maskText from "../Utility/utilit.js";

// show user profile on admin pannel
function showUserProfile(req, res) {
  console.log(req.url);
  const search = req.url.split("=")[1];
  const searchQuery = search || "";

  try {
    const countQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS userCount, 
        (SELECT COUNT(*) FROM users WHERE role = 'admin') AS adminCount
    `;

    sql.query(con, countQuery, (err, countResult) => {
      if (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(err));
        return;
      }

      let showUserQuery = `SELECT ID, name, email, role FROM users WHERE ID <> '${data.ID}'`;

      if (searchQuery) {
        showUserQuery += ` AND (name LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%' OR phone LIKE '%${searchQuery}%')`;
      }

      sql.query(con, showUserQuery, (err, userResult) => {
        if (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(err));
          return;
        }
        console.log(countResult);
        const totalUsers = countResult[0].userCount + countResult[0].adminCount;

        const response = {
          userCount: countResult[0].userCount,
          adminCount: countResult[0].adminCount,
          totalUsers,
          userData: userResult,
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      });
    });
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
      const allowedRegexName = /[^a-zA-Z\s]/g;
      const AfterMaskingeName = maskText(newUser.name, allowedRegexName);
      const allowedRegexUser = /[^user|admin]/i;
      const AfterMaskingeUser = maskText(newUser.role, allowedRegexUser);

      console.log("AfterMaskingeMail: ", AfterMaskingeMail);
      console.log("AfterMaskingeName: ", AfterMaskingeName);
      console.log("AfterMaskingeUser: ", AfterMaskingeUser);
      console.log(requestBody);
      if (AfterMaskingeMail && AfterMaskingeName && AfterMaskingeUser) {
        const userId = uuidv4();
        const { name, email, password, role } = newUser;
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            console.log("error hashing password");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "error hashing password", err }));
            return;
          }
          console.log("hash password", hash);
          const adduserQuery = `INSERT INTO Users (ID, name, email, password, role) VALUES ('${userId}', '${name}', '${email}', '${hash}', '${role}')`;
          sql.query(con, adduserQuery, (err, result) => {
            if (err) {
              console.log("err from insert user");
              res.writeHead(493, { "Content-Type": "application" });
              res.end(JSON.stringify({ message: "err from insert user", err }));
              return;
            }
            res.writeHead(200, { "Content-Type": "application" });
            res.end(
              JSON.stringify({ message: " Add user by admin successfully " })
            );
          });
        });
      } else {
        console.log("error in masking wrong entry");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Please send correct data" }));
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
  const ID = userId;
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
      const allowedRegexUser = /[^user|admin]/i;
      const AfterMaskingeUser = maskText(newRole, allowedRegexUser);

      console.log("AfterMaskingeUser: ", AfterMaskingeUser);
      if (AfterMaskingeUser) {
        const queryForUpdateRole = `UPDATE Users SET role='${newRole}' WHERE ID='${ID}'`;
        sql.query(con, queryForUpdateRole, (err, result) => {
          if (err) {
            console.log("error from user update");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify("error from user update"));
            return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User role updated successfully",
            })
          );
        });
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Please enter coreect data" }));
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
    const findUserByAdmin = `SELECT ID FROM Users WHERE email = '${profileIdToDelete}'`;
    sql.query(con, findUserByAdmin, (err, result) => {
      if (err) {
        console.log("find user by admin err", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "find user by admin err", err }));
      }
      console.log(result);
      const userId = result[0].ID;
      console.log(userId);
      const tokenquery = `DELETE FROM tokenSession WHERE user_id='${userId}'`;
      const experiencequery = `DELETE FROM Experience WHERE user_id='${userId}'`;
      const educationquery = `DELETE FROM Education WHERE user_id='${userId}'`;
      const projectquery = `DELETE FROM Projects WHERE user_id='${userId}'`;
      const userquery = `DELETE FROM Users WHERE ID='${userId}'`;

      sql.query(con, tokenquery, (err, result) => {
        if (err) {
          console.log("error from token delete query");
        }
        console.log("token deleted");
      });
      sql.query(con, experiencequery, (err, result) => {
        if (err) {
          console.log("error from experience query delete query");
        }
        console.log("experience query deleted");
      });
      sql.query(con, educationquery, (err, result) => {
        if (err) {
          console.log("error from education query delete query");
        }
        console.log("education query deleted");
      });
      sql.query(con, projectquery, (err, result) => {
        if (err) {
          console.log("error from project delete query");
        }
        console.log("project query deleted");
      });
      sql.query(con, userquery, (err, result) => {
        if (err) {
          console.log("error from user delete query");
        }
        console.log("user  deleted");
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "all data deleted from admin action" })
      );
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
export {
  showUserProfile,
  addUser,
  updateUserRole,
  deleteUserByAdmin,
  maskText,
};
