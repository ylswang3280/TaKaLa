var mongodb = require('./db');

function Post(name, title, post){
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback){
	var date = new Date();
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth() + 1),
		day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDay(),
		minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};
	var post = {
		name: this.name,
		title: this.title,
		time: time,
		post: this.post
	};
	
	
	mongodb.open(function(err, db){
		if(err){
			callback(db);
		}
		db.collection('posts', function(err, col){
			if(err){
				mongodb.close();
				return callback(err);
			}
			col.insert(post, {w: 1}, function(err){
				if(err){
					mongodb.close();
					callback(err);
				}
				mongodb.close();
				callback(null);
			});
		});
	});
};

Post.get = function(name, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name; 
			}
			 collection.find(query).sort({time: -1}).toArray(function(err, docs){
				 if(err){
					 mongodb.close();
					 return callback(err);
				 }
				 mongodb.close();
				 callback(null, docs);
			 });
		});
		
	});
};