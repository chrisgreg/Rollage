var express = require('express');
var request = require('request');
var reddit = require('redwrap');
var router = express.Router();
var links = [];

// Middleware to retrieve subreddit information
router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  console.log('Building information for', req.body.subreddit);
  next();
});

// Middleware to extract images
router.use(function (req, res, next) {

	reddit.r(req.body.subreddit)[req.body.sort]().from(req.body.from).limit(100, function(err, data, res){	
		// POST variables
		var gifs = req.body.gifs;
		var nsfw = req.body.nsfw;
 		// Get image links
 		links = get_image_links(data, gifs, nsfw);
 			next();
	}); 
});

/* POST subreddit listing. */
router.post('/', function(req, res) {
   res.render('subreddit', { subreddit: req.body.subreddit, images: links, from: req.body.from, sort: req.body.sort});
   links = [];
});


/* GET subreddit listing. */
router.get('/', function(req, res) {
   res.writeHead(404, {'Content-Type': 'text/plain'});                    // <- redirect
   res.write("Looked everywhere, but couldn't find that page at all!\n"); // <- content!
   res.end();
});

// TODO : Handle imgur albums
function get_image_links(reddit_data, gifs, nsfw){
	var links = [];
	var children_data = reddit_data['data']['children'];

	for (i = 1; i < children_data.length; ++i){
		var link = children_data[i]['data']['url'];

		// Check NSFW
		if (nsfw != 'on' && children_data[i]['data']['over_18'] != false){
				continue;			
		}

		// Check for imgur link
		if (link.indexOf('imgur') > -1){
			if (is_image(link, gifs)){
				links.push(link);
			}
		}	
	}
	return links;
}


function is_image(url, gifs){
	if (gifs !== undefined){
		return is_jpg(url) || is_gif(url);
	}
	else{
		return is_jpg(url);
	}
}

function is_jpg(url){
	if (url.indexOf('.jpg') > -1)
		return true;
	return false;
}

function is_gif(url){
	if (url.indexOf('.gif') > -1)
		return true;
	return false;
}

module.exports = router;
