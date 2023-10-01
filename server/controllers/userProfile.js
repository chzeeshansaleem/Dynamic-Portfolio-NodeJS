import users from "../../server/db/user.json" assert { type: "json" };
import "dotenv/config";
import { data } from "../index.js";
import { connectionString as con } from "../config/config.js";
import sql from "msnodesqlv8";
import maskText from "../Utility/utilit.js";

// update profile by user
function updateProfileByUser(req, res, userId) {
  const ID = userId;
  let requestBody = "";
  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const updatedInfo = JSON.parse(requestBody);
      const userInputFields = ["name", "phoneNumber", "skills"];
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

      if (
        updatedInfo.name === "" ||
        updatedInfo.email === "" ||
        updatedInfo.phoneNumber === "" ||
        updatedInfo.skills === ""
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

      const { name, phoneNumber, skills } = updatedInfo;
      console.log(updatedInfo);

      const allowedRegexname = /[^a-zA-Z\s ]/g;
      const AfterMaskingename = maskText(name, allowedRegexname);
      //  const allowedRegexemail = /[^A-Za-z0-9.@]/g;
      //  const AfterMaskingeemail = maskText(email, allowedRegexemail);
      const allowedRegexphoneNumber = /[^0-9]/g;
      const AfterMaskingephoneNumber = maskText(
        phoneNumber,
        allowedRegexphoneNumber
      );
      const allowedRegexskills = /[^a-zA-Z#,+\s]/g;
      const AfterMaskingeskills = maskText(skills, allowedRegexskills);

      console.log("AfterMaskingename: ", AfterMaskingename);
      //   console.log("AfterMaskingeemail: ", AfterMaskingeemail);
      console.log("AfterMaskingephoneNumber: ", AfterMaskingephoneNumber);
      console.log("AfterMaskingeskills: ", AfterMaskingeskills);

      if (
        AfterMaskingename &&
        AfterMaskingephoneNumber &&
        AfterMaskingeskills
      ) {
        const checkUserQuery = `SELECT ID FROM Users WHERE ID = '${ID}'`;

        sql.query(con, checkUserQuery, (error, checkUserResult) => {
          if (error) {
            console.log("error", error);
            // Handle the error
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
            return;
          }

          if (checkUserResult.length === 0) {
            // User not found
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
          } else {
            let profileUpdateQuery = `UPDATE Users SET`;

            if (name) {
              profileUpdateQuery += ` name = '${name}',`;
            }

            if (phoneNumber) {
              profileUpdateQuery += ` phone = '${phoneNumber}',`;
            }

            if (skills) {
              profileUpdateQuery += ` skill = '${skills}',`;
            }
            if (profileUpdateQuery.endsWith(",")) {
              profileUpdateQuery = profileUpdateQuery.slice(0, -1);
            }
            profileUpdateQuery += ` WHERE ID = '${ID}'`;
            sql.query(con, profileUpdateQuery, (error, result) => {
              if (error) {
                console.log("error", error);
              }
              console.log("profile updated success", result);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "User updated successfully" }));
            });
          }
        });
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "   Profile not Updated",
            AfterMaskingename: AfterMaskingename,
            AfterMaskingephoneNumber: AfterMaskingephoneNumber,
            AfterMaskingeskills: AfterMaskingeskills,
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
// show user profile
function showUserForProfile(req, res) {
  try {
    const checkUserQuery = `SELECT * FROM Users`;

    sql.query(con, checkUserQuery, (error, result) => {
      if (error) {
        console.log("error", error);
        // Handle the error
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
      }
      const currentUser = result.filter((user) => user.email === data.email);
      console.log(currentUser);
      const userDataToSend = currentUser.map((user) => {
        const { ID, email, name, phone, role, skill } = user;
        return { ID, email, name, phone, role, skill };
      });
      console.log(userDataToSend);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(userDataToSend));
    });
  } catch (error) {
    console.log(error);
  }
}
export { updateProfileByUser, showUserForProfile };
