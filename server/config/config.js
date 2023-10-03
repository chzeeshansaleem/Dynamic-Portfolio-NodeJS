import sql from "msnodesqlv8";

const connectionString =
  "server=.;Database=portfolio;Trusted_Connection=yes;Driver={SQL Server Native Client 11.0}";

function createDatabase() {
  const newDatabaseName = "portfolio";
  const createDatabaseQuery = `
  IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${newDatabaseName}')
    BEGIN
  CREATE DATABASE IF NOT Exist [${newDatabaseName}];
  END;`;

  sql.query(connectionString, createDatabaseQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("DB created successfully");
      console.log(result);
    }
  });
}
function connectionWithDB() {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Database connection failed:", err);
    } else {
      console.log("Database connected successfully");
      conn.close();
    }
  });
}
function creatTables() {
  const createUsersTable = `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
  BEGIN
         CREATE TABLE Users (
    ID varchar(50) NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL CHECK (name NOT LIKE '%[^A-Za-z ]%'), 
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    role varchar(50) NOT NULL CHECK (role IN ('admin', 'user')),
    phone varchar(50) DEFAULT NULL CHECK (phone NOT LIKE '%[^0-9]%'),
    skill varchar(255) CHECK (skill NOT LIKE '%[^A-Za-z0-9,]%'),
    CONSTRAINT check_email_format CHECK (email LIKE '%@%.%')
);
END;`;

  const createProjectTable = `
  IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Projects')
  BEGIN
  CREATE TABLE Projects (
  ID varchar(50) NOT NULL PRIMARY KEY,
  title varchar(255) NOT NULL CHECK (title NOT LIKE '%[^A-Za-z0-9 ]%'),
  description varchar(255) NOT NULL CHECK (description NOT LIKE '%[^A-Za-z0-9\/._-#@ ]%'),
  img varchar(max) NOT NULL,
  tags varchar(50) CHECK ( tags NOT LIKE '%[^A-Za-z0-9#, ]%'),
  languages varchar(50) CHECK ( languages NOT LIKE '%[^A-Za-z0-9#, ]%'),
  technology varchar(255) CHECK ( technology NOT LIKE '%[^A-Za-z0-9#, ]%'),
  user_id varchar(50) NOT NULL, 
FOREIGN KEY (user_id) REFERENCES Users(ID) on DELETE CASCADE
);
END;`;
  const createTokenSessionTable = `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'tokenSession')
  BEGIN
  CREATE TABLE  tokenSession (
    ID varchar(50) NOT NULL PRIMARY KEY,
     user_id varchar(50) NOT NULL, FOREIGN KEY (user_id) REFERENCES  Users(ID) on DELETE CASCADE,
	 token varchar(255) NOT NULL,);
  END;
  `;
  const createEducationTable = `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Education')
  BEGIN
     CREATE TABLE Education (
  ID varchar(50) NOT NULL PRIMARY KEY,
  degree varchar(255) NOT NULL CHECK (degree NOT LIKE '%[^A-Za-z0-9 ]%'),
  university varchar(255) NOT NULL CHECK (university NOT LIKE '%[^A-Za-z0-9\/._-# ]%'),
  startDate DATE NOT NULL, 
  endDate DATE NOT NULL,     
  user_id varchar(50) NOT NULL, 
  FOREIGN KEY (user_id) REFERENCES Users(ID) on DELETE CASCADE
) ;
END;`;
  const createExperienceTable = `  
  IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Experience')
  BEGIN
  CREATE TABLE  Experience (
  ID varchar(50) NOT NULL PRIMARY KEY,
  position varchar(255) NOT NULL CHECK (position NOT LIKE '%[^A-Za-z0-9 ]%'),
  company varchar(255) NOT NULL CHECK (company NOT LIKE '%[^A-Za-z0-9\/._-# ]%'),
  startDate DATE NOT NULL, 
  endDate DATE NOT NULL,     
  user_id varchar(50) NOT NULL, 
  FOREIGN KEY (user_id) REFERENCES Users(ID) on DELETE CASCADE
);
END;`;

  sql.query(connectionString, createUsersTable, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Users Table created successfully");
    }
  });
  sql.query(connectionString, createProjectTable, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Project Table created successfully");
    }
  });
  sql.query(connectionString, createTokenSessionTable, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Token Session Table created successfully");
    }
  });
  sql.query(connectionString, createExperienceTable, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Experince Table created successfully");
    }
  });
  sql.query(connectionString, createEducationTable, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Education Table created successfully");
    }
  });
}

export { createDatabase, connectionWithDB, connectionString, creatTables };
