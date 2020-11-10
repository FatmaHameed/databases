const mysql = require('mysql');
const {  dinnerClubInfo, membersInfo, dinnerDetailsInfo, venuesInfo, dinnerInfo, foodInfo } = 
require('./data/normalizationData');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'dinner_club_db',
});

connection.connect();

function createTable(table) {
  connection.query(table, function (error, results, fields) {
    if (error) {
        throw error;
    }
    console.table(results);
  });
};
function insertData(data, dataInfo){
  connection.query(data, [dataInfo], (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    // get inserted rows
    console.table(results.affectedRows);
  });
};
/*
+-----------+---------------+----------------+-----------+-------------+------------+-------------------+-----------+------------------+
| member_id | member_name   | member_address | dinner_id | dinner_date | venue_code | venue_description | food_code | food_description |
+-----------+---------------+----------------+-----------+-------------+------------+-------------------+-----------+------------------+
|         1 | Amit          | 325 Max park   | D00001001 | 2020-03-15  | B01        | Grand Ball Room   | C1, C2    | Curry, Cake      |
|         2 | Ben           | 24 Hudson lane | D00001002 | 2020-03-15  | B02        | Zoku Roof Top     | S1, C2    | Soup, Cake       |
|         3 | Cristina      | 516 6th Ave    | D00001002 | 2020-03-15  | B02        | Zoku Roof Top     | S1, C2    | Soup, Cake       |
|         4 | Dan           | 89 John St     | D00001003 | 2020-03-20  | B03        | Goat Farm         | P1, T1, M1| Pie, Tea, Mousse |
|         5 | Ema           | 91 Pixar St    | D00001003 | 2020-03-20  | B03        | Goat Farm         | P1, T1, M1| Pie, Tea, Mousse |
|         6 | Fatima        | 56 8th Ave     | D00001004 | 2020-03-20  | B04        | Mama's Kitchen    | F1, M1    | Falafal, Mousse  |
|         7 | Gabor         | 54 Vivaldi St  | D00001005 | 2020-02-20  | B05        | Hungry Hungary    | G1, P2    | Goulash, Pasca   |
|         8 | Hema          | 9 Peter St     | D00001003 | 2020-03-20  | B03        | Goat Farm         | P1, T1, M1| Pie, Tea, Mousse |
+-----------+---------------+----------------+-----------+-------------+------------+-------------------+-----------+------------------+
*/

/*1- How can you convert the table into 1NF ?
We can convert the table into 1NF by doing the following:
1- Divide the column food_code into 3 columns: food_code1, food_code2, food_code3, each column contains a single value.
2- Divide also the column food_description into 3 columns; food_description1, 
food_description2, food_description3 and distribute the values in food_description column between the three columns. */

const DINNER_CLUB_TABLE = `
  CREATE TABLE IF NOT EXISTS dinner_club
  ( member_id int auto_increment primary key, member_name varchar(100), member_address varchar(200), dinner_id varchar(100), 
    dinner_date date, venue_code varchar(50), venue_description varchar(200), food_code1 varchar(20), food_code2 varchar(20), 
    food_code3 varchar(20), food_description1 varchar(100), food_description2 varchar(100), food_description3 varchar(100));`;

const insertDinnerClubData = `INSERT INTO dinner_club( member_name, member_address, dinner_id, dinner_date, venue_code, venue_description, 
food_code1, food_code2, food_code3, food_description1, food_description2, food_description3) VALUES ?`;
createTable(DINNER_CLUB_TABLE);
insertData(insertDinnerClubData,  dinnerClubInfo);


/* 2- What are the super, candidate, primary keys in the table created in step (1)?
super keys: { member_name, member_address, dinner-id, dinner-date, venue_code }, {member_id, member_name}.
candidate Keys: { member_name, member_address, dinner_id }, { member_name, member_address, dinner_date }, 
{member_name, member_address, venue_code} { member_id }
primary key: member_id or both member_id, dinner_id, food_code */

/* 3- How can you develop the set of 2NF tables? (Think of relationships between different tables).
As we can see in the table, the dinner date has partial dependencies on the dinner_id and has nothing to do 
with member_address or member_name. 
The venue_code is also dependent on the dinner_id and has nothing with member_name or member_address.
The food codes 1, 2, 3 have partial dependencies on the candidate keys as well. 
The codes have dependencies with dinner_id and have nothing with member_name, member_address, or venue_code.
So, to develop the set of 2NF tables, we have to divide the table into 3 tables:
1- members table: member_id, member_name, member_address. 
2- dinner_details table: dinner_id, dinner_date, food_code1, food_code2, food_code3, 
food_description1, food_description2,food_description3
3- venue table: venue_code, venue_description */

const members = `
  CREATE TABLE IF NOT EXISTS members
  ( member_id int auto_increment primary key, 
    member_name varchar(100), member_address varchar(200));` 
const insertMembersData = `INSERT INTO members(member_name, member_address) VALUES ?`;
createTable(members);
insertData(insertMembersData ,  membersInfo);

const dinnerDetails = `
    CREATE TABLE IF NOT EXISTS dinner_details (dinner_id varchar(100), dinner_date date, food_code1 varchar(20), food_code2 varchar(20), 
    food_code3 varchar(20), food_description1 varchar(100), food_description2 varchar(100), food_description3 varchar(100));`;

const insertDinnerDetailsData = `INSERT INTO dinner_details(dinner_id, dinner_date, food_code1, food_code2, food_code3, food_description1, food_description2, food_description3) VALUES ?`;
createTable(dinnerDetails);
insertData(insertDinnerDetailsData,  dinnerDetailsInfo);

const venues = `CREATE TABLE IF NOT EXISTS venues (venue_code varchar(50), venue_description varchar(200));`; 
const insertVenuesDetailsData = `INSERT INTO dinner_club(venue_code, venue_description) VALUES ?;`;
createTable(venues);
insertData(insertVenuesDetailsData, venuesInfo);


/* 4- How can you develop the set of 3NF tables?
If we see to the dinner table, we can see that the food descriptions 1, 2, 3 have transitive dependencies on
 the food codes 1, 2, 3.
Therefore, to develop the set of 3NF tables, the dinner_details table will be divided to following:
1- dinner table: dinner_id, dinner_date
2- food table: food_id, food_code, food_description 
3- We will be also needing a link table between four tables including the four primary keys as foreign keys sources (members table, dinner table, food table and venue table)
*/

const dinner = `CREATE TABLE IF NOT EXISTS dinner (dinner_id varchar(100), dinner_date date);`;
const insertDinnerData = `INSERT INTO dinner(dinner_id, dinner_date) VALUES ?;`;
createTable(dinner);
insertData(insertDinnerData,  dinnerInfo);

const food = `CREATE TABLE IF NOT EXISTS food(food_code varchar(20), food_description varchar(100));`;
const insertFoodData = `INSERT INTO food(food_code, food_description) VALUES ?`;
createTable(food);
insertData(insertFoodData,  foodInfo);