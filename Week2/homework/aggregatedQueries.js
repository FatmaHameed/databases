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

// Query that prints all research papers and the number of authors that wrote that paper.

const researchesAuthors = "SELECT P.paper_title AS Research_title, P.paper_id, COUNT(A.author_name) AS No_of_Authors FROM auth_res R JOIN research_papers P JOIN authors A ON A.author_no = R.auth_no AND P.paper_id = R.res_id GROUP BY p.paper_title ORDER BY P.paper_id;";
getResults(researchesAuthors);

// Sum of the research papers published by all female authors.
const femalesResearches = "SELECT A.gender, COUNT(R.res_id) AS No_of_Researches FROM auth_res R JOIN research_papers P JOIN authors A ON A.author_no = R.auth_no AND P.paper_id = R.res_id WHERE A.gender = 'f';";
getResults(femalesResearches);

// Average of the h-index of all authors per university.
const hIndexAVG = " SELECT A1.university University, AVG(A2.h_index) Average FROM authors A1 LEFT JOIN authors A2 on A1.author_no = A2.author_no GROUP BY A1.university ORDER BY AVG(A2.h_index) DESC;";
getResults(hIndexAVG);

// Sum of the research papers of the authors per university.
const paperPerUni = "SELECT A.university University, COUNT(R.res_id) AS No_of_Researches FROM auth_res R JOIN research_papers P JOIN authors A ON A.author_no = R.auth_no AND P.paper_id = R.res_id GROUP BY university;";
getResults(paperPerUni);

// Minimum and maximum of the h-index of all authors per university.
const minMaxHIndex = "SELECT A.university University, MIN(h_index) Minimum_h_Index, MAX(h_index) Maximum_h_index FROM auth_res R JOIN research_papers P JOIN authors A ON A.author_no = R.auth_no AND P.paper_id = R.res_id GROUP BY university;";
getResults(minMaxHIndex);

// end the connection
connection.end(); 