Meteor.publish('users', function(){
	if (!this.userId){
		return null
	} else {
		return Meteor.users.find(this.userId, {fields: {profile: 1, 'services.github':1}});
	};
});

Meteor.publish('candidates', function(querystring){
	if (!querystring){
		return null
	};
	// querystring = querystring.replace(/\"/g, "");
	return candidates.find({'qs':querystring});
});