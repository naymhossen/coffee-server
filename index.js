const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstpractice.poejscf.mongodb.net/?retryWrites=true&w=majority`;
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
    await client.connect();
    const customarCollection = client.db('coffeeUsers').collection('customars');

    app.get('/customars', async(req, res) => {
      const cursor = customarCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //updated
    app.get('/customars/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await customarCollection.findOne(query);
      res.send(result)
    })

    app.post('/customars', async(req, res) => {
        const customar = req.body;
        const result = await customarCollection.insertOne(customar);
        res.send(result);
    })

    app.put('/customars/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)};
      const option = { upert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name, 
          chef: updatedCoffee.chef, 
          supplier: updatedCoffee.supplier, 
          taste: updatedCoffee.taste, 
          category: updatedCoffee.category, 
          details: updatedCoffee.details, 
          photo: updatedCoffee.photo
        }
      }
      const result = await customarCollection.updateOne(filter, coffee, option);
      res.send(result);
    })

    app.delete('/customars/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await customarCollection.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('coffe server is running')
})

app.listen(port, () => {
    console.log(`coffee app listening on port ${port}`)
})