const mongod = require("mongodb")
const MongoClient = mongod.MongoClient
require("dotenv").config()

// Connection URL

let password = encodeURIComponent(process.env.DB_PASSWORD)
const url = `mongodb+srv://${process.env.DB_USER}:${password}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
console.log("URL - ", url)
var client = null
// Use connect method to connect to the server
async function connect() {
  try {
    if (!client) {
      client = await MongoClient.connect(url, { useUnifiedTopology: true })
      console.log("Established new connection to server")
    }
    return client
  } catch (err) {
    console.error(err)
  }
}

async function updateBounty(data) {
  // Get the documents collection
  let client = await connect()
  let db = client.db(process.env.DB_NAME)
  let o_id = new mongod.ObjectID(data["_id"])

  const _collection = db.collection(process.env.DB_COLLECTION)
  // Insert some documents
  try {
    console.log(data)
    let resp = await _collection.updateOne(
      { _id: o_id },
      { $set: { status: data.status, workers: data.workers } }
    )
    console.log(resp)
    return resp
  } catch (err) {
    console.error(err)
  }
}

async function saveBounty(data) {
  // Get the documents collection
  let client = await connect()
  let db = client.db(process.env.DB_NAME)
  const _collection = db.collection(process.env.DB_COLLECTION)
  // Insert some documents
  try {
    let result = await _collection.insertOne(data)
    console.log(result)
    return result
  } catch (err) {
    console.error(err)
  }
}

async function getBounties() {
  // Get the documents collection
  let client = await connect()
  let db = client.db(process.env.DB_NAME)
  let data = await db
    .collection(process.env.DB_COLLECTION)
    .find({})
    .toArray()
  console.log(data)
  return data
}

async function getBountyDetails(id) {
  // Get the documents collection
  let client = await connect()
  let db = client.db(process.env.DB_NAME)
  let o_id = new mongod.ObjectID(id)
  let data = await db
    .collection(process.env.DB_COLLECTION)
    .findOne({ _id: o_id })
  console.log(data)
  return data
}

module.exports = {
  getBounties,
  getBountyDetails,
  saveBounty,
  updateBounty
}
