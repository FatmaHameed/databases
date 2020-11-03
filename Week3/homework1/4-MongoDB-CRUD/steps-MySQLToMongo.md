1- In MySQL command line client, I used world database.

2- Copied this command: select \* into outfile 'city.csv' FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' from city;
in MySQL command line. It showed the following error:ERROR 1290 (HY000): The MySQL server is running with the --secure-file-priv option so it cannot execute this statement. Typed the error and got how to solve it from stacK overflow: the following link:https://stackoverflow.com/questions/31951468/error-code-1290-the-mysql-server-is-running-with-the-secure-file-priv-option

3-After entering this command: select \* into outfile 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/city.csv' FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' from city; it created city collection (city.csv) file in the same path as above.
The same I did for country and countrylanguage tables as well.

4- Opened the .csv files and added the new row in the top to add the columns names.

5- Installed MongoDB Compass from installation page to my local machine.
6- Created account in atlas ==> for connecting the Mongo interface of my local machine to atlas.
7- Created a cluster in Atlas called HYF.
8- Pressed connect button in atlas and set up my connection security to my current IP address.
9- Selected a connection method (connect using MongoDB compass).
10- I pressed have MongoDB Compass and copied the link that was given, paste it in the MongoDB compass in my local machine, replaced the <password> with my password of the database.
11-After connection and in my local machine, I created a database (World) and a collection name (city).
12-In collection city, I imported the data from city.csv file and selected the data types for each column. Created two more collections for country and countryLanguage and imported the data from .csv files.
13- In Atlas I found my databases in the collection tab.
