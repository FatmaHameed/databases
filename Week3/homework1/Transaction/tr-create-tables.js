const util = require('util');
const mysql = require('mysql');

const CONNECTION_CONFIG = {
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword'
};

// CREATE THE DATABASE
const CREATE_TRANSACTION_DATABASE = `
  CREATE DATABASE Transaction_db;`;

// USE THE DATABASE
const USE_TRANSACTION_DB = `USE Transaction_db;`;

// CREATE TABLES
const CREATE_ACCOUNTS_TABLE = `
  CREATE TABLE IF NOT EXISTS accounts(
    account_number INT PRIMARY KEY,
    balance FLOAT
  );`;

  const CREATE_ACCOUNT_CHANGES_TABLE = `
  CREATE TABLE IF NOT EXISTS account_changes(
    change_number INT AUTO_INCREMENT PRIMARY KEY, 
    account_number INT,
    amount FLOAT, 
    changed_date DATETIME,
    remark VARCHAR(100),
    FOREIGN KEY (account_number) REFERENCES accounts(account_number)
  );`;

// PROMISE FUNCTION
async function executeQueries() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);
  const execQuery = util.promisify(connection.query.bind(connection));

  try {
    await Promise.all([execQuery(CREATE_TRANSACTION_DATABASE), execQuery(USE_TRANSACTION_DB), execQuery(CREATE_ACCOUNTS_TABLE),
      execQuery(CREATE_ACCOUNT_CHANGES_TABLE) ]);
    connection.end();
  } catch (err) {
    console.error(err.message);
    connection.end();
  }
}

executeQueries() 