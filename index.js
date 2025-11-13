const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
app.use(
  cors({
    // origin:
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://Mofizul-The-Book-Heaven:9CJYg47RKm9SIRxT@cluster0.h2qhrdv.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const DB = client.db("The-Book-Heaven-DB");
    const BookCollection = DB.collection("Book_data");

    app.get("/Book-data", async (req, res) => {
      const result = await BookCollection.find().toArray();
      res.send(result);
    });

    app.post("/Book-data", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await BookCollection.insertOne(data);

      console.log("Insert result:", result);

      res.send({
        success: true,
        result,
      });
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send(`Hi from server at Port : ${PORT}`);
});

app.listen(PORT);
