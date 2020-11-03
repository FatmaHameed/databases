// Give an example of a value that can be passed as name and code that would take advantage of SQL-injection and (fetch all the records in the database):
// Country = `country`
// name = "Yemen"
// code = `"ABC" OR 1=1; show databases;` This value worked in javascript but without "show databases" query because javascript did not permit multiple queries.

// Rewrite the function so that it is no longer vulnerable to SQL injection
function getPopulation(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ? WHERE Name = ? and code = ?`, [Country, name, code], 
    /* this code worked in js but with putting the name of the table to the query and execute it as following: 
    `SELECT Population FROM country WHERE Name = ? and code = ?`, [name, code]. In MySQL command line; it works using following syntaxes:
    prepare count_pop from 'SELECT Population FROM country WHERE Name = ? and code = ?';
    set @n = 'Yemen';
    set @c = 'YEM';
    execute count_pop using @n, @c; ==> this worked without putting the variables into array
    */
    function(err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result[0].name);
    }
  );
}
