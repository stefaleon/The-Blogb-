var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));

var postSchema = new mongoose.Schema({
	title: String,
	image: {
		type: String,
		default: 'https://lh3.googleusercontent.com/MgwXHyJOYqAAIHi6dYjKEqPSs_8-ming4v4kg2tM7DityTvSfgtm-s-NEHvQnr5GSQNFKRaCCKocK6Kc8U3GcGl4fEb2DlrxCvV8LJiB7bKAspE5PrqlENGu5m_CnzDeuVNDW_Zwb_8SFRQwK8dK3zbvpgHkX1KXOLdvsS_HOefFix5jsfByghSxxpzgxsRnKWaoRutP5i2BH515SYhC9l6YkxEUCp0Uvz1fO5V0oAWBq5BdVilqYrMxj1232Lu62cmEx4I7LzLSGKeN_EwXbaqoX0WVakjJqob0RfiJvIAegBKjkzsk5R6JTlehUHQA-K5BYgxuT-SuMb-YN1pHTBjlhEkxNlQnlIeCAH33BS_PqNE66_DWCjrSEPOvMtiRn1vUU8Fd_AY_F7y8y3paPfTLmMIzatE8_DmN0-050s7Pfreyp8zLwL_-eLvK60h-p7Cuv-Fcgw7-N_koNaacCQtbKC1Ej2Q1TIKxU11_B-eray2L_L84yAhpMhmtkxBZJCS8ZJ00S7XKoqyR2xn-YHmyeixkx7EDb_keq8grBIoFlCoTrGuYE5lcVi1fjk5CfBJvltHFLfVDn61mLo22bQjUBrc1b6EiueSjklpAPcK-oTt2=w640-h572-no'
	},
	body: String,
	created: {
		type: Date,
		default: Date.now
	}
});

var Post = mongoose.model('Post', postSchema);

// Post.create({
// 	title: 'MOTORHEAD',
// 	image: 'https://i.ytimg.com/vi/vTsa6JTCVaU/maxresdefault.jpg',
// 	body: "Sunrise, wrong side of another day, Sky high and six thousand miles away, Don't know how long I've been awake, Wound up in an amazing state, Can't get enough, And you know it's righteous stuff, Goes up like prices at Christmas, Motorhead, you can call me Motorhead, alright"
// });


app.get('/', function(req, res) {
	res.redirect('posts');
});

// INDEX ROUTE
app.get('/posts', function(req, res) {
	Post.find({}, function(err, foundPosts) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { posts: foundPosts} );
		}
	});	
});

// NEW ROUTE
app.get('/posts/new', function(req, res) {
	res.render('new');
});

// CREATE ROUTE
app.post('/posts', function(req, res) {
	Post.create(req.body.post, function (err, newPost) {
		if(err) {
			res.render('new');
		} else {
			res.redirect('posts');
		}	
	});
});

app.listen(PORT, process.env.IP, function() {
	console.log('Server started on port', PORT);
});