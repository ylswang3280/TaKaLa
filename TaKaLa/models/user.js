var mongodb = require('./db');


function User(name, password, email){
	this.name = name;
	this.password = password;
	this.email = email;
}

module.exports = User;

   User.prototype.save = function(callback){
	   var user = {
			 name: this.name,
			 password: this.password,
			 email: this.email
	   };
	   mongodb.open(function(err, db){
		   if(err){
			   mongodb.close();
			   return callback(err);
		   }
		   db.collection('takala_users', function(err, col){
			   if(err){
				   mongodb.close();
				   return callback(err);
			   }
			   col.insert(user, {w:1}, function(err, user){
				   if(err){
					   return callback(err);
				   }
				   callback(null, user[0]);
			   });
		   });
	   });
   };
   
   User.get = function(email, callback){
	   mongodb.open(function(err, db){
		   if(err){
			   mongodb.close();
			   callback(err);
		   }
		   db.collection('takala_users', function(err, col){
			   if(err){
				   mongodb.close();
				   return callback(err);
			   }
			   col.findOne({email: email}, function(err, user){
				   
				   if(err){
					   mongodb.close();
					   return callback(err);
				   }
				   mongodb.close();
				   callback(null, user);
			   });
		   });
	   });
   };
