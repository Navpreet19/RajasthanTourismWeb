var express = require('express');
var router = express.Router();
var db = require('../DBfunctions/sqlDB.js');
var fs = require('fs');

var config = require('../config');
var request = require('request');


router.get('/', function(req, res, next) {
	return res.send("inside apis.js");
});


router.post('/submitProfile', function(req, res, next) {
	var name = req.body.name;
	var gender = req.body.gender;
	var dob = req.body.dob;
	var email = req.body.email;
	var fbid = req.body.fbid;

	if(fbid == "")
		return res.json({ "status": "failed", "message": "Invalid FBid!", "code": "400" });

	db.findUserByFbid(fbid, function (err, result) {
		if (err) {
	    	console.log(err);
	    	return res.json({ "status": "failed", "message": "Error!", "code": "400" });
	    }

	    if(result.length == 0) {
	    	db.addFbUser(fbid, name, gender, dob, email, function (err, result) {
				if (err) {
			    	console.log(err);
			    	return res.json({ "status": "failed", "message": "Error!", "code": "400" });
			    }
			    
				return res.json({ "status": "success", "message": "New User Added!", "code": "200" });
			});
	    }
	    else {
	    	db.updateProfile(fbid, name, gender, dob, email, function (err, result) {
				if (err) {
			    	console.log(err);
			    	return res.json({ "status": "failed", "message": "Error!", "code": "400" });
			    }
			    
				return res.json({ "status": "success", "message": "Profile updated!", "code": "200" });
			});
	    }
	});
});


router.post('/likeAnalyze', function(req, res, next) {
	var options = {
		method: 'POST',
		url: 'https://api.applymagicsauce.com/auth',
		headers: { 
			'Cache-Control': 'no-cache',
			Accept: 'application/json',
			'Content-type': 'application/json'
		},
		body: '{\r\n\t\t\t\t"customer_id": "3661",\r\n\t    \t\t"api_key": "p2shlpqe59c487eo0k2mhbcrc1"\r\n\t\t\t}' 
	};

	request(options, function (error1, response1, body1) {
		if (error1) throw new Error(error1);

		body1 = JSON.parse(body1);

		options = {
			method: 'POST',
			url: 'https://api.applymagicsauce.com/like_ids',
			headers: { 
				'Postman-Token': '3aa9e660-662b-44e3-4f60-72562ae6ff85',
				'Cache-Control': 'no-cache',
				Accept: 'application/json',
				'Content-type': 'application/json',
				'X-Auth-Token': body1.token
			},
			body: '["5845317146", "6460713406", "22404294985", "35312278675", "105930651606", "171605907303", "199592894970", "274598553922", "340368556015", "100270610030980"]'
		};


		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);

		});
	});
});


/*
Not doing image upload
This was for MongoDB probably

app.post('/upload', function(req, res) {
	console.log(req.files.image.originalFilename);
	console.log(req.files.image.path);
	
	fs.readFile(req.files.image.path, function (err, data){
		var dirname = "/home/rajamalw/Node/file-upload";
		var newPath = dirname + "/uploads/" + 	req.files.image.originalFilename;
		
		fs.writeFile(newPath, data, function (err) {
			if(err){
				res.json({'response':"Error"});
			}
			else {
				res.json({'response':"Saved"});
			}
		});
	});
});
*/


