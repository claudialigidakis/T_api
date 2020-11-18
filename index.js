const express = require("express");
const path = require("path");
const cors = require("cors");
const knex = require("./db/knex");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

//////////////////////////////////////////////////////////////////////////////
// User Routes
//////////////////////////////////////////////////////////////////////////////
app.get("/api/posts/search/:searchFilter", function(req, res) {
  if (req.params.searchFilter === "all") {
    return knex("posts")
      .returning("*")
      .then(result => {
        res.status(200).send({ result });
      });
  } else {
    return knex("posts")
      .where({ ref_key: req.params.searchFilter })
      .returning("*")
      .then(result => {
        return res.status(200).send({ result });
      });
  }
});

app.get("/api/posts", (req, res) => {
  return knex("posts")
    .returning("*")
    .then(result => {
      res.status(200).send({ result });
    });
});

app.post("/api/posts", function(req, res) {
  if (req.body.title && req.body.ref_key) {
    return knex("posts")
      .insert({
        image: req.body.image,
        title: req.body.title,
        ref_key: req.body.ref_key
      })
      .returning("*")
      .then(result => {
        return res.status(200).send({ result });
      });
  } else {
    return { status: 400, message: "Bad Request" };
  }
});

app.get("/api/posts/:postId", (req, res) => {
  return knex("posts")
    .where({ id: req.params.postId })
    .then(result => {
      res.status(200).send({ result });
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`Server listening on ${port}`);
