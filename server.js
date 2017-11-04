const express = require('express');
const natural = require('natural');
const app = express();

const goodLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const badLetters = ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'];

var classifier = new natural.BayesClassifier();

app.use('/app', express.static('app'));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/api/train', (req, res) => {
	console.log("Training: "+ req.query.target);
	var beatbox = req.query.source.split("").map(function(x,i) {
		if(x == "0") {
			return i.toString().split("").map(function(y) {
				return goodLetters[parseInt(y)];
			}).join("");
		}
		else {
			return i.toString().split("").map(function(y) {
				return badLetters[parseInt(y)];
			}).join("");
		}
	}).join(" ");
	classifier.addDocument(beatbox, req.query.target);
	res.send('');
});

app.get('/api/done', (req, res) => {
	classifier.train();
	console.log("Done training");
	res.send('');
});

app.get('/api/save', (req, res) => {
	console.log("saving classifier");
	classifier.save('classifier.json');
	res.send('');
});

app.get('/api/load', (req, res) => {
	console.log("loading classifier");
	classifier.save('classifier.json');
	res.send('');
});

app.get('/api/classify', (req, res) => {
	var beatbox = req.query.source.split("").map(function(x,i) {
		if(x == "0") {
			return i.toString().split("").map(function(y) {
				return goodLetters[parseInt(y)];
			}).join("");
		}
		else {
			return i.toString().split("").map(function(y) {
				return badLetters[parseInt(y)];
			}).join("");
		}
	}).join(" ");
	var guess = classifier.classify(beatbox);
	console.log("Classifying: "+ guess);
	res.send(guess);
});

app.listen(3000, () => console.log('http://localhost:3000/app/train.html'))