router.get('/uploads/:file', function (req, res){
	file = req.params.file;
	var dirname = "E:/projects/RajasthanTourismWeb/file-upload";
	var img = fs.readFileSync(dirname + "/uploads/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');
});


router.post('/getplacereviews', function(req, res, next) {
	var placeid = req.body.placeid;

	if(placeid == "")
		return res.json({ "status": "failed", "message": "Invalid PlaceId!", "code": "400" });

	db.findReviewsByPlaceId(placeid, function (err, result) {
		if (err) {
	    	console.log(err);
	    	return res.json({ "status": "failed", "message": "Error!", "code": "400" });
	    }

	    data = {};

	    if(result.length == 0) {
	    	return res.json({ "status": "success", "message": "No Reviews Found For This Place!", "code": "201", "data": data });	    
	    }
	    else {
	    	data.placename = result[0].placename;

	    	data.reviews = result;

			return res.json({ "status": "success", "message": "success", "code": "200", "data": data });
	    }
	});
});


router.post('/getplacestories', function(req, res, next) {
	var placeid = req.body.placeid;

	if(placeid == "")
		return res.json({ "status": "failed", "message": "Invalid PlaceId!", "code": "400" });

	db.findStoriesByPlaceId(placeid, function (err, result) {
		if (err) {
	    	console.log(err);
	    	return res.json({ "status": "failed", "message": "Error!", "code": "400" });
	    }

	    data = {};

	    if(result.length == 0) {
	    	return res.json({ "status": "success", "message": "No Reviews Found For This Place!", "code": "201", "data": data });	    
	    }
	    else {
	    	data.placename = result[0].placename;

	    	data.reviews = result;

			return res.json({ "status": "success", "message": "success", "code": "200", "data": data });
	    }
	});
});




router.get('/complaint/:id', function(req, res, next) {
	var addressid = req.params.id;

	db.findAddressByAddressId(addressid, function (err, result) {
	    if (err) {
	    	console.log(err);
	    	return res.json({ "status": "failed", "message": "Error!", "code": "400" });
	    }

	    if(result.length == 0)
    		return res.json({ "status": "failed", "message": "Article Not Found!", "code": "404" });

		return res.json({ "status": "success", "message": "ok", "code": "200", "info": result });
	});
});


router.post('/writeArticle', function(req, res, next) {
	var token = req.body.token;
	var title = req.body.title.trim();
	var content = req.body.content.trim();

	if(title == "" || content == "")
		return res.json({ "status": "failed", "message": "Invalid Input!", "code": "400" });

	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "401" });
		}

		var userid = result;

		db.findUserByUserid(userid, function (err, rows) {
		    if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		    }

		    if(rows.length == 0)
	    		return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "403" });

			var role = rows[0].role;

			if(role == 0)
		    	return res.json({ "status": "failed", "message": "Please verify your email first!", "code": "404" });

		    db.insertNewArticle(userid, title, content, function (err, result) {
				if (err) {
			    	console.log(err);
			    	return res.json({ "status": "failed", "message": "Error!", "code": "405" });
			    }
			    
				return res.json({ "status": "success", "message": "Article Submitted!", "code": "200" });
			});
		});
	});
});


router.post('/submitTranslation', function(req, res, next) {
	var token = req.body.token;
	var language = req.body.language;
	var articleid = req.body.articleid;
	var title = req.body.title.trim();
	var content = req.body.content.trim();

	if(title == "" || content == "")
		return res.json({ "status": "failed", "message": "Invalid Input!", "code": "400" });

	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "401" });
		}

		var userid = result;

		db.findUserByUserid(userid, function (err, rows) {
		    if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		    }

		    if(rows.length == 0)
	    		return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "403" });

			var role = rows[0].role;

			if(role != 2)
		    	return res.json({ "status": "failed", "message": "User not authorised for translation!", "code": "404" });

		    db.insertNewTranslation(userid, title, content, language, articleid, function (err, result) {
				if (err) {
			    	console.log(err);
			    	return res.json({ "status": "failed", "message": "Error!", "code": "405" });
			    }
			    
				return res.json({ "status": "success", "message": "Article Translation Submitted!", "code": "200" });
			});
		});
	});
});


router.post('/googleTranslate', function(req, res, next) {
	var token = req.body.token;
	jwt.getUseridFromToken(token, function (err, result) {
		if(err) 
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "401" });
		
		/*var formData = {
	       q: [req.body.title, req.body.content], 
	       target: req.body.language
	    };*/

	    var formData = "key=" + config.googletranslatekey + "&q=" + encodeURIComponent(req.body.title)
	    	+ "&q=" + encodeURIComponent(req.body.content) + "&target=" + req.body.language;

	    request.post({
	        url: 'https://translation.googleapis.com/language/translate/v2',
	        form: formData
	    },
	    function (err, httpResponse, body) {
	        if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Error translating via Google!", "code": "402" });
		    }

		    body = JSON.parse(body);

		    if (!body.data) {
		    	return res.json({ "status": "failed", "message": "Error translating via Google!", "code": "402" });
		    }

		    var data = {};
		    data.title = body.data.translations[0].translatedText;
		    data.content = body.data.translations[1].translatedText;
		    
			return res.json({ "status": "success", "message": "ok", "code": "200", "data": data });
	    });
    });
});


router.post('/changePassword', function(req, res, next) {
	var token = req.body.token;
	var password = req.body.password;
	var newpassword = req.body.newpassword;

	if(password == "")
		return res.json({ "status": "failed", "message": "Please enter password!", "code": "400" });
	if(newpassword == "")
		return res.json({ "status": "failed", "message": "Please enter new password!", "code": "401" });

	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		}

		var userid = result;

		db.findUserByUserid(userid, function (err, rows) {
		    if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		    }

		    if(rows.length == 0)
	    		return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });

	    	if(rows[0].password != password)
				return res.json({ "status": "failed", "message": "Invalid Password!", "code": "403" });

		    db.updatePassword(userid, newpassword, function (err, result) {
				if (err) {
			    	console.log(err);
			    	return res.json({ "status": "failed", "message": "Error!", "code": "405" });
			    }
			    
				return res.json({ "status": "success", "message": "Password Changed Successfuly!", "code": "200" });
			});
		});
	});
});


