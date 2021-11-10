const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors =  require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
//const ObjectId = require("mongodb").ObjectId;



app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})