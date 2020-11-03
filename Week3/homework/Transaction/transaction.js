const util = require('util');
const mysql = require('mysql');

const CONNECTION_CONFIG = {
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'Transaction_db'
};

// PROMISE FUNCTION
async function executeTransaction() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);
  const execQuery = util.promisify(connection.query.bind(connection));

  try {
    const startTransaction = `START TRANSACTION;`;
    const transfer = `UPDATE accounts SET balance = balance - 1000 WHERE account_number = 101;`;
    const receive = `UPDATE accounts SET balance = balance + 1000 WHERE account_number = 102;`;
    const reflectTransaction = `UPDATE account_changes C SET amount = (SELECT balance FROM accounts A WHERE A.account_number = C.account_number);`;
    const updateRemarks = `UPDATE account_changes C SET remark = 'Transaction Done' WHERE account_number = 101 or account_number = 102;`;
    const commit = `COMMIT;`
    
    await Promise.all([execQuery(startTransaction), execQuery(transfer), execQuery(receive), execQuery(reflectTransaction), execQuery(updateRemarks), execQuery(commit)]);
    
    connection.end();
  } 
  catch (err) {
    console.error(err.message);
    connection.end();
  }
};

executeTransaction();