router.post('/submitProfile', function(req, res, next) {
	var token = req.body.token;
	var name = req.body.name;
	var gender = req.body.gender;
	var dob = req.body.dob;
	var about = req.body.about;

	if(name == "")
		return res.json({ "status": "failed", "message": "Please enter name!", "code": "401" });
	
	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		}

		var userid = result;

	    db.updateProfile(userid, name, gender, dob, about, function (err, result) {
			if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Error!", "code": "405" });
		    }
		    
			return res.json({ "status": "success", "message": "Profile updated!", "code": "200" });
		});
	});
});


router.post('/getProfile', function(req, res, next) {
	var token = req.body.token;
	
	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		}

		var userid = result;

	    db.findUserByUserid(userid, function (err, result) {
			if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		    }

		    if(result.length == 0)
	    		return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });

			var role = result[0].role;

			if(role == 0)
		    	return res.json({ "status": "failed", "message": "Please verify your email first!", "code": "403" });
  			
		    var data = {
				"name": result[0].name,
				"gender": result[0].gender,
				"dob": result[0].dob,
				"about": result[0].about
			};

			console.log(data);

			return res.json({ "status": "success", "message": "ok", "code": "200", "data": data });
			
		});
	});
});


router.post('/discussion', function(req, res, next) {
	var token = req.body.token;
	
	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "401" });
		}

		var userid = result;

		db.findUserByUserid(userid, function (err, rows) {
		    if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		    }

		    if(rows.length == 0)
	    		return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "403" });

			var role = rows[0].role;

			if(role == 0)
		    	return res.json({ "status": "failed", "message": "Please verify your email first!", "code": "404" });

		    db.getAllQuestions(function (err, result) {
				if (err) {
			    	console.log(err);
			    	return res.json({ "status": "failed", "message": "Error!", "code": "405" });
			    }

			    var data = {};
			    data.questions = result;
			    
				return res.json({ "status": "success", "message": "ok", "code": "200", "data": data });
			});
		});
	});
});


router.post('/submitQuestion', function(req, res, next) {
	var token = req.body.token;
	var question = req.body.question;
	var description = req.body.description;

	if(question == "")
		return res.json({ "status": "failed", "message": "Please write your question!", "code": "401" });
	
	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		}

		var userid = result;

	    db.insertNewQuestion(userid, question, description, function (err, result) {
			if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Error!", "code": "405" });
		    }
		    
			return res.json({ "status": "success", "message": "Question Submitted!", "code": "200" });
		});
	});
});


router.get('/question/:id', function(req, res, next) {
	var token = req.headers.token;
	var questionid = req.params.id;

	jwt.getUseridFromToken(token, function (err, result) {
		if(err) 
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "401" });

		db.findQuestionByQuestionid(questionid, function (err, result) {
		    if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Error!", "code": "402" });
		    }

		    if(result.length == 0)
	    		return res.json({ "status": "failed", "message": "Question Not Found!", "code": "403" });

	    	var data = {};

	    	data.question = {
	    		"question" : result[0].question,
				"description" : result[0].description,
				"timestamp" : result[0].timestamp,
				"askerName" : result[0].name
			};

			db.findAnswersByQuestionid(questionid, function (err, result) {
			    if (err) {
			    	console.log(err);
			    	return res.json({ "status": "failed", "message": "Error!", "code": "402" });
			    }

		    	data.answers = result;

				return res.json({ "status": "success", "message": "ok", "code": "200", "data": data });
			});
		});
	});
});


router.post('/submitAnswer', function(req, res, next) {
	var token = req.body.token;
	var questionid = req.body.questionid;
	var answer = req.body.answer;

	if(answer == "")
		return res.json({ "status": "failed", "message": "Please write your answer!", "code": "401" });
	
	jwt.getUseridFromToken(token, function (err, result) {
		if(err) {
			return res.json({ "status": "failed", "message": "Invalid User... Please Login!", "code": "402" });
		}

		var userid = result;

	    db.insertNewAnswer(userid, questionid, answer, function (err, result) {
			if (err) {
		    	console.log(err);
		    	return res.json({ "status": "failed", "message": "Error!", "code": "405" });
		    }
		    
			return res.json({ "status": "success", "message": "Answer Submitted!", "code": "200" });
		});
	});
});

module.exports = router;
