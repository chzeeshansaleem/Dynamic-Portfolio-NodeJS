import { v4 as uuidv4 } from "uuid";
import sql from "msnodesqlv8";
import { connectionString as con } from "../config/config.js";
import { data } from "../index.js";
import maskText from "../Utility/utilit.js";
// show education in profile
function showEducation(req, res) {
  try {
    console.log("Data email: " + data.email);

    const showEducationQuery = `SELECT * FROM  Education WHERE user_id='${data.ID}'`;
    sql.query(con, showEducationQuery, (err, result) => {
      if (err) {
        console.log("error from sql query show education query", err);
        res.writeHead(500, { "Content-Type": "application/json" });

        res.end(
          JSON.stringify({
            message: "error from sql query show education query",
          })
        );
        return;
      }
      if (result.length === 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "record not found", result }));
        return;
      }
      console.log("education show successfully");
      res.writeHead(200, { "Content-Type": "application/json" });
      // res.write(JSON.stringify(result));
      res.end(JSON.stringify({ message: "record found", result }));
    });
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
      const userInputFields = ["degree", "university", "startDate", "endDate"];
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
      if (new Date(newUser.startDate) >= new Date(newUser.endDate)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Start date must be before end date",
          })
        );
        return;
      }
      const { degree, university, startDate, endDate } = newUser;
      const allowedRegexdegree = /[^a-zA-Z0-9\s ]/g;
      const AfterMaskingedegree = maskText(degree, allowedRegexdegree);
      const allowedRegexuniversity = /[^A-Za-z0-9._#@\s/-]/g;
      const AfterMaskingeuniversity = maskText(
        university,
        allowedRegexuniversity
      );
      const allowedRegexstartDate = /[^0-9-]/g;
      const AfterMaskingestartDate = maskText(startDate, allowedRegexstartDate);
      const allowedRegexendDate = /[^0-9-]/g;
      const AfterMaskingeendDate = maskText(endDate, allowedRegexendDate);

      console.log("AfterMaskingedegree: ", AfterMaskingedegree);
      console.log("AfterMaskingeuniversity: ", AfterMaskingeuniversity);
      console.log("AfterMaskingestartDate: ", AfterMaskingestartDate);
      console.log("AfterMaskingeendDate: ", AfterMaskingeendDate);

      if (
        AfterMaskingedegree &&
        AfterMaskingeuniversity &&
        AfterMaskingestartDate &&
        AfterMaskingeendDate
      ) {
        const eduId = uuidv4();
        const insertQuery = `
            INSERT INTO Education (ID, user_id, degree, university, startDate, endDate)
            VALUES ('${eduId}', '${data.ID}', '${degree}', '${university}', '${startDate}', '${endDate}')
          `;

        sql.query(con, insertQuery, (err, insertResult) => {
          if (err) {
            console.log("error in insert query of education: " + err.message);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "error in insert query in education file",
                err,
              })
            );
            return;
          }
          console.log("education added successfully");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "user added education successfully",
            })
          );
        });
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "   Education not added",
            AfterMaskingedegree: AfterMaskingedegree,
            AfterMaskingeuniversity: AfterMaskingeuniversity,
            AfterMaskingestartDate: AfterMaskingestartDate,
            AfterMaskingeendDate: AfterMaskingeendDate,
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
  const ID = EducationId;
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const updatedInfo = JSON.parse(requestBody);

      const userInputFields = ["degree", "university", "startDate", "endDate"];
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
      if (new Date(updatedInfo.startDate) >= new Date(updatedInfo.endDate)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Start date must be before end date",
          })
        );
        return;
      }
      const { degree, university, startDate, endDate } = updatedInfo;

      const allowedRegexdegree = /[^a-zA-Z0-9\s ]/g;
      const AfterMaskingedegree = maskText(degree, allowedRegexdegree);
      const allowedRegexuniversity = /[^A-Za-z0-9._#@\s/-]/g;
      const AfterMaskingeuniversity = maskText(
        university,
        allowedRegexuniversity
      );
      const allowedRegexstartDate = /[^0-9-]/g;
      const AfterMaskingestartDate = maskText(startDate, allowedRegexstartDate);
      const allowedRegexendDate = /[^0-9-]/g;
      const AfterMaskingeendDate = maskText(endDate, allowedRegexendDate);

      console.log("AfterMaskingedegree: ", AfterMaskingedegree);
      console.log("AfterMaskingeuniversity: ", AfterMaskingeuniversity);
      console.log("AfterMaskingestartDate: ", AfterMaskingestartDate);
      console.log("AfterMaskingeendDate: ", AfterMaskingeendDate);

      if (
        AfterMaskingedegree &&
        AfterMaskingeuniversity &&
        AfterMaskingestartDate &&
        AfterMaskingeendDate
      ) {
        let EducationUpdateQuery = `UPDATE Education SET`;
        if (degree) {
          EducationUpdateQuery += ` degree='${degree}',`;
        }
        if (university) {
          EducationUpdateQuery += ` university='${university}',`;
        }
        if (startDate) {
          EducationUpdateQuery += ` startDate='${startDate}',`;
        }
        if (endDate) {
          EducationUpdateQuery += ` endDate='${endDate}',`;
        }

        if (EducationUpdateQuery.endsWith(",")) {
          EducationUpdateQuery = EducationUpdateQuery.slice(0, -1);
        }
        EducationUpdateQuery += ` WHERE ID = '${ID}' AND user_id='${data.ID}'`;
        sql.query(con, EducationUpdateQuery, (error, result) => {
          if (error) {
            console.log("error", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Error updating the Education.",
                error,
              })
            );
          } else {
            console.log("Education updated success", result);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Education updated successfully" })
            );
          }
        });
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "   Education not Updated",
            AfterMaskingedegree: AfterMaskingedegree,
            AfterMaskingeuniversity: AfterMaskingeuniversity,
            AfterMaskingestartDate: AfterMaskingestartDate,
            AfterMaskingeendDate: AfterMaskingeendDate,
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
function deleteEducation(req, res, ID) {
  try {
    const deleteEducationQuery = `DELETE FROM Education WHERE ID='${ID}' AND user_id='${data.ID}'`;
    sql.query(con, deleteEducationQuery, (err, result) => {
      if (err) {
        console.log("error deleting", err);
        res.writeHead(400, { "Content-Type": "application" });
        res.end(JSON.stringify({ message: "Education not Deleted" }));
        return;
      } else {
        res.writeHead(200, { "Content-Type": "application" });
        res.end(JSON.stringify({ message: "Education Deleted Successfully" }));
      }
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
export { addEduactionOfUser, showEducation, deleteEducation, updateEducation };
