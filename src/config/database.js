const mongoose = require('mongoose');
const dns = require('node:dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

//Async function to connect to the database
const username = process.env.MONGO_USERNAME || "syedeliyaz1993_db_user";
const password = process.env.MONGO_PASSWORD || "fX8eH1wS0ntR8nde";
const cluster = process.env.MONGO_CLUSTER || "namastenode.ljqizb0.mongodb.net";
const uri = `mongodb+srv://${username}:${password}@${cluster}/devTinder`;

async function connectDB() {
  await mongoose.connect(uri);
}

//export the connectDB function to be used in app file

module.exports = connectDB;