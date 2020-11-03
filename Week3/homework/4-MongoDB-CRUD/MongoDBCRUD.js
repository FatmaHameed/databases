const {MongoClient} = require('mongodb');
const url = "mongodb://localhost:27017/";

async function main() {
    const client = new MongoClient(url, { useUnifiedTopology: true } );
    try {
      // Connect to MongoDB client instance
      
        await client.connect();

      // Calling createNewCity function
        await createNewCity(client, {
          Name: "Sana'a City",
          CountryCode: "YEM",
          District: "Sana'a Capital"
        });

       // Updating the population of city document
        await updateCityByName(client, "Sana'a City", { Population: 1937451}); 

        // Reading document by name then by country code
        await readDocumentByName(client, "Sana'a City");
        await readDocumentByCode(client, "YEM");

        // Call delete function
        await deleteCityByName(client, "Sana'a City");

    } catch(error) {
      // Handle the error if any 
        console.error(error);
    } finally {
      // Close the connection
        await client.close();
    }
}
// Creating a function for creating new city
async function createNewCity(client, newCity) {
const result = await client.db("World").collection("city").insertOne(newCity);
console.log(`New city created with the following id: ${result.insertedId}`);
};

// Creating a function for updating the new city
async function updateCityByName(client, nameOfCity, updatedInfo) {
  const result = await client.db("World").collection("city").updateOne({ Name: nameOfCity }, { $set: updatedInfo });
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
};

// Created two functions for reading the document, one by name. The other by country code
async function readDocumentByName(client, cityName) {
   const result = await client.db("World").collection("city").findOne({Name : cityName});

   // Check if there is document with this name
  if(result){
    console.log(`Found the document with city name ${cityName}:`);
    console.log(result);
  } else {
    console.log(`No document with city name ${cityName}`)
  };
};

// The function to read by country code
async function readDocumentByCode(client, CountryCode) {
  const result = await client.db("World").collection("city").findOne({CountryCode: CountryCode});

  // Validate the result
  if(result){
    console.log(`Found the city with country code ${CountryCode}:`);
    console.log(result);
  } else {
    console.log(`No document with country code ${CountryCode}`)
  }
};

// The function for deleting the New city
async function deleteCityByName(client, nameOfCity) {
  const result = await client.db("World").collection("city").deleteOne({ Name: nameOfCity });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
};

// Call the main function here
main();