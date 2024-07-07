const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const http = require("http");
const fs = require("fs");
const os = require("os");

function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let localAddress = null;

  // Loop through network interfaces and find a non-loopback IPv4 address
  for (const name of Object.keys(networkInterfaces)) {
    for (const address of networkInterfaces[name]) {
      if (address.family === "IPv4" && !address.internal) {
        localAddress = address.address;
        break;
      }
    }
  }
  return localAddress;
}

const aboutContent =
  "Ligula ullamcorper malesuada proin libero nunc consequat interdum. Elit duis tristique sollicitudin nibh sit. Sem integer vitae justo eget magna. Purus gravida quis blandit turpis. Sagittis id consectetur purus ut faucibus pulvinar elementum integer enim. Eget mi proin sed libero enim sed faucibus turpis. Ut morbi tincidunt augue interdum. Massa vitae tortor condimentum lacinia quis vel eros donec. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Mauris a diam maecenas sed enim ut sem. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Malesuada fames ac turpis egestas integer eget aliquet nibh. Lorem ipsum dolor sit amet consectetur. Ut porttitor leo a diam sollicitudin tempor id eu. Risus in hendrerit gravida rutrum quisque. Risus quis varius quam quisque id. Non nisi est sit amet facilisis magna etiam. Vitae purus faucibus ornare suspendisse sed nisi.";
const contactContent =
  "Auctor neque vitae tempus quam pellentesque nec nam. Id donec ultrices tincidunt arcu. Nunc sed blandit libero volutpat sed cras. Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit. Ut tortor pretium viverra suspendisse. Tempor commodo ullamcorper a lacus vestibulum sed arcu non odio. A pellentesque sit amet porttitor eget dolor morbi non arcu. Proin nibh nisl condimentum id venenatis a condimentum vitae. Aliquam etiam erat velit scelerisque in dictum non consectetur a. Et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Aliquam purus sit amet luctus venenatis lectus magna fringilla. Duis convallis convallis tellus id. Magna fringilla urna porttitor rhoncus dolor purus. Tristique senectus et netus et malesuada fames. Aenean pharetra magna ac placerat vestibulum. Nibh tortor id aliquet lectus proin.";

const app = express();
const port = 3000;
const hostname = getIpAddress();

if (!hostname) {
  console.error("Couldn't find a suitable local IP address!");
  process.exit(1); // Exit with error code 1
}

mongoose.connect("mongodb://localhost:27017/Zarnegar");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const commoditySchema = {
  id: String,
  name01: String,
  weight: String,
  fineness: String,
  price: String,
};

const commodity = mongoose.model("commodity", commoditySchema);

app.get("/", async (req, res) => {
  res.render("home", {});
});

app.get("/allitems", async (req, res) => {
  const Commodities = await commodity.find({});
  res.render("allitems", {
    Commodities: Commodities,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/new", (req, res) => {
  res.render("new", {});
});

// Route handler for GET /find-item
app.get("/find-item", async function (req, res) {
  const searchId = req.query.itemId;

  if (!searchId) {
    return res.render("find-item", {
      err: "Please provide an item ID to search.",
    });
  }

  try {
    const foundItem = await commodity.findOne({ id: searchId });
    res.render("find-item", { item: foundItem, err: null });
  } catch (err) {
    // Handle errors including CastError
    console.error(err);
    if (err.name === "CastError") {
      res.render("find-item", { err: "Invalid item ID format." });
    } else {
      res.render("find-item", { err: "Error finding item." });
    }
  }
});

app.post("/delete-item", async function (req, res) {
  const itemId = req.body.itemId;

  if (!itemId) {
    return res.render("error", { err: "Missing item ID for deletion." });
  }

  try {
    await commodity.findByIdAndDelete(itemId);
    res.redirect("/find-item"); // Redirect back to find-item page
  } catch (err) {
    console.error(err);
    res.render("error", { err: "Error deleting item." });
  }
});

app.post("/new", async function (req, res) {
  try {
    // Check for existing ID
    const existingCommodity = await commodity.findOne({
      id: req.body.commodityId,
    });

    if (existingCommodity) {
      // Duplicate ID found, return error
      return res
        .status(409)
        .render("error", { err: "An item with this ID already exists!" });
    }

    // Create new post if ID doesn't exist
    let commodity2 = new commodity({
      id: req.body.commodityId.substring(0, 50),
      name01: req.body.commodityName01.substring(0, 100),
      weight: req.body.commodityWeight.substring(0, 20),
      fineness: req.body.commodityfineness.substring(0, 10),
      price: req.body.commodityprice.substring(0, 20),
    });
    await commodity2.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("error", { err: err });
  }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
