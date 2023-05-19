const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
require("dotenv").config();

// ---------
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqha5r5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
    // --for any error down line need to be comment 
    await client.connect();
    //--------------------------------
    const toysCollection = client.db('toyDB').collection('toys')
    const allToyCollection = client.db('AllToyDB').collection('toy')


    // data read by get operation
    app.get('/mytoy', async(req, res) =>{
      const cursor = toysCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    // create data with post method
    app.post('/addAToy', async(req, res) =>{
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    })
    // for deleting use delete


    //---------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send("App of toy figure is running good")

})

app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
})