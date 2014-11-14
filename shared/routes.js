Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params

  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.redirect('/');
  } else {
    this.next();
  }
}, {
	only: ['search']
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/search', function(){
	this.render('search');
});

Router.route('/logout', function(){
	var self = this;
	Meteor.logout(function(e){
		if (!e){
			self.redirect('/');
		};
	});
})