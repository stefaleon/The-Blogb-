var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({	extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

var postSchema = new mongoose.Schema({
	title: String,
	image: String,
	content: String,
	created: {
		type: Date,
		default: Date.now
	}
});

var Post = mongoose.model('Post', postSchema);

// MAIN
app.get('/', function(req, res) {
	res.redirect('posts');
});

// INDEX ROUTE
app.get('/posts', function(req, res) {
	Post.find({}, function(err, foundPosts) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', {
				posts: foundPosts
			});
		}
	}).sort( { created: -1 } );
});

// NEW ROUTE
app.get('/posts/new', function(req, res) {
	res.render('new');
});

// CREATE ROUTE
app.post('/posts', function(req, res) {
	var crPost = {
		title: req.body.title,
		image: req.body.image, 
		content: req.sanitize(req.body.content)
	}
	Post.create(crPost, function(err, newPost) {
		if (err) {
			res.render('new');
		} else {
			res.redirect('posts');
		}
	});
});

// SHOW ROUTE
app.get('/posts/:id', function(req, res) {
	Post.findById(req.params.id, function(err, foundPost) {
		if (err) {
			res.redirect('/posts');
		} else {
			res.render('show', {
				post: foundPost
			});
		}
	});
});

// EDIT ROUTE
app.get('/posts/:id/edit', function(req, res) {
	Post.findById(req.params.id, function(err, foundPost) {
		if (err) {
			res.redirect('/posts');
		} else {
			res.render('edit', { 
				post: foundPost
			});
		}
	});			
});

// UPDATE ROUTE
app.put('/posts/:id', function(req, res) {
	var updPost = {
		title: req.body.title,
		image: req.body.image,
		content: req.sanitize(req.body.content),
		updated: Date.now
	}
	Post.findByIdAndUpdate(req.params.id, updPost, function(err, updatedPost) {
		if (err) {
			res.redirect('/posts');
		} else {
			res.redirect('/posts/' + req.params.id);				
		}
	});
});

// DESTROY ROUTE
app.delete('/posts/:id', function(req, res) {
	Post.findByIdAndRemove(req.params.id, function(err, updatedPost) {
	 	if (err) {
			res.redirect('/posts');
	 	} else {
	 		res.redirect('/posts');				
	 	}
	});
});

app.listen(PORT, process.env.IP, function() {
	console.log('Server started on port', PORT);
});