var funcs = {};




funcs.isProfileComplete = function (user) {
	if(!user.phone || !user.college || !user.studentid)
		return false;

	return true;
}


funcs.checkOrdersRole = function (user) {
	if(user.role == 11)
		return 200;
		//means there is a pending 1 hour order

	return 400;
	//means there is no pending 1 hour order
}


funcs.getLoginDataFromUser = function (user, data) {
	data.name = user.name;

	if(funcs.isProfileComplete(user))
		data.complete = 200;
	else
		data.complete = 400;

	data.orders = funcs.checkOrdersRole(user);


	return data;
}




module.exports = funcs;