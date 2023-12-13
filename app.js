const express = require("express");
const exphbs = require('express-handlebars')

const path = require('path');
const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars")

var data = require("./data.json")

var publicDir = path.join(__dirname, 'public');
// app.use("/public/", express.static(publicDir));

/*
  -> IMPORTANT
  -> it is a security risk to serve node_modules via express. You should use a bundler like webpack or browserify
*/
var nodeModulesDir = path.join(__dirname, 'node_modules');
app.use('/node_modules/', express.static(nodeModulesDir));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/interview.html", function(req, res){
  res.sendFile(__dirname + "/interview.html"); 
})

app.listen(8000, function () {
  console.log("Server is running on localhost:8000");
});