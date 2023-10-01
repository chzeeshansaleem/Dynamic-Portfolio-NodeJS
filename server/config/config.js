import sql from "msnodesqlv8";

const connectionString =
  "server=.;Database=portfolio;Trusted_Connection=yes;Driver={SQL Server Native Client 11.0}";

function connectionWithDB() {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Database connection failed:", err);
    } else {
      console.log("Database connected successfully");

      // You can perform database operations here

      // Don't forget to close the connection when done
      conn.close();
    }
  });
}

function createDatabase() {
  const createDatabaseQuery = `CREATE DATABASE [${newDatabaseName}]`;

  sql.query(connectionString, createDatabaseQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("DB created successfully");
      console.log(result);
    }
  });
}
export { createDatabase, connectionWithDB, connectionString };
