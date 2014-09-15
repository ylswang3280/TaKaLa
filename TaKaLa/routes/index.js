
/*
 * GET home page.
 */
var User = require('../models/user.js'),
    crypto = require('crypto'),
    Post = require('../models/post.js');

var fs = require('fs');



module.exports = function(app){
	app.get("/", function(req, res){
		Post.get(null, function(err, posts){
				if(err){
					req.flash('error', 'Posts cannot be retrieved.');
				}
				res.render('index', { 
					title: 'Home',
					user: req.session.user,
					posts: posts,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
		});
		
	});
	
	app.get("/login", checkLogin, function(req, res){
		
		res.render('login', { 
			title: 'Login',
			user: req.session.user
		});
	});
	
	app.post("/login", function(req, res){
		
		var email = req.body.email;
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('hex');
		User.get(email, function(err, user){
			if(err){
				req.flash('error', 'no such user!');
				res.redirect('/login');
			}else if(user){
				if(user.password != password){
					req.flash('error', 'password is not correct');
					res.redirect('login');
				}else{
					req.session.user = user;
					res.redirect('/');
				}
			}else{
				req.flash('error', 'no such user!');
				res.redirect('/login');
			}
		});
	});
	
	app.get("/logout", function(req, res){
		req.session.user = null;
		req.flash('sucess', 'Logout succeeded.');
		res.redirect('/');
	});
	
	app.get("/reg", checkLogin, function(req, res){

		res.render('reg', {title: 'Register'});
		
	});
	
	app.post("/reg", function(req, res){
		console.log(req.body.username);
		var name = req.body.username;
		var password = req.body.password;
		var password_repeat = req.body.passwordRepeat;
		var email = req.body.email;
		
		if(password != password_repeat){
			req.flash('error', 'Your passwords don\'t match ');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
		    password = md5.update(req.body.password).digest('hex');
		
		var newUser = new User(name, password, email); 
		User.get(newUser.name, function(err, user){
			if(user){
				req.flash('error', 'This email is already registered!');
				return res.redirect('/reg');
			}
			newUser.save(function (err, user){
				if(err){
					req.flash('error', err);
					res.redirect('/reg');
				}
				req.session.user = user;
				req.flash('success', 'Registration succeeded!');
				res.redirect('/');
			});
		});
	});
	
    app.get('/post', checkNotLogin, function(req, res){
    	res.render('post', {
    		title: 'Post your article',
    		user: req.session.user
    	});
    });
	
    app.post('/post', checkNotLogin, function(req, res){
    	var currentUser = req.session.user;
    	var post = new Post(currentUser[0].name, req.body.title, req.body.post);
    	post.save(function(err){
    		if(err){
    			req.flash('error', err);
    			return res.redirect('/');
    		}
    		req.flash('success', 'You have sucessfully posted your article!');
    		res.redirect('/');
    	});
    });
    
    app.get('/upload', checkNotLogin, function(req, res){
    	res.render('upload', {
    		title: 'Upload',
    		user: req.session.user,
    		success: req.flash('success').toString(),
    	    error: req.flash('error').toString()
    	});
    });
    
    app.post('/upload', checkNotLogin, function(req, res){
    	for(var i in req.files){
    		if(req.files[i].size == 0){
    			fs.unlinkSync(req.files[i].path);
    			console.log('Successfully removed an empty file');
    		}else{
    			var target_path = './public/images/' + req.files[i].name;
    			fs.renameSync(req.files[i].path, target_path);
    		}
    	} 
    	req.flash('success', 'uploaded successfully');
    	res.redirect('/upload');
    });
    
    
    
    
	function checkLogin(req, res, next){		
		if(req.session.user){
			req.flash('error', 'You have already logged in!');
			return res.redirect('/');
		}	
		next();
	}
	
	function checkNotLogin(req, res, next){
		if(!req.session.user){
			return res.redirect('/login');
		}
		next();
	}
	
};
