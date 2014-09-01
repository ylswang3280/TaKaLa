
/*
 * GET home page.
 */
var User = require('../models/user.js'),
    crypto = require('crypto');



module.exports = function(app){
	app.get("/", function(req, res){
		res.render('index', { 
			title: 'Home',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	
	app.get("/login", function(req, res){
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
			}else{
				if(user.password != password){
					req.flash('error', 'password is not correct');
					res.redirect('login');
				}else{
					req.session.user = user;
					res.redirect('/');
				}
			}
		});
	});
	
	app.get("/reg", function(req, res){
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
	
	app.post("/signup", function(req, res){
		console.log(req.body);
		var name = req.body.username;
		var password = req.body.password;
		var roy = new User("Yu", "15");
		if(name != null && password != null){
			res.render('index', { 
				title: 'Home',
				name: name,
				age: password
			});
		}else{
			res.render('index', { 
				title: 'Home',
				name: 'tt',
				age: '15'
			});
		}
	});
	
};
