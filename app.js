//Require modules and models

var express = require("express");
var models = require("./models/index");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();

//Set view engine

app.set("view engine", "ejs");

//Middleware

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    res.redirect(301, "/chirps");
});

//Get all chirps
app.get("/chirps", (req, res) => {
  //Step 1: Find all Chirps in the DB
  models
  .Chirp
  .findAll()
  .then((chirps) => {
    //Step 2: Render index.html with Chirps in it
    res.render("index", {
      chirps
    });
  });
});

//Create new chirp
app.post("/chirps", (req, res) => {
  //Step 1: Grab the Chirp from the form
  var formData = req.body;

  //Step 2: Insert Chirp row into DB using SQL
  models
  .Chirp
  .create(formData)
  .then(() => {
    //Step 3: Redirect back to show all Chirps
    res.redirect("/chirps");
  });
});

//Get specific chirp
app.get("/chirps/:id/edit", (req, res) => {
  //Step 1: Retrieve Chirp record from DB based on its ID
  models
  .Chirp
  .findById(req.params.id)
  .then((chirp) => {
    //Step 2: Send back edit.html with Chirp info in it
    res.render("edit", {
      chirp
    });
  });
});

//Edit a chirp
app.put("/chirps/:id", (req, res) => {
  //Step 1: Find original Chirp via its ID
  models
  .Chirp
  .findById(req.params.id)
  .then((chirp) => {
    //Step 2: Update that Chirp
    chirp
    .updateAttributes(req.body)
    .then(() => {
      //Step 3: Redirect back to show all Chirps page
      res.redirect("/chirps");
    });
  });
});

//Delete a chirp
app.delete("/chirps/:id", (req, res) => {
  //YOUR TURN!
  //Hint: The method you call is .destroy()

  //Step 1: Find the original Chirp based on its ID
  models
  .Chirp
  .findById(req.params.id)
  .then((chirp) => {
    //Step 2: Destroy that Chirp
    chirp
    .destroy()
    .then(() => {
      //Step 3: Redirect back to show all Chirps
      res.redirect("/chirps");
    });
  });
});

app.listen(process.env.PORT || 3000);
