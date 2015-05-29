Meteor.startup(function(){
	// ServiceConfiguration.configurations.remove({
	//   service: "github"
	// });
	if (ServiceConfiguration.configurations.find().count() === 0){
		ServiceConfiguration.configurations.insert({
		  service: "github",
		  clientId: process.env.GITHUB_CLIENTID,
		  loginStyle: "popup",
		  secret: process.env.GITHUB_SECRET
		});
	};
});

Router.route('/test', function(){
	 // NodeJS request object
	  var request = this.request;

	  // NodeJS  response object
	  var response = this.response;

	var j = Meteor.call('testcall');
	console.log(j);
	return response.end(j);
}, {where:'server'});
