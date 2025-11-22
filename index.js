const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({}));
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Password}@cluster0.h2qhrdv.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const DB = client.db("The-Book-Heaven-DB");
    const BookCollection = DB.collection("Book_data");
    const UserReviewCollection = DB.collection("User_Review");

   
    app.get("/Book-data", async (req, res) => {
      const result = await BookCollection.find().toArray();
      res.send(result);
    });

    
    app.post("/Book-data", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await BookCollection.insertOne(data);
      console.log(result);
      res.send({
        success: true,
        result,
      });
    });

    app.get("/my-books/:email", async (req, res) => {
      const email = req.params.email;
      try {
        const books = await BookCollection.find({ userEmail: email }).toArray();
        res.send(books);
      } catch (error) {
        console.error(error);
        res.status(500).send({
          success: false,
        });
      }
    });

    app.put("/Book-data/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id))
        return res
          .status(400)
          .send({ success: false, message: "Invalid book ID" });

      const updateData = req.body;
      const result = await BookCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send({ success: result.modifiedCount > 0 });
    });

    
  
    app.get("/Book-data/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id))
        return res.status(400).send({ success: false });

      const result = await BookCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    
    app.delete("/Book-data/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id))
        return res
          .status(400)
          .send({ success: false, message: "Invalid book ID" });

      try {
        const result = await BookCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount > 0) {
          res.send({ success: true, message: "Book deleted successfully" });
        } else {
          res.send({ success: false, message: "Book not found" });
        }
      } catch (error) {
        console.error(error);
        res.send({ success: false });
      }
    });

   
    app.get("/Book-latest", async (req, res) => {
      try {
        const latestBooks = await BookCollection.find()
          .sort({ _id: -1 })
          .limit(8)
          .toArray();

        res.send({
          success: true,
          data: latestBooks,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/reviews", async (req, res) => {
      try {
        const reviews = await UserReviewCollection.find().toArray();
        res.send({
          success: true,
          data: reviews,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;
        const result = await UserReviewCollection.insertOne(review);
        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    // await client.db("admin").command({ ping: 1 });
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
