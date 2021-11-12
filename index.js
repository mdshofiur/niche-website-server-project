const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors =  require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;



app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e7yhr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("lightweb");
    const Liteitems = database.collection("items");
    const Orderitems = database.collection("Orders");
    const userCollection = database.collection("users");
     
        // POST API
        app.post('/product', async (req, res) => {
        const service = req.body;
        const result = await Liteitems.insertOne(service);
        res.json(result);
        })


        // GET API 
         app.get('/product', async (req, res) => {
         const cursor = Liteitems.find({});
         const services = await cursor.toArray();
         res.json(services);
         })
    

        // Get Single API

        app.get('/product/:serviceId', async (req, res) => {
        const id = req.params.serviceId;
        const query = {_id: ObjectId(id)};
        const service = await Liteitems.findOne(query);
        res.json(service);
        });



        // Order Post API
        app.post('/singleorder', async (req, res) => {
        const service = req.body;
        const result = await Orderitems.insertOne(service);
        res.json(result);
        })


       // my order
        app.get('/singleorder/:email', async (req, res) => {
        const result = await Orderitems.find({ 
        LogEmail: req.params.email
        }).toArray();
        res.send(result);
        })


          // All Order Api 

          app.get('/singleorder', async (req, res) => {
          const cursor = Orderitems.find({});
          const services = await cursor.toArray();
          res.json(services);
         })
         

       //   Delete Api

         app.delete('/singleorder/:id', async (req,res) => {
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const result = await Orderitems.deleteOne(query);
        res.send(result);
       })


       // Update API

           app.put('/singleorder/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const options = { upsert: true };
          const updateDoc = {
          $set: {
           status: "Shipped",
          },
          }
         const result = await Orderitems.updateOne(query,updateDoc,options);
         res.json(result);
        })

      // Users

        app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.json(result);
    })

    // Make Admin

    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const updatedDoc= {$set: {role:'admin'}};
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.json(result);
    })

    // admin check

         app.get('/user/admin/:email', async (req, res) => {
         const email = req.params.email;
         const query = {email: email};
         const user = await userCollection.findOne(query);
         let isAdmin = false;
         if(user?.role == 'admin'){
           isAdmin = true;
         }

         res.json({admin: isAdmin});

    })


  } 


  finally {
   // await client.close();
   // 73-6
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})