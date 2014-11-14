Template.menubar.helpers({
	'username':function(){
		return Meteor.user() && Meteor.user().services && Meteor.user().services.github && Meteor.user().services.github.username
	}
});