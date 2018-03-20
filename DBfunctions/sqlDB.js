var db = require('../db.js');
var funcs = {};




funcs.findUserByFbid = function(fbid, callback) {
	var qry = 'SELECT * FROM users WHERE fbid = ?';

	db.get().query(qry, [fbid], function (err, rows) {
		return callback(err, rows);
	});
}


funcs.addFbUser = function(fbid, name, gender, dob, email, Concentration_Journalism, Concentration_Education, Concentration_Art, Concentration_History, Satisfaction_Life, callback) {
	var qry = 'INSERT INTO users (fbid, name, gender, dob, email, Concentration_Journalism, Concentration_Education, Concentration_Art, Concentration_History, Satisfaction_Life) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

	db.get().query(qry, [fbid, name, gender, dob, email, Concentration_Journalism, Concentration_Education, Concentration_Art, Concentration_History, Satisfaction_Life], function (err, result) {
		if (err) {
			console.log('sqlDB: ' + err);
			return callback(err, result);
		}

		funcs.findUserByFbid(fbid, function (err, result) {
			return callback(err, result);
		});
	});
}


funcs.updateProfile = function(fbid, name, gender, dob, email, Concentration_Journalism, Concentration_Education, Concentration_Art, Concentration_History, Satisfaction_Life, callback) {
	var qry = 'UPDATE users SET name = ?, gender = ?, dob = ?, email = ?, Concentration_Journalism = ?, Concentration_Education = ?, Concentration_Art = ?, Concentration_History = ?, Satisfaction_Life = ? WHERE fbid = ?';

	db.get().query(qry, [name, gender, dob, email, Concentration_Journalism, Concentration_Education, Concentration_Art, Concentration_History, Satisfaction_Life, fbid], function (err, result) {
		return callback(err, result);
	});
}


funcs.findReviewsByPlaceId = function(placeid, callback) {
	var qry = "SELECT U.name, P.name AS placename, R.userid, R.text, R.photo, R.created FROM placereview R, places P, users U WHERE R.place = ? AND P.placeid = R.place AND U.fbid = R.userid";

	db.get().query(qry, [placeid], function (err, rows) {
		return callback(err, rows);
	});
}


funcs.findStoriesByPlaceId = function(placeid, callback) {
	var qry = "SELECT U.name, P.name AS placename, S.userid, S.photo, S.created FROM placestory S, places P, users U WHERE S.place = ? AND P.placeid = S.place AND U.fbid = S.userid";

	db.get().query(qry, [placeid], function (err, rows) {
		return callback(err, rows);
	});
}


funcs.findInterestBasedPlaces = function(placeinterests, callback) {
	var qry = "SELECT name, description AS text, photo FROM places WHERE category IN (" + placeinterests + ")";

	db.get().query(qry, function (err, rows) {
		return callback(err, rows);
	});
}




funcs.findAddressByAddressId = function(addressid, callback) {
	var qry = "SELECT * FROM complaintaddresses A, complaint T WHERE A.addressid = ? AND T.addressid = A.addressid";

	db.get().query(qry, [addressid], function (err, rows) {
		return callback(err, rows);
	});
}


funcs.findObjectByObjectId = function(objectid, callback) {
	var qry = "SELECT * FROM complaintaddresses A, complaint T WHERE A.addressid = ? AND T.addressid = A.addressid";

	db.get().query(qry, [objectid], function (err, rows) {
		return callback(err, rows);
	});
}


module.exports = funcs;