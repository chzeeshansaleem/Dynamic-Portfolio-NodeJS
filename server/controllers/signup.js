import jwt from "jsonwebtoken";
import users from "../server/db/user.json" assert { type: "json" };

const secretKey = process.env.SECRET_KEY;

export default function handleSignup(req, res) {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const newUser = JSON.parse(requestBody);
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
