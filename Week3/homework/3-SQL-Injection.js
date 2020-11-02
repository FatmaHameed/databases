const mysql = require('mysql');
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'world'
  // multipleStatements = true
});
conn.connect();

function getPopulation(name, code) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM country WHERE Name = ? and code = ?;`, [name, code],
    function(err, result) {
      if (err) throw err;
      // if (result.length == 0) console.log(new Error("Not found"));
      console.table(result);
    }
  );
};

// const cb = () => console.table;
// const countryQuery = "country";
const countryName = "Yemen";
const countryCode = 'YEM'; 
getPopulation( countryName, countryCode );
conn.end();
