import jwt from "jsonwebtoken";
import "dotenv/config";
const secretKey = process.env.SECRET_KEY;
import { connectionString as con } from "../config/config.js";
import sql from "msnodesqlv8";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import maskText from "../Utility/utilit.js";

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
        newUser.email === ""
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
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailPattern.test(newUser.email)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Please enter valid email" }));
        return;
      }
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
        const showUserQuery = `select * from Users`;

        sql.query(con, showUserQuery, (err, result) => {
          if (err) {
            console.log("Database signup error: ", err);
            return;
            // Handle the error
          }

          //console.log("SQL QUeryy results: ", result);
          console.log("User show successful");

          const userExistsIndex = result.find((user) => {
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
            const user_Id = uuidv4();

            const { name, email, password, role } = newUser;
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function (err, hash) {
              if (err) {
                console.log("error hashing password");
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: "error hashing password", err })
                );
                return;
              }
              const SignUpQuery = `
              INSERT INTO Users (ID, email, password, name, role)
              VALUES ('${user_Id}', '${email}', '${hash}', '${name}', '${role}')
             `;

              sql.query(con, SignUpQuery, (err, result) => {
                if (err) {
                  console.log("Database signup error: ", err);
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ MESSAGE: "User sign up unsuccessful" })
                  );
                  return;
                  // Handle the error
                } else {
                  console.log(result);
                  console.log("User sign up successful");
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ MESSAGE: "User sign up successful" })
                  );
                }
              });
            });
          }
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

      // Remove extra entries
      for (const key in loginUser) {
        if (!userInputFields.includes(key)) {
          delete loginUser[key];
        }
      }

      if (!loginUser.email || !loginUser.password) {
        console.log("All fields required");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "All fields required",
          })
        );
        return;
      }
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailPattern.test(loginUser.email)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Please enter valid email" }));
        return;
      }
      console.log(loginUser);
      // Sql Query for check user exist or not
      const allowedRegexMail = /[^a-zA-Z0-9@.]/g;
      const AfterMaskingeMail = maskText(loginUser.email, allowedRegexMail);

      console.log("AfterMaskingeMail: ", AfterMaskingeMail);

      console.log(requestBody);
      if (AfterMaskingeMail) {
        const showUserQuery = `SELECT * FROM Users`;

        sql.query(con, showUserQuery, async (err, result) => {
          if (err) {
            console.log("Database login error: ", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Database error" }));
          }

          // console.log("SQL Query results: ", result);

          const user = result.find((u) => u.email === loginUser.email);

          if (user) {
            const isPasswordMatch = await bcrypt.compare(
              loginUser.password,
              user.password
            );
            console.log("ispasswordMatch", isPasswordMatch);
            if (isPasswordMatch) {
              console.log("Login successful");

              if (user.role === "admin") {
                const Admintoken = jwt.sign(
                  { email: user.email, role: user.role, ID: user.ID },
                  secretKey,
                  {
                    expiresIn: "30m",
                  }
                );

                const user_Id = uuidv4();

                const { ID } = user;
                console.log(ID);
                // Token insert in tokensessions table
                const tokenQuery = `
                  INSERT INTO tokenSession (ID, user_Id, token)
                  VALUES ('${user_Id}', '${ID}', '${Admintoken}')
                `;

                sql.query(con, tokenQuery, (err, result) => {
                  if (err) {
                    console.log("Database Token error: ", err);
                    //  res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({ MESSAGE: "Token not saved", err })
                    );
                    return;
                  }

                  console.log("Token saved successfully");
                  // res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      MESSAGE: "Token saved successfully",
                      result,
                    })
                  );
                });

                res.writeHead(222, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Admin Login Successfully",
                    Admintoken,
                    user,
                  })
                );
              } else if (user.role === "user") {
                const token = jwt.sign(
                  { email: user.email, role: user.role, ID: user.ID },
                  secretKey,
                  {
                    expiresIn: "30m",
                  }
                );

                const { ID } = user;
                const user_Id = uuidv4();

                // Token insert in tokensessions table
                const tokenQuery = `
                  INSERT INTO tokenSession (ID, user_Id, token)
                  VALUES ('${user_Id}', '${ID}', '${token}')
                `;

                sql.query(con, tokenQuery, (err, result) => {
                  if (err) {
                    console.log("Database user Token error: ", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({ MESSAGE: "Token not saved", err })
                    );
                  }

                  console.log(result);
                  console.log("User Token saved successfully");
                  //   res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      MESSAGE: "User Token saved successfully",
                      result,
                    })
                  );
                });
                // res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "User Login successful",
                    token,
                    user,
                  })
                );
              }
            } else {
              console.log("user login failed du to password invalid");
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

// logout user and admin
function logout(req, res) {
  try {
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];

    const tokenDeleteQuery = `DELETE FROM tokenSession WHERE token='${token}'`;
    sql.query(con, tokenDeleteQuery, (err, result) => {
      if (err) {
        console.log("token not deleted from logout", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "token not deleted from logout", err })
        );
        return;
      }
      console.log("token  deleted from DB on logout Click");
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "token  deleted from DB on logout Click" })
      );
    });
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "invalid json " }));
  }
}

export { handleSignup, handleLogin, logout };
