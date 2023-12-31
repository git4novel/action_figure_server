const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(express.json())
app.use(cors())


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
    // await client.connect();
    //--------------------------------
    const toysCollection = client.db('toyDB').collection('toys')
    const categoryToy = client.db('categoryDB').collection('toy');


    // app.get for finding 6 data for react tabs
    app.get('/categoryToy', async(req, res) =>{
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      const cursor = categoryToy.find(query)
      const result = await cursor.toArray();
      res.send(result)
    })
    // get by id in category toy
    app.get('/categorytoy/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await categoryToy.findOne(query)
      res.send(result);

    })


    // get single data based on id
    app.get('/toy/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query)
      res.send(result);

    })

    // 1 toy update from toy collection
    app.put('/update/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedToy = req.body;
      const newToy = {
        $set: {
          photo: updatedToy.photo,
          toyname: updatedToy.toyname,
          seller: updatedToy.seller,
          email:  updatedToy.email,
          category: updatedToy.category,
          price: updatedToy.price,
          rating: updatedToy.rating,
          quantity: updatedToy.quantity,
          description: updatedToy.description
        }
      }
      const result = await toysCollection.updateOne(filter, newToy, options);
      res.send(result);
    })



    // data read by get operation
    app.get('/mytoy', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
    
      const limit = 20; // Set the limit to 20 items
    
      const cursor = toysCollection.find(query).limit(limit);
      const result = await cursor.toArray();
      res.send(result);
    });

  

    // create data with post method
    app.post('/addAToy', async(req, res) =>{
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    })
    // for deleting use delete
    app.delete('/:id', async(req, res )=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query)      
      res.send(result)
    })

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