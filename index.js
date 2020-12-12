const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y70ks.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const residentsCollection = client
    .db("smartResidenz")
    .collection("residents");

  // to submit details to database
  app.post("/submitDetails", (req, res) => {
    const resident = req.body;
    residentsCollection.insertOne(resident).then((result) => {
      console.log(result);
    });
  });

  // to read all details from database
  app.get("/residents", (req, res) => {
    residentsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // to read specific details from database
  app.get("/resident/:id", (req, res) => {
    residentsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  // to update residents to database
  app.patch("/updateResident/:id", (req, res) => {
    console.log(req.body.name);

    residentsCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
          },
        }
      )
      .then((result) => {
        console.log(result);
      });
  });

  // to delete specific resident from database
  app.delete("/deleteResident/:id", (req, res) => {
    //console.log(req.params.id);
    residentsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
        //res.send(result.deletedCount > 0);
      });
  });

  console.log("database connected");
  //   client.close();
});

app.listen(port);
