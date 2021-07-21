//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');


//app.use(bodyParser.urlencoded({ extended: true })); //made it into .json
app.use(express.static("public"));
app.use(bodyParser.json());
//app.use({ useUnifiedTopology: true });
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


app.get('/lists/:id', function (req, res) {
	const id = req.params.id;
	List.findById(id)
	.then(data => {
		if (!data) 
		res.status(404).send({ message: "Item not found with id" + id});
		else res.send(data);
	})
	.catch(err => {
		res
			.status(500)
			.send({ message: "Error retrieving list item with id" + id})
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

app.delete('/lists/:id', function (req, res) {
	const id = req.params.id;
	List.findByIdAndRemove(id)
	.then(data => {
		if (!data) {
		  res.status(404).send({
			message: `Cannot delete Item with id=${id}. Maybe Item was not found!`
		  });
		} else {
		  res.send({
			message: "Item was deleted successfully!"
		  });
		}
	  })
	  .catch(err => {
		res.status(500).send({
		  message: "Could not delete Item with id=" + id
		});
	  });
})

app.delete('/lists/:id', function(req, res) {
	let id = req.params.id;
	List.findOneAndRemove({_id: id}, function(err) {
		if(err) {
			console.log(err);
			return res.status(500).send();
		} 
		return res.status(200).send()
	})
});

app.listen(3000, function() {
	console.log("Server started on port 3000");
  });

