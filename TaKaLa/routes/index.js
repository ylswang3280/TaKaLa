
/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/

     function User(name, age){
    	 this.name = name;
    	 this.age = age;
     }

module.exports = function(app){
	app.get("/", function(req, res){
		
		
		var roy = new User("Yu", "15");
		res.render('index', { 
			title: 'Home',
			name: 'Roy',
			age: '13',
			user: roy
		});
	});
	
	app.get("/login", function(req, res){
		res.render('login', { title: 'Login'});
	});
	
	app.get("/reg", function(req, res){
		res.render('reg', {title: 'Register'});
	});
};
