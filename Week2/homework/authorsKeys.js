const util = require('util');
const fs = require('fs');
const mysql = require('mysql');

const CONNECTION_CONFIG = {
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'Researches',
};

const CREATE_AUTHORS_TABLE = `
  CREATE TABLE IF NOT EXISTS authors(
    author_no INT PRIMARY KEY,
    author_name VARCHAR(50),
    university VARCHAR(100),
    date_of_birth DATE,
    h_index INT,
    gender ENUM('m', 'f')
  );`;
  const addCollaborator = `ALTER TABLE authors ADD Collaborator int`
  const addForeignKey = `ALTER TABLE authors\
   ADD CONSTRAINT FK_Collaborator1 \
   FOREIGN KEY (Collaborator) \
   REFERENCES authors(author_no);`;


async function executeQueries() {
  const connection = mysql.createConnection(CONNECTION_CONFIG);
  const readFile = util.promisify(fs.readFile);
  const execQuery = util.promisify(connection.query.bind(connection));

  try {
    await execQuery(CREATE_AUTHORS_TABLE);
    await execQuery(addCollaborator);
    // await execQuery(addForeignKey);

    const data = await readFile(__dirname + '/data/authors.json', 'utf8');
    const authors = JSON.parse(data);
    const promises = authors.map(author => execQuery('INSERT INTO authors SET ?', author));

    await execQuery(addForeignKey);

    await Promise.all(promises);
    connection.end();
  } catch (err) {
    console.error(err.message);
    connection.end();
  }
}

executeQueries()