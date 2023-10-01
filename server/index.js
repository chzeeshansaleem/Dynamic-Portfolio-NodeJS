import http from "http";
import "dotenv/config";
import url from "url";
import { routes } from "./routes/routes.js";
import { setToken, getToken, verifyToken1 } from "./Authentication/verify.js";
//import tokenData from "./db/tokenSession.json" assert { type: "json" };
const port = process.env.PORT || 8000;
export var data;
import {
  createDatabase,
  connectionWithDB,
  connectionString as con,
} from "./config/config.js";
import sql from "msnodesqlv8";
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,Authentication"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  console.log("pathname: ", pathname);

  if (pathname === "/login" || pathname === "/signup") {
    // If it's a login or signup route, no token verification is required
    const id2 = pathname.split("/");
    //  console.log(id2.length);
    //console.log("total paths: " + id2);

    // route for get and post
    const route = routes.find(
      (r) => r.path === `/${id2[1]}` && r.method === req.method
    );

    // route1 for update and delete
    const route1 = routes.find(
      (r) => r.path === `/${id2[1]}/` && r.method === req.method
    );

    if (route) {
      route.handler(req, res);
    } else if (route1) {
      route1.handler(req, res, id2[2]);
    } else {
      console.log("page not found from routes");
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } else {
    const token1 = req.headers["authorization"];
    const token = token1.split(" ")[1];
    console.log("token from index: " + token);
    const tokenVerified = verifyToken1(token);

    // token insert in tokensessions table
    const tokengetQuery = `select * from tokensession`;

    sql.query(con, tokengetQuery, (err, result) => {
      if (err) {
        console.log("Database Token error: ", err);
        // Handle the error
        res.end(JSON.stringify({ MESSAGE: "Token not save  ", err }));
      }

      console.log("Token get successfully");
      if (tokenVerified != null) {
        const tokenExist = result.findIndex((user) => {
          user.username === tokenVerified.email && user.token === token;
        });
        console.log(tokenExist);
        // if user exist in token table
        if (tokenExist !== -1) {
          const id2 = pathname.split("/");
          // console.log(id2.length);
          //console.log("total paths: " + id2);

          // route for get and post
          const route = routes.find(
            (r) => r.path === `/${id2[1]}` && r.method === req.method
          );

          // route1 for update and delete
          const route1 = routes.find(
            (r) => r.path === `/${id2[1]}/` && r.method === req.method
          );

          if (route) {
            route.handler(req, res);
          } else if (route1) {
            route1.handler(req, res, id2[2]);
          } else {
            console.log("page not found from routes");
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
          }
        }
        // else {
        //   // table ma nai ha per token ka time ha
        //   console.log("User logged out");
        //   console.error("from  show user profile Token verification failed");

        //   res.writeHead(403, { "Content-Type": "application/json" });
        //   res.end(
        //     JSON.stringify({
        //       message: " User Not Authorized",
        //     })
        //   );
        // }
      } else {
        const tokenExistIndex = result.findIndex(
          (user) => user.token === token
        );

        console.log("results", tokenExistIndex);
        // delete token from table
        const deletetokenQuery = `DELETE FROM tokensession WHERE token = '${token}'`;
        sql.query(con, deletetokenQuery, (err, results) => {
          if (err) {
            console.log("error from token delete", err);
          }
          console.log("token deleted", results);
        });
        console.log("User logged out");
        console.error("from  show user profile Token verification failed");

        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: " User Not Authorized",
          })
        );
        return;
      }

      if (!tokenVerified) {
        console.log("Token verification failed");
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized");
        return;
      } else {
        setToken(tokenVerified);
        console.log("tokenVerified : " + tokenVerified);
        data = getToken();
        console.log("getToken func : ", data);
        const id2 = pathname.split("/");
        // console.log(id2.length);
        //console.log("total paths: " + id2);

        // route for get and post
        const route = routes.find(
          (r) =>
            r.path === `/${id2[1]}` &&
            r.method === req.method &&
            r.role === data.role
        );

        // route1 for update and delete
        const route1 = routes.find(
          (r) =>
            r.path === `/${id2[1]}/` &&
            r.method === req.method &&
            r.role === data.role
        );

        if (route) {
          route.handler(req, res);
        } else if (route1) {
          route1.handler(req, res, id2[2]);
        } else {
          console.log("page not found from routes");
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not Found or Unauthorized");
        }
        // res.writeHead(200, "Content-Type : application/json");
        // res.end(JSON.stringify("userToken ath"));
        // console.log("tokenVerified from index ", tokenVerified);
      }
    });
  }
});
//createDatabase();
connectionWithDB();
server.listen(port, "127.0.0.1", () => {
  console.log("Server Running on: " + port);
});
