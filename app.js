//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');


//app.use(bodyParser.urlencoded({ extended: true })); //made it into .json
app.use(express.static("public"));
app.use(bodyParser.json())
var cors = require('cors')
app.use(cors())


mongoose.connect("mongodb://localhost:27017/theList", {useNewUrlParser: true});

const listSchema = {
	name: String,
	price: Number,
	quantity: Number
};

const List = mongoose.model("List", listSchema);

app.get("/lists", function (req, res) {
	List.find(function(err, foundLists){
		if (!err) {
			res.send(foundLists);
			return
		}
		res.send(err);
	})
})

app.post("/lists", function(req, res) {
	const newList = new List({
	name: req.body.name,
	price: req.body.price,
	quantity: req.body.quantity
	});

	newList.save(function(err){
		if (!err) {
			res.send("Successfully added new item.");
		} else {
			res.send(err);
		}
	});
});

app.delete("/lists", function(req, res){
	List.deleteMany(function(err){
		if (!err) {
			res.send("Successfully deleted entire list.");
		} else {
			res.send(err);
		}
	})
})

app.delete("/lists/`${id}`", function(req, res){
	List.delete(function(err){
		if (!err) {
			res.send("Successfully deleted entire list.");
		} else {
			res.send(err);
		}
	})
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});