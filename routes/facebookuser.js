var express = require('express');
var FB = require('fb');
var config = require('../config');
var db = require('../DBfunctions/sqlDB.js');
var router = express.Router();


router.get('/', function(req, res, next) {
	return res.send('Unauthorized Access');
});


var url = 'https://www.facebook.com/dialog/oauth?client_id=' + config.FACEBOOK_CLIENT_ID + '&scope=email,public_profile' + '&redirect_uri=';
var reRequestUrl = 'https://www.facebook.com/dialog/oauth?client_id=' + config.FACEBOOK_CLIENT_ID + '&auth_type=rerequest&scope=email&redirect_uri=';


router.get('/login', function(req, res, next) {
	var ru = req.query.ru;
	var state = encodeURIComponent(ru);
	res.redirect(url + config.FACEBOOK_REDIRECT_URL + '&state=' + state);
});


router.get('/callback', function(req, res, next) {
	var data = {};
	var ru = req.query.state;
	var fb_redirect_uri = config.FACEBOOK_REDIRECT_URL;
	data.ru = encodeURIComponent(ru);

	FB.api('oauth/access_token', {
		client_id: config.FACEBOOK_CLIENT_ID,
		client_secret: config.FACEBOOK_CLIENT_SECRET,
		redirect_uri: fb_redirect_uri,
		code: req.query.code
	}, function (tokens) {
		if(!tokens || tokens.error) {
			console.log(!tokens ? 'error occurred' : tokens.error);
			return res.render('fblogin', { "status": "failed", "message": "FB Error!", "code": 412, "data": data });
		}
		var accessToken = tokens.access_token;
		//var expires = tokens.expires ? tokens.expires : 0;

		FB.api('/me', { access_token: accessToken, fields: ['id', 'name', 'email', 'birthday', 'gender'] }, function (fresponse) {
			if(!fresponse || fresponse.error) {
				console.log(!fresponse ? 'error occurred' : fresponse.error);
				return res.render('fblogin', { "status": "failed", "message": "FB Error!", "code": 412, "data": data });
			}
			
			var fbid = fresponse.id;
			var name = fresponse.name;
			var email = fresponse.email;
			var gender = fresponse.gender;
			if(gender && (gender.toLowerCase() == 'male' || gender.toLowerCase() == 'female'))
				gender = gender.toLowerCase().charAt(0);
			else
				gender = '';

			if(fbid == null) {
				console.log('null fbid');
				return res.render('fblogin', { "status": "failed", "message": "FB Error!", "code": 412, "data": data });
			}

			db.findUserByFbid(fbid, function(err, response) {
				if (err) {
					console.log(err);
					return res.render('fblogin', { "status": "failed", "message": "DB Error!", "code": 411, "data": data });
				}
				if(response.length == 0) {
					if(email == null) {
						//return res.render('fblogin', { "status": "failed", "message": "Email Not Found!", "code": 415, "data": data });
						email = '' + fbid + '@facebook.com';
					}

					db.addFbUser(fbid, name, email, gender, function(err, response2) {
						if (err) {
							console.log(err);
							return res.render('fblogin', { "status": "failed", "message": "DB Error!", "code": 411, "data": data });
						}
						if(response2.length != 0) {
							data = fun.getLoginDataFromUser(response2[0], data);
							return res.render('fblogin', { "status": "success", "message": "Login Successful!", "code": 200, "data": data });							
						} 
						else {
							return res.render('fblogin', { "status": "failed", "message": "Invalid User!", "code": 414, "data": data });
						}
					});
				} 
				else if(response[0].role == 0) {
					return res.render('fblogin', { "status": "failed", "message": "User Blocked!", "code": 413, "data": data });
				} 
				else if(response[0].userid == null) {
					return res.render('fblogin', { "status": "failed", "message": "Invalid User!", "code": 414, "data": data });
				} 
				else {
					data = fun.getLoginDataFromUser(response[0], data);
					return res.render('fblogin', { "status": "success", "message": "Login Successful!", "code": 200, "data": data });
				}
			});
		});
	});
});


router.get('/continue', function(req, res, next) {
	var ru = req.query.ru;
	var state = encodeURIComponent(ru);
	res.redirect(reRequestUrl + config.FACEBOOK_REDIRECT_URL + '&state=' + state);
});


/*
router.get('/accesstoken', function(req, res, next) {
	var turl = 'https://graph.facebook.com/v2.3/oauth/access_token?client_id=' + config.FACEBOOK_CLIENT_ID + '&redirect_uri=' + config.FACEBOOK_REDIRECT_URL + '&client_secret=' + config.FACEBOOK_CLIENT_SECRET + '&code=' + req.query.code;
	res.redirect(turl);
});


router.get('/profile', function(req, res, next) {
	var turl = 'https://graph.facebook.com/v2.3/me?access_token=' + req.query.accessToken + '&fields=email,name,first_name,last_name,birthday,gender,verified,religion,location';
	res.redirect(turl);
});
*/


module.exports = router;