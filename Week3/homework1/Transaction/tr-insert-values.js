const util = require('util');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');

const CONNECTION_CONFIG = {
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'Transaction_db'
};

// PROMISE FUNCTION
async function insertValues() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);
  const readFile = util.promisify(fs.readFile);
  const execQuery = util.promisify(connection.query.bind(connection));

  try {
    const data = await readFile(path.join(__dirname, '../data/accounts.json'), 'utf8');
    const accounts = JSON.parse(data);
    const promiseAccount = accounts.map(account => execQuery('INSERT INTO accounts SET ?', account));

    const accountChangesData = await readFile(path.join(__dirname, '../data/accountsChanges.json'), 'utf8');
    const accountChanges = JSON.parse(accountChangesData);
    const promises = accountChanges.map(accountChange => execQuery('INSERT INTO account_changes SET ?', accountChange));

    await Promise.all(promises);
    connection.end();
  } 
  catch (err) {
    console.error(err.message);
    connection.end();
  }
};

insertValues(); 