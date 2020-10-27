const mysql = require('mysql');

// Create the connection
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'Researches',
});
connection.connect();

// write function to avoid repetition of the code
function getResults(sql) {
  connection.query(sql, (err, results) => {
    if (err) {
      return console.error(err.message);
    }
   console.table(results)})
};

// Query that prints names of all Authors and their corresponding Collaborators.

const authorCollaborator = "SELECT A1.author_name AS author, A2.author_name AS collaborator FROM authors AS A1 LEFT JOIN authors AS A2 on A2.author_no = A1.Collaborator;";
getResults(authorCollaborator);

// Query that prints all columns of Authors and their published paper_title. If there is an author without any Research_Papers, print the information of that Author too.

const authorPaper = "SELECT A.author_name Author, P.paper_title Research_title FROM auth_res R JOIN research_papers P RIGHT JOIN authors A ON A.author_no = R.auth_no AND P.paper_id = R.res_id;";
getResults(authorPaper);

// end the connection
connection.end(); 