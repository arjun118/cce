const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);
console.log(dbName, uri);
async function connectTodb() {
  await client.connect();
}

const getClient = () => client.db(dbName);

module.exports = {
  connectTodb,
  getClient,
};
