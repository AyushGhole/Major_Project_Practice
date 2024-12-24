const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

// Routes
// Home route
app.get("/", (req, res) => {
  res.send("I am the root ..");
});

// Index route: Display all listings
app.get("/listing", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
});

// New route: Display form for new listing
app.get("/listing/new", (req, res) => {
  res.render("new.ejs");
});

// Show route: Display details of a specific listing
app.get("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("show.ejs", { listing });
});

// Create route: Add a new listing
app.post("/listing", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listing"); // Redirect to all listings after adding
  } catch (err) {
    console.error("Error saving listing:", err);
    res.status(500).send("Error saving listing");
  }
});

//Edit Route
app.get("/listing/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
});

//Update route
app.put("/listing/:id", async (req, res) => {
  const { id } = req.params;
  let edit = await Listing.findByIdAndUpdate(id, { ...req.body });
  console.log(edit);
  res.redirect("/listing");
});
//Delete Route
app.delete("/listing/:id", async (req, res) => {
  const { id } = req.params;
  let deleteRoute = await Listing.findByIdAndDelete(id);
  console.log(deleteRoute);
  res.redirect("/listing");
});
// Server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
