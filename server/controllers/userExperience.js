import sql from "msnodesqlv8";
import { v4 as uuidv4 } from "uuid";
import { data } from "../index.js";
import { connectionString as con } from "../config/config.js";
import maskText from "../Utility/utilit.js";
// show Experience
function showExperience(req, res) {
  try {
    const showEducationquery = `SELECT * FROM Experience WHERE user_id ='${data.ID}'`;
    sql.query(con, showEducationquery, (err, result) => {
      if (err) {
        console.log("error from sql query experience", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "error from sql query experience ", err })
        );
        return;
      }
      if (result.length === 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "record not found", result }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(result));
      res.end();
    });
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

      const userInputFields = ["position", "company", "startDate", "endDate"];
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

      if (
        new Date(newExperience.startDate) >= new Date(newExperience.endDate)
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Start date must be before end date",
          })
        );
        return;
      }
      const expId = uuidv4();
      const { position, company, startDate, endDate } = newExperience;
      const allowedRegexposition = /[^a-zA-Z0-9\s ]/g;
      const AfterMaskingeposition = maskText(position, allowedRegexposition);
      const allowedRegexcompany = /[^A-Za-z0-9._#@\s/-]/g;
      const AfterMaskingecompany = maskText(company, allowedRegexcompany);
      const allowedRegexstartDate = /[^0-9-]/g;
      const AfterMaskingestartDate = maskText(startDate, allowedRegexstartDate);
      const allowedRegexendDate = /[^0-9-]/g;
      const AfterMaskingeendDate = maskText(endDate, allowedRegexendDate);

      console.log("AfterMaskingeposition: ", AfterMaskingeposition);
      console.log("AfterMaskingecompany: ", AfterMaskingecompany);
      console.log("AfterMaskingestartDate: ", AfterMaskingestartDate);
      console.log("AfterMaskingeendDate: ", AfterMaskingeendDate);

      if (
        AfterMaskingeposition &&
        AfterMaskingecompany &&
        AfterMaskingestartDate &&
        AfterMaskingeendDate
      ) {
        const insertQuery = `
            INSERT INTO Experience (ID, user_id, position, company, startDate, endDate)
            VALUES ('${expId}', '${data.ID}', '${position}', '${company}', '${startDate}', '${endDate}')
          `;

        sql.query(con, insertQuery, (err, result) => {
          if (err) {
            console.log("error in insert query of education: " + err.message);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "error in insert query in experience file",
                err,
              })
            );
            return;
          }
          console.log("experience added successfully");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "user added experience successfully",
            })
          );
        });
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "   Experience not added",
            AfterMaskingeposition: AfterMaskingeposition,
            AfterMaskingecompany: AfterMaskingecompany,
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
// update experience
function updateExperience(req, res, ID) {
  let requestBody = "";
  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const updatedInfo = JSON.parse(requestBody);
      const userInputFields = ["position", "company", "startDate", "endDate"];
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

      if (new Date(updatedInfo.startDate) >= new Date(updatedInfo.endDate)) {
        res.end(
          JSON.stringify({
            message: "Start date must be before end date",
          })
        );
        return;
      }
      const { position, company, startDate, endDate } = updatedInfo;

      const allowedRegexposition = /[^a-zA-Z0-9\s ]/g;
      const AfterMaskingeposition = maskText(position, allowedRegexposition);
      const allowedRegexcompany = /[^A-Za-z0-9._#@\s/-]/g;
      const AfterMaskingecompany = maskText(company, allowedRegexcompany);
      const allowedRegexstartDate = /[^0-9-]/g;
      const AfterMaskingestartDate = maskText(startDate, allowedRegexstartDate);
      const allowedRegexendDate = /[^0-9-]/g;
      const AfterMaskingeendDate = maskText(endDate, allowedRegexendDate);

      console.log("AfterMaskingeposition: ", AfterMaskingeposition);
      console.log("AfterMaskingecompany: ", AfterMaskingecompany);
      console.log("AfterMaskingestartDate: ", AfterMaskingestartDate);
      console.log("AfterMaskingeendDate: ", AfterMaskingeendDate);

      if (
        AfterMaskingeposition &&
        AfterMaskingecompany &&
        AfterMaskingestartDate &&
        AfterMaskingeendDate
      ) {
        let experienceUpdateQuery = `UPDATE Experience SET`;
        if (position) {
          experienceUpdateQuery += ` position='${position}',`;
        }
        if (company) {
          experienceUpdateQuery += ` company='${company}',`;
        }
        if (startDate) {
          experienceUpdateQuery += ` startDate='${startDate}',`;
        }
        if (endDate) {
          experienceUpdateQuery += ` endDate='${endDate}',`;
        }

        if (experienceUpdateQuery.endsWith(",")) {
          experienceUpdateQuery = experienceUpdateQuery.slice(0, -1);
        }
        experienceUpdateQuery += ` WHERE ID = '${ID}' AND user_id='${data.ID}'`;
        sql.query(con, experienceUpdateQuery, (error, result) => {
          if (error) {
            console.log("error", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Error updating the Experience.",
                error,
              })
            );
          } else {
            console.log("Experience updated success", result);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Experience updated successfully" })
            );
          }
        });
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Experience not Updated",
            AfterMaskingeposition: AfterMaskingeposition,
            AfterMaskingecompany: AfterMaskingecompany,
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
// delete the experience
function deleteExperiences(req, res, ID) {
  try {
    const deleteExperienceQuery = `DELETE FROM Experience WHERE ID='${ID}' AND user_id='${data.ID}'`;
    sql.query(con, deleteExperienceQuery, (err, result) => {
      if (err) {
        console.log("error deleting", err);
        res.writeHead(400, { "Content-Type": "application" });
        res.end(JSON.stringify({ message: "Experience not Deleted" }));
        return;
      } else {
        res.writeHead(200, { "Content-Type": "application" });
        res.end(JSON.stringify({ message: "Experience Deleted Successfully" }));
      }
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
export { showExperience, addExperience, updateExperience, deleteExperiences };
