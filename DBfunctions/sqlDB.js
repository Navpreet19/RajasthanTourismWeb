var db = require('../db.js');
var funcs = {};


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