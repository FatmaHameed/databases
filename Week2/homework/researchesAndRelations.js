const util = require('util');
const fs = require('fs');
const mysql = require('mysql');


const CONNECTION_CONFIG = {
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'Researches',
};
/* 
The relationship between Authors and Research papers is M - M relations, since an author can write more than one research and the research could be written by more than one author (collaborator). I have added foreign key (author_no) in research_papers table references to (author_no) in authors table. I also added another table (auth_res) to represent the linked table
*/
const CREATE_RESEARCH_PAPERS_TABLE = `
  CREATE TABLE IF NOT EXISTS research_papers(
    paper_id INT PRIMARY KEY,
    paper_title VARCHAR(200),
    conference VARCHAR(100),
    publish_date DATE,
    author_no INT,
    FOREIGN KEY (author_no) REFERENCES authors(author_no)
  );`;
  
  const CREATE_AUTH_RES_TABLE = `
  CREATE TABLE IF NOT EXISTS Auth_Res(
    auth_no INT NOT NULL,
    res_id INT NOT NULL,
    CONSTRAINT FK_AUTH FOREIGN KEY(auth_no) REFERENCES authors(author_no),
    CONSTRAINT FK_RES FOREIGN KEY(res_id) REFERENCES research_papers(paper_id),
    PRIMARY KEY (auth_no, res_id)
  );`;

async function executeQueries() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);
  const readFile = util.promisify(fs.readFile);
  const execQuery = util.promisify(connection.query.bind(connection));

  try {
    await execQuery(CREATE_RESEARCH_PAPERS_TABLE);
    await execQuery(CREATE_AUTH_RES_TABLE);
   
    const data = await readFile(__dirname + '/data/researchPapers.json', 'utf8');
    const papers = JSON.parse(data);
    const promise1 = papers.map(paper => execQuery('INSERT INTO research_papers SET ?', paper));
  
    // I believe in the following 3 lines of code that we can add data to auth_res table by taking them from inner(or left) join of research_papers table rather than hard-coding them. I have tried to do so, but I could not. I will keep trying for other homeworks

    const aggregatedData = await readFile(__dirname + '/data/auth_res.json', 'utf8');
    const parsedData = JSON.parse(aggregatedData);
    const promises = parsedData.map(auth_res => execQuery('INSERT INTO Auth_Res SET ?', auth_res));

    await Promise.all(promises);
    connection.end();
  } catch (err) {
    console.error(err.message);
    connection.end();
  }
}

executeQueries()