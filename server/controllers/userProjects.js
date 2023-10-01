import sql from "msnodesqlv8";
import { v4 as uuidv4 } from "uuid";
import { data } from "../index.js";
import { connectionString as con } from "../config/config.js";
import maskText from "../Utility/utilit.js";
// show projects list
function showProjects(req, res) {
  console.log("user Token", data);
  if (data && data.role === "user") {
    console.log(req.url);
    const search = req.url.split("=")[1];
    console.log("search", search);
    const searchQuery = search || "";
    const findProjectQuery = `
    SELECT *
    FROM Projects
    JOIN Users ON Projects.user_id = Users.ID
    WHERE 
      (
        title LIKE '%${searchQuery}%'
        OR description LIKE '%${searchQuery}%'
        OR tags LIKE '%${searchQuery}%'
        OR technology LIKE '%${searchQuery}%'
        OR languages LIKE '%${searchQuery}%'
      ) 
      AND Projects.user_id = '${data.ID}'
  `;

    sql.query(con, findProjectQuery, (err, insertResult) => {
      if (err) {
        console.error("Error in finding projects", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Project not found",
            err,
          })
        );
      } else {
        if (insertResult.length === 0) {
          res.end(
            JSON.stringify({
              message: "No projects found.",
            })
          );
          return;
        }
        if (insertResult.length === 0) {
          res.writeHead(204, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Project not found" }));
          return;
        }
        console.log("Projects found successfully");

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Successfully found projects",
            insertResult,
          })
        );
      }
    });
  } else {
    const search = req.url.split("=")[1];
    console.log("search", search);
    const searchQuery = search || "";
    const findProjectQuery = `
      SELECT *
      FROM Projects
      WHERE
        (
          title LIKE '%${searchQuery}%'
          OR description LIKE '%${searchQuery}%'
          OR tags LIKE '%${searchQuery}%'
          OR technology LIKE '%${searchQuery}%'
          OR languages LIKE '%${searchQuery}%'
        )
    `;

    sql.query(con, findProjectQuery, (err, Result) => {
      if (err) {
        console.error("Error in finding projects", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Project not found",
            err,
          })
        );
        return;
      }
      if (Result.length === 0) {
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Project not found" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(Result));
    });
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
      console.log(newUserProject);
      const userInputFields = [
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
        res.writeHead(204, { "Content-Type": "application/json" });
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
        //find user query

        const projectId = uuidv4();
        console.log(projectId);
        const { title, description, img, languages, tags, technology } =
          newUserProject;

        const allowedRegextitle = /[^a-zA-Z0-9\s ]/g;
        const AfterMaskingetitle = maskText(title, allowedRegextitle);
        const allowedRegexdescription = /[^A-Za-z0-9._#@\s/-]/g;
        const AfterMaskingedescription = maskText(
          description,
          allowedRegexdescription
        );
        const allowedRegexlanguages = /[^a-zA-Z\s,#]/g;
        const AfterMaskingelanguages = maskText(
          languages,
          allowedRegexlanguages
        );
        const allowedRegextags = /[^a-zA-Z\s,#]/g;
        const AfterMaskingetags = maskText(tags, allowedRegextags);
        const allowedRegextechnology = /[^a-zA-Z\s,#]/g;
        const AfterMaskingetechnology = maskText(
          languages,
          allowedRegextechnology
        );

        console.log("AfterMaskingetitle: ", AfterMaskingetitle);
        console.log("AfterMaskingedescription: ", AfterMaskingedescription);
        console.log("AfterMaskingelanguages: ", AfterMaskingelanguages);
        console.log("AfterMaskingetags: ", AfterMaskingetags);
        console.log("AfterMaskingetechnology: ", AfterMaskingetechnology);

        if (
          AfterMaskingetitle &&
          AfterMaskingedescription &&
          AfterMaskingelanguages &&
          AfterMaskingetags &&
          AfterMaskingetechnology
        ) {
          const insertProjectQuery = `
        INSERT INTO projects (ID, user_id, title, description, img, languages, tags, technology)
        VALUES ('${projectId}', '${data.ID}', '${title}', '${description}', CONVERT(VARBINARY(MAX), '${img}'), '${languages}', '${tags}', '${technology}')
      `;

          sql.query(con, insertProjectQuery, (err, insertResult) => {
            if (err) {
              console.log("project not added", err);
              // res.writeHead(400, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "project not added	",
                })
              );
            } else {
              console.log(insertResult);
              console.log("project added successfully");

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "successfully project added	",
                })
              );
            }
          });
        } else {
          res.writeHead(493, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "successfully  project not added",
              AfterMaskingetitle: AfterMaskingetitle,
              AfterMaskingedescription: AfterMaskingedescription,
              AfterMaskingelanguages: AfterMaskingelanguages,
              AfterMaskingetags: AfterMaskingetags,
              AfterMaskingetechnology: AfterMaskingetechnology,
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
    const projectDeleteQuery = `DELETE FROM Projects WHERE id='${projectIdToDelete}' AND user_id= '${data.ID}'`;
    sql.query(con, projectDeleteQuery, (err, result) => {
      if (err) {
        console.log("project delete query failed");
        res.end(
          JSON.stringify({ MESSEGE: "project delete query failed", err })
        );
        return;
      }
      console.log("Project deleted successfully");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "project deleted successfully", result })
      );
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON data" }));
  }
}
// update project
function updateProject(req, res, projectId) {
  const ID = projectId;

  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const updatedInfo = JSON.parse(requestBody);

      const userInputFields = [
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
      const { title, description, img, tags, languages, technology } =
        updatedInfo;

      const allowedRegextitle = /[^a-zA-Z0-9\s ]/g;
      const AfterMaskingetitle = maskText(title, allowedRegextitle);
      const allowedRegexdescription = /[^A-Za-z0-9._#@\s/-]/g;
      const AfterMaskingedescription = maskText(
        description,
        allowedRegexdescription
      );
      const allowedRegexlanguages = /[^a-zA-Z\s,#]/g;
      const AfterMaskingelanguages = maskText(languages, allowedRegexlanguages);
      const allowedRegextags = /[^a-zA-Z\s,#]/g;
      const AfterMaskingetags = maskText(tags, allowedRegextags);
      const allowedRegextechnology = /[^a-zA-Z\s,#]/g;
      const AfterMaskingetechnology = maskText(
        languages,
        allowedRegextechnology
      );

      console.log("AfterMaskingetitle: ", AfterMaskingetitle);
      console.log("AfterMaskingedescription: ", AfterMaskingedescription);
      console.log("AfterMaskingelanguages: ", AfterMaskingelanguages);
      console.log("AfterMaskingetags: ", AfterMaskingetags);
      console.log("AfterMaskingetechnology: ", AfterMaskingetechnology);

      if (
        AfterMaskingetitle &&
        AfterMaskingedescription &&
        AfterMaskingelanguages &&
        AfterMaskingetags &&
        AfterMaskingetechnology
      ) {
        let projectUpdateQuery = `UPDATE Projects SET`;
        if (title) {
          projectUpdateQuery += ` title='${title}',`;
        }
        if (description) {
          projectUpdateQuery += ` description='${description}',`;
        }
        if (img) {
          projectUpdateQuery += ` img='${img}',`;
        }
        if (tags) {
          projectUpdateQuery += ` tags='${tags}',`;
        }
        if (languages) {
          projectUpdateQuery += ` languages='${languages}',`;
        }
        if (technology) {
          projectUpdateQuery += ` technology='${technology}',`;
        }
        if (projectUpdateQuery.endsWith(",")) {
          projectUpdateQuery = projectUpdateQuery.slice(0, -1);
        }
        projectUpdateQuery += ` WHERE ID = '${ID}' AND user_id = '${data.ID}'`;
        sql.query(con, projectUpdateQuery, (error, result) => {
          if (error) {
            console.log("error", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Error updating the project.",
                error,
              })
            );
          } else {
            console.log("project updated success", result);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Project updated successfully" })
            );
          }
        });
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "  project not Updated",
            AfterMaskingetitle: AfterMaskingetitle,
            AfterMaskingedescription: AfterMaskingedescription,
            AfterMaskingelanguages: AfterMaskingelanguages,
            AfterMaskingetags: AfterMaskingetags,
            AfterMaskingetechnology: AfterMaskingetechnology,
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

export { addProject, deleteProject, showProjects, updateProject };
