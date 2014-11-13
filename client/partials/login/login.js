Template.login.events({
	'click [action=signin]':function(e){
		Meteor.loginWithGithub({
			requestPermissions:["user"]
		}, function(e){
			if (e){
				alert(e);
				console.log("Error Logging In:", e);
			} else {
				Router.go('/search');
			}
		})
	}